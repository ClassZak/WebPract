function handler(event){
	const element = document.form1.inputDate2;
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
			
			try {
				const newRecord = new HotelReservation(formObject);
				alert(newRecord.toString());
				HotelReservation.HotelReservations.push(newRecord);

				// Отправка email
				sendEmail(newRecord.toString(), newRecord.email);
				
				// Отправка на сервер
				const response = await fetch(this.action, {
					method: this.method,
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(newRecord)
				});
				
				const data = await response.json();
				
				if (!response.ok) {
					throw new Error(data.error || 'Ошибка сервера');
				}
				
				alert('Бронь успешно создана!');
				this.reset();
				
			} catch (error) {
				console.error('Ошибка:', error);
				alert('Произошла ошибка при создании брони: ' + error.message);
			}
		});

		// Установка минимальных дат
		const element1 = document.form1.inputDate;
		const element2 = document.form1.inputDate2;
		const date = new Date();
		const timeString = date.toISOString().split('T')[0];
		element1.min = timeString;
		element2.min = timeString;

	}, 5);
});