class HotelReservation {
	static HotelReservations = [];

	constructor(data) {
		if (!data) throw new Error('Нет данных для создания');

		this.surname = data.surname || '';
		this.numberPeople = data.numberPeople || data.number_people || 1;
		this.rooms_count = data.rooms_count || 1;
		this.inputDate = data.inputDate || data.check_in_date || '';
		this.inputDate2 = data.inputDate2 || data.check_out_date || '';
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
С ${this.inputDate} по ${this.inputDate2} 
Количество человек: ${this.numberPeople}
Количество комнат: ${this.rooms_count}
Возрастная группа: ${this.age}
Дополнительно: ${this.additional.join(', ')}
Email: ${this.email}
Отель: ${hotelName}`;
	}
}