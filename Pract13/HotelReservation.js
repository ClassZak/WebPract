class HotelReservation{
	static HotelReservations = [];

	constructor(data){
		if(!data)
			throw new Error('Нет данных для создания');

		this.surname		= data.surname	|| '';
		this.numberPeople	= data.numberPeople || '';
		this.rooms_count	= data.rooms_count		|| '';
		this.inputDate		= data.inputDate	|| '';
        this.inputDate2		= data.inputDate2	|| '';
        this.additional		= data.additional	|| '';
        this.age		    = data.age	|| '';
	}
}