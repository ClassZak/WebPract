class HotelReservation{
	static HotelReservations = [];

	constructor(data){
		if(!data)
			throw new Error('Нет данных для создания');

		this.surname		= data.surname		|| '';
		this.numberPeople	= data.numberPeople || '';
		this.rooms_count	= data.rooms_count	|| '';
		this.inputDate		= data.inputDate	|| '';
		this.inputDate2		= data.inputDate2	|| '';
		this.additional		= data.additional	|| '';
		this.age			= data.age			|| '';
		this.email			= data.email		|| '';
	}
	toString() {
		return `Бронь отеля: 
ФИО: ${this.surname}
С ${this.inputDate} по ${this.inputDate2} 
Количество человек ${this.numberPeople}
Количество комнат ${this.rooms_count}
Возраст: ${this.age}
Дополнительно: ${this.additional}`;
	}
}