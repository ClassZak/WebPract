import os
from typing import Dict
from flask import Flask, Request, json, render_template, request, jsonify
from markupsafe import escape
import mysql.connector
import base64
from datetime import datetime

from markupsafe import escape



# Настройка CSRF
from flask_wtf.csrf import CSRFProtect

def get_app_config(filename:str='Pract13/backend/.config.json'):
	with open(filename, 'r', encoding='UTF-8') as file:
		return json.load(file)

app = Flask(
	__name__,
	static_folder='../frontend/static',
	template_folder='../frontend/template'
)
app.secret_key = get_app_config()['secret_key']
csrf = CSRFProtect(app)










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










# Получение словаря из формы
def get_dict_from_request_form(request:Request) -> Dict:
	return {
		k:v
		for k in request.form.keys() 
			for v in request.form.getlist(k)
	}



# Маршруты
@app.route('/')
def root():
	return render_template('index.html')

@app.route('/api/goods/new/',methods=['GET'])
def new_goods_route():
#	try:
#		return good_service.read_new_goods()
#	except Exception as e:
#		return jsonify({'error': 'Internal Server Error'}), 500
	pass
	



# Точка входа
def main():
	try:
		global log_path
		with open('Pract13/backend/.config.json', 'r', encoding='UTF-8') as file:
			config=json.load(file)
			
			log_path = config['log_file'] if 'log_file' in config.keys() else 'visits.log'

		
		app.run(debug=True, host='0.0.0.0', port=5000)
	except Exception as e:
		pass

if __name__=='__main__':
	main()