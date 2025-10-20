function updateTheme(morningHour = 6, eveningHour = 18, color='#555'){
	let date = new Date();
	let hours = date.getHours();

	if (hours >= eveningHour || hours <= morningHour)
		document.body.style.backgroundColor = color;
}

document.addEventListener('DOMContentLoaded', function(){
	updateTheme(6,18,'#242424');
})