class HotelReservation {
	static HotelReservations = [];

	constructor(data) {
		if (!data) throw new Error('Нет данных для создания');

		this.surname = data.surname || '';
		this.numberPeople = data.numberPeople || data.number_people || 1;
		this.roomsCount = data.roomsCount || 1;
		this.startDate = data.startDate || data.check_in_date || '';
		this.endDate = data.endDate || data.check_out_date || '';
		this.additional = Array.isArray(data.additional) ? data.additional : 
						(data.additional ? [data.additional] : []);
		this.age = data.age || '';
		this.email = data.email || '';
		this.hotel = data.hotel || data.hotel_id || 0;
	}

	toString() {
		const hotelObj = Hotel.Hotels.find(element => element.id == this.hotel);
		const hotelName = hotelObj ? hotelObj.name : 'Неизвестный отель';
		
		return `Бронь отеля: 
ФИО: ${this.surname}
С ${this.startDate} по ${this.endDate} 
Количество человек: ${this.numberPeople}
Количество комнат: ${this.roomsCount}
Возрастная группа: ${this.age}
Дополнительно: ${this.additional.join(', ')}
Email: ${this.email}
Отель: ${hotelName}`;
	}

	/*
	 *	Создание брони отеля.
		Требуется обработчик try catch
	 * @param {*} hotelReservation 
	*/
	static async createHotelReservation(hotelReservation) {
		const response = await fetch('/api/hotel_reservation/new', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(hotelReservation)
		});
		
		const data = await response.json();
		
		if (!response.ok)
			throw new Error(data.error || 'Ошибка сервера');
	}
}