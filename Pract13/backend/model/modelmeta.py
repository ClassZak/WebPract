class ModelMeta(type):
	def __new__(cls, name, bases, dct):
		fields_meta = {}
		db_columns = {
			'columns': {},
			'primary_keys': [],
			'foreign_keys': {}
		}

		for attr_name, attr_value in dct.items():
			if isinstance(attr_value, dict) and 'field_meta' in attr_value:
				meta = attr_value['field_meta']
				fields_meta[attr_name] = meta
				
				# Обработка db_column
				db_settings = meta.get('db_column', {'name': attr_name})
				column_name = db_settings['name']
				
				# Сохраняем информацию о столбцах
				db_columns['columns'][attr_name] = column_name
				
				# Обработка первичных ключей
				if db_settings.get('primary_key', False):
					db_columns['primary_keys'].append(attr_name)
				
				# Обработка внешних ключей
				if 'foreign_key' in db_settings:
					db_columns['foreign_keys'][attr_name] = db_settings['foreign_key']

		dct['FIELDS_META'] = fields_meta
		dct['DB_COLUMNS'] = db_columns
		
		# Создаем словарь для вставки - исключаем первичные ключи
		db_columns_insert = {}
		for attr_name, column_name in db_columns['columns'].items():
			# Исключаем первичные ключи и добавляем остальные поля
			if attr_name not in db_columns['primary_keys']:
				db_columns_insert[attr_name] = column_name
		
		dct['DB_COLUMNS_INSERT'] = db_columns_insert
		
		dct['DB_COLUMNS_INSERT_KEYS'] = list(db_columns_insert.keys())
		dct['DB_COLUMNS_INSERT_VALUES'] = list(db_columns_insert.values())

		dct['DB_COLUMNS_KEYS'] = list(db_columns['columns'].keys())
		dct['DB_COLUMNS_VALUES'] = list(db_columns['columns'].values())

		return super().__new__(cls, name, bases, dct)