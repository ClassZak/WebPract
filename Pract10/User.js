class User{
	static Users = [];

	constructor(data){
		if(!data)
			throw new Error('Нет данных для создания');

		this.login		= data.login	|| '';
		this.password	= data.password || '';
		this.sity		= data.sity		|| '';
	}
}