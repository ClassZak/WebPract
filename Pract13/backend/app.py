import os
import requests
from typing import Dict
from flask import Flask, Request, json, render_template, request, jsonify
from markupsafe import escape
import mysql.connector
import base64
from datetime import datetime

from markupsafe import escape



# Настройка CSRF
from flask_wtf.csrf import CSRFProtect


print(os.getcwd())
def load_app_config(filename:str='Pract13/backend/.config.json'):
	with open(filename, 'r', encoding='UTF-8') as file:
		return json.load(file)

app = Flask(
	__name__,
	static_folder='../frontend/static',
	template_folder='../frontend/template'
)

CONFIG = load_app_config()
#app.secret_key = CONFIG['secret_key']
#csrf = CSRFProtect(app)










# Логи
log_path = ''
def log_visit(ip, path):
	"""Записывает посещение в лог-файл"""
	timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
	with open(log_path, "a") as f:
		f.write(f"{timestamp} - IP: {ip} - Path: {path}\n")

@app.before_request
def track_visit():
	"""Регистрирует посещение перед обработкой запроса"""
	# Определяем реальный IP клиента
	client_ip = request.headers.get('X-Forwarded-For', request.remote_addr)
	if ',' in client_ip:
		client_ip = client_ip.split(',')[0].strip()
	
	log_visit(client_ip, request.path)







EMAILJS_CONFIG=load_app_config("Pract13/backend/.emailjsconfig.json")


# Получение словаря из формы
def get_dict_from_request_form(request:Request) -> Dict:
	return {
		k:v
		for k in request.form.keys() 
			for v in request.form.getlist(k)
	}
def send_simple_email(public_key, service_id, template_id, to_email, message, from_name="Hotel Reservation"):
	url = "https://api.emailjs.com/api/v1.0/email/send"
	
	data = {
		"user_id": public_key,
		"service_id": service_id,
		"template_id": template_id,
		"template_params": {
			"to_name": to_email,
			"client_email": to_email,
			"from_name": from_name,
			"message": message
		}
	}
	
	try:
		response = requests.post(url, json=data)
		response.raise_for_status()
		
		return {
			"success": True,
			"message": "Письмо успешно отправлено",
			"status_code": response.status_code
		}
		
	except requests.exceptions.RequestException as e:
		error_msg = f"Ошибка отправки письма: {str(e)}"
		if hasattr(e, 'response') and e.response is not None:
			error_msg += f" - Response: {e.response.text}"
		return {
			"success": False,
			"message": error_msg,
			"status_code": getattr(e.response, 'status_code', 500) if hasattr(e, 'response') else 500
		}


# Маршруты
@app.route('/')
def root():
	return render_template('index.html')

@app.route('/api/hotel_reservation/new', methods=['POST'])
def hotel_reservation_new():
	data = get_dict_from_request_form(request)
	if not data:
		data = request.get_json()

	try:
		connection = mysql.connector.connect(
			host=CONFIG['host'],
			user=CONFIG['user'],
			password=CONFIG['password'],
			database=CONFIG['database'],
			charset='utf8mb4',
			collation='utf8mb4_unicode_ci',
		)
		cursor = connection.cursor(dictionary=True)

		# Проверяем доступность комнат
		check_query = """
			SELECT 
				h.RoomsCount AS total_rooms,
				COALESCE(SUM(hr.RoomsCount), 0) AS booked_rooms
			FROM Hotel h
			LEFT JOIN HotelReservation hr ON 
				h.Id = hr.IdHotel 
				AND NOT (hr.EndDate <= %s OR hr.StartDate >= %s)
			WHERE h.Id = %s
			GROUP BY h.Id
			HAVING total_rooms - booked_rooms >= %s
		"""
		cursor.execute(check_query, (
			data['startDate'],
			data['endDate'],
			data['hotel'],
			data['roomsCount']
		))
		availability = cursor.fetchone()

		if not availability:
			return jsonify({
				'success': False,
				'message': 'Недостаточно свободных комнат на выбранные даты'
			}), 400

		# Получаем ID возрастной категории
		query = """
			SELECT Id AS id
			FROM AgeDescription
			WHERE `Name` = %s
		"""
		cursor.execute(query, (data['age'],))
		age_result = cursor.fetchone()
		if not age_result:
			return jsonify({
				'success': False,
				'message': 'Указана неверная возрастная категория'
			}), 400
		age_desc_id = age_result['id']

		# Добавляем бронирование
		query = """
			INSERT INTO HotelReservation 
			(IdHotel, Surname, NumberPeople, RoomsCount, StartDate, EndDate, Email, IdAgeDescription)
			VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
		"""
		cursor.execute(query, (
			data['hotel'],
			data['surname'],
			data['numberPeople'],
			data['roomsCount'],
			data['startDate'],
			data['endDate'],
			data['email'],
			age_desc_id
		))
		reservation_id = cursor.lastrowid

		# Обрабатываем дополнительные услуги
		if data.get('additional'):
			query = """
				SELECT Id AS id
				FROM HotelReservationAdditional
				WHERE `Name` IN ({})
			""".format(','.join(['%s'] * len(data['additional'])))
			cursor.execute(query, data['additional'])
			additional_ids = [row['id'] for row in cursor.fetchall()]

			# Связываем услуги с бронированием
			link_query = """
				INSERT INTO HotelReservation_HotelReservationAdditional
				(IdHotelReservation, IdHotelReservationAdditional)
				VALUES (%s, %s)
			"""
			for add_id in additional_ids:
				cursor.execute(link_query, (reservation_id, add_id))

		connection.commit()

		# После успешного бронирования отправляем email
		email_text = f"""
		Подтверждение бронирования #{reservation_id}
		
		Фамилия: {data['surname']}
		Количество гостей: {data['numberPeople']}
		Возраст гостей: {data['age']}
		Количество комнат: {data['roomsCount']}
		Дата заезда: {data['startDate']}
		Дата выезда: {data['endDate']}
		"""
		if data.get('additional'):
			email_text += f"""Дополинительно:
			{'\n'.join([additional.capitalize() for additional in data['additional']])}"""

		email_result = send_simple_email(
			public_key=EMAILJS_CONFIG['public_key'], 
			service_id=EMAILJS_CONFIG['service_key'],
			template_id=EMAILJS_CONFIG['template_key'], 
			to_email=data['email'],
			message=email_text,
			from_name="Отель"
		)

		if not email_result['success']:
			print(f"Ошибка отправки email: {email_result['message']}")

		return jsonify({
			'message': 'Бронирование успешно создано',
			'reservation_id': reservation_id
		}), 201

	except Exception as e:
		if 'connection' in locals():
			connection.rollback()
		print(f"Ошибка: {str(e)}")
		return jsonify({
			'error': 'Внутренняя ошибка сервера'
		}), 500
	finally:
		if 'cursor' in locals():
			cursor.close()
		if 'connection' in locals():
			connection.close()
	
@app.route('/admin')
def admin():
	return render_template('admin.html')

@app.route('/api/hotels', methods=['GET', 'POST', 'DELETE', 'PUT'])
def hotels():
	try:
		connection = mysql.connector.connect(
			host	 = CONFIG['host'],
			user	 = CONFIG['user'],
			password = CONFIG['password'],
			database = CONFIG['database'],
			charset	 ='utf8mb4',
			collation='utf8mb4_unicode_ci',
		)
		cursor = connection.cursor(dictionary=True)
		if request.method == 'GET':
			query = """
				SELECT Id AS id, `Name` AS name, `Description` AS description, RoomsCount AS roomsCount
				FROM Hotel
			"""
			cursor.execute(query)
			raw_data = cursor.fetchall()
			return jsonify({'hotels':[{
					key : row[key] for key in row.keys()
				}
				for row in raw_data
			]})
		elif request.method == 'POST':
			data = get_dict_from_request_form(request)
			if not data:
				data = request.get_json()
			query = f"""
				INSERT INTO Hotel (`Name`, `Description`, RoomsCount) VALUES
				({','.join(['%s'] * 3)})
			"""
			cursor.execute(query, (data['name'],data['description'],data['roomsCount']))

			connection.commit()
			return jsonify({'message' : "Создано успешно"}), 201
		elif request.method == 'PUT':
			data = get_dict_from_request_form(request)
			if not data:
				data = request.get_json()
			
			if 'id' not in data:
				return jsonify({'error': 'ID is required for update'}), 400
				
			query = """
				UPDATE Hotel 
				SET `Name` = %s, `Description` = %s, RoomsCount = %s 
				WHERE Id = %s
			"""
			cursor.execute(query, (data['name'], data['description'], data['roomsCount'], data['id']))
			
			connection.commit()
			return jsonify({'message': "Обновлено успешно"}), 200
		elif request.method == 'DELETE':
			data = get_dict_from_request_form(request)
			if not data:
				data = request.get_json()
			id_for_delete = data['id']

			query = """
				DELETE FROM Hotel
				WHERE Id = %s
			"""
			cursor.execute(query, (id_for_delete,))

			connection.commit()
			return jsonify({'message' : "Удалено успешно"}), 200
	except Exception as e:
		if 'connection' in locals():
			connection.rollback()
		print(f"Ошибка: {str(e)}")
		return jsonify({
			'error': 'Внутренняя ошибка сервера'
		}), 500
	finally:
		if 'cursor' in locals():
			cursor.close()
		if 'connection' in locals():
			connection.close()

# API для получения всех бронирований
@app.route('/api/reservations', methods=['GET'])
def get_reservations():
	try:
		connection = mysql.connector.connect(
			host	 = CONFIG['host'],
			user	 = CONFIG['user'],
			password = CONFIG['password'],
			database = CONFIG['database'],
			charset	 ='utf8mb4',
			collation='utf8mb4_unicode_ci',
		)
		cursor = connection.cursor(dictionary=True)
		
		query = """
			SELECT	r.Id AS id, r.IdHotel AS idHotel, r.Surname AS surname,
					r.NumberPeople AS numberPeople, r.RoomsCount as roomsCount,
					r.StartDate AS startDate,
					r.EndDate AS endDate,
					r.Email AS email,
					r.IdAgeDescription AS idAgeDescription,

					h.Name as hotelName 
			FROM HotelReservation r 
			LEFT JOIN Hotel h ON r.IdHotel = h.Id 
			ORDER BY r.StartDate DESC
		"""
		cursor.execute(query)
		reservations = cursor.fetchall()
		
		return jsonify({'reservations': reservations})
		
	except Exception as e:
		print(f"Ошибка при получении бронирований: {str(e)}")
		return jsonify({'error': 'Ошибка сервера'}), 500
	finally:
		if 'cursor' in locals():
			cursor.close()
		if 'connection' in locals():
			connection.close()
# Точка входа
def main():
	try:
		global log_path
		with open('Pract13/backend/.config.json', 'r', encoding='UTF-8') as file:
			config=json.load(file)
			log_path = config['log_file'] if 'log_file' in config.keys() else 'visits.log'

		
		app.run(debug=True, host='0.0.0.0', port=5001)
	except Exception as e:
		print(e)
		pass

if __name__=='__main__':
	main()