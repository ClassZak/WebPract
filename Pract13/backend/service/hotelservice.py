from typing import Tuple
from flask import Response, jsonify, Request, Flask
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

