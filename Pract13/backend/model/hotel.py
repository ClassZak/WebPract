from model.modelmeta import ModelMeta

class Hotel(metaclass=ModelMeta):
	id = {
		'field_meta': {
			'type': int,
			'min_value': 1,
			'db_column': {
				'name': 'Id',
				'primary_key': True,
				'foreign_key': False
			}
		}
	}
	name = {
		'field_meta': {
			'type': str,
			'max_len': 100,
			'required': True,
			'db_column': {
				'name': 'Name'
			}
		}
	}
	description = {
		'field_meta':{
			'type': str,
			'max_len': 1<<64,
			'required': True,
			'db_column': {
				'name' : 'Description'
			}
		}
	}
	roomsCount = {
		'field_meta':{
			'type': int,
			'max_value' : 10_000,
			'required': True,
			'db_column': {
				'name' : 'RoomsCount'
			}
		}
	}