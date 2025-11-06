from typing import Tuple
from flask import Response, jsonify
from sqlite3 import IntegrityError
from mysql.connector import Error


from validator.modelvalidator import ModelValidator
from model.hotel import Hotel
from service.aservice import AService

class HotelService(AService):
	TABLE_NAME = 'Hotel'
	#COLUMNS = [Hotel.DB_COLUMNS['columns'][field] for fiel in ]
	"""
	CREATE TABLE Hotel(
		Id				INT AUTO_INCREMENT PRIMARY KEY,
		`Name`			VARCHAR(100) NOT NULL,
		`Description`	LONGTEXT NOT NULL,
		RoomsCount		INT
	);
	"""

	def __init__(self, config_file:str):
		super().__init__(config_file)

	"""
		CRUD операции
	"""
	def create(self, data:dict) ->Tuple[Response, int]:
		try:
			validated = ModelValidator.validate(data,Hotel.FIELDS_META)
			query = f"""
				INSERT INTO {HotelService.TABLE_NAME}
				({','.join(Hotel.DB_COLUMNS_INSERT_VALUES)}) VALUES
				({','.join(['%s']*len(Hotel.DB_COLUMNS_INSERT_VALUES))})
			"""
			self.connect()
			self.cursor.execute(query, tuple(validated.values()))
			self.connection.commit()

			return jsonify({'message':'Новый объект успешно создан'}), 201
		except ValueError as e:
			return jsonify({'error' : str(e)}), 400
		except IntegrityError as e:
			self.connection.rollback()
			return jsonify({'error' : f'Ошибка БД: {str(e)}'}), 500
		except Error as e:
			if self.connection:
				try:
					self.connection.rollback()
				except:  # noqa: E722
					pass
			return jsonify({'error' : f'Ошибка БД: {str(e)}'}), 500
		finally:
			self.disconnect()
	def read(self) ->Tuple[Response, int]:
		try:
			query = f"""
				SELECT {','.join(Hotel.DB_COLUMNS_VALUES)}
				FROM {HotelService.TABLE_NAME}
			"""
			self.connect()
			self.cursor.execute(query)
			raw_data = self.cursor.fetchall()

			return jsonify({'hotels':[{
					field: str(row[Hotel.DB_COLUMNS['columns'][field]]) 
					for field in Hotel.DB_COLUMNS_KEYS
				}
				for row in raw_data
			]}), 200
		except ValueError as e:
			return jsonify({'error' : str(e)}), 400
		except IntegrityError as e:
			self.connection.rollback()
			return jsonify({'error' : f'Ошибка БД: {str(e)}'}), 500
		except Error as e:
			if self.connection:
				try:
					self.connection.rollback()
				finally:
					pass
			return jsonify({'error' : f'Ошибка БД: {str(e)}'}), 500
		finally:
			self.disconnect()
	def update(self, data:dict) ->Tuple[Response, int]:
		try:
			if not self.exists(data['id']):
				return jsonify({'error' : 'Не найден объект для удаления'}), 404
			
			validated = ModelValidator.validate(data,Hotel.FIELDS_META)
			query = f"""
				UPDATE {HotelService.TABLE_NAME}
				SET {','.join([f"`{col}` = %s" for col in Hotel.DB_COLUMNS_INSERT_VALUES])}
				WHERE Id = %s
			"""
			self.connect()
			self.cursor.execute(query, tuple(validated.values()))
			self.connection.commit()

			return jsonify({'message':'Объект успешно изменён'}), 200
		except ValueError as e:
			return jsonify({'error' : str(e)}), 400
		except IntegrityError as e:
			self.connection.rollback()
			return jsonify({'error' : f'Ошибка БД: {str(e)}'}), 500
		except Error as e:
			if self.connection:
				try:
					self.connection.rollback()
				finally:
					pass
			return jsonify({'error' : f'Ошибка БД: {str(e)}'}), 500
		finally:
			self.disconnect()
	def delete(self, id:int) ->Tuple[Response, int]:
		try:
			if not self.exists(id):
				return jsonify({'error' : 'Не найден объект для удаления'}), 404

			query = f"""
				DELETE FROM {HotelService.TABLE_NAME}
				WHERE Id = %s
			"""
			self.connect()
			self.cursor.execute(query, (id,))
			self.connection.commit()

			return jsonify({'message':'Объект успешно удалён'}), 200
		except ValueError as e:
			return jsonify({'error' : str(e)}), 400
		except IntegrityError as e:
			self.connection.rollback()
			return jsonify({'error' : f'Ошибка БД: {str(e)}'}), 500
		except Error as e:
			if self.connection:
				try:
					self.connection.rollback()
				finally:
					pass
			return jsonify({'error' : f'Ошибка БД: {str(e)}'}), 500
		finally:
			self.disconnect()
	"""
		CRUD операции
	"""

	def exists(self, id:int) ->bool:
		try:
			query = f"""
				SELECT EXISTS(
					SELECT 1
						FROM {HotelService.TABLE_NAME}
						WHERE Id = %s
				) AS exists_id
			"""
			self.connect()
			self.cursor.execute(query, (id,))

			result = self.cursor.fetchone()
			return bool(result['exists_id']) if result else False
		finally:
			self.connection.disconnect()
