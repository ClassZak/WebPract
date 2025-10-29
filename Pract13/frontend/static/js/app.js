function handler(event){
	const element = document.form1.endDate;
	const date = event.target.value;
	element.min = date;
}

document.addEventListener('DOMContentLoaded', function(){
	setTimeout(function(){
		document.form1.addEventListener('submit', async function(event){
			event.preventDefault();
			
			const formData = new FormData(this);
			const selectedAdditionals = formData.getAll('additional');
			const formObject = Object.fromEntries(formData.entries());
			formObject["additional"] = selectedAdditionals;

			const newRecord = new HotelReservation(formObject);
			HotelReservation.createHotelReservation(newRecord);
			this.reset();
		});

		// Установка минимальных дат
		const element1 = document.form1.startDate;
		const element2 = document.form1.endDate;
		const date = new Date();
		const timeString = date.toISOString().split('T')[0];
		element1.min = timeString;
		element2.min = timeString;

	}, 5);
});