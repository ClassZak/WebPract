// Требуется HotelReservation.js

function handler(event){
	const element=document.form1.inputDate2;
	const date = event.target.value;
	const timeString = date/*.toISOString().split('T')[0]*/;
	element.min = timeString;
}

document.addEventListener('DOMContentLoaded', function(){
	setTimeout(function(){
		document.form1.addEventListener('submit', function(event){
			event.preventDefault();
			console.log(event);

			const formData = new FormData(this);
			console.log(formData);
			
			for(element of formData.entries())
				console.log(element);
			

			const selectedAdditionals = formData.getAll('additional');
			console.log(selectedAdditionals);
			const formObject = Object.fromEntries(formData.entries());
			formObject["additional"] = new Array(selectedAdditionals);

			alert(formObject);
			HotelReservation.HotelReservations
			.push(new HotelReservation(formObject));
		});

		{
			const element1=document.form1.inputDate;
			const element2=document.form1.inputDate2;
			const date = new Date();
			const timeString = date.toISOString().split('T')[0];
			element1.min = timeString;
			element2.min = timeString;
		}

	}, 5);
});