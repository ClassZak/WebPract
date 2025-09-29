// Требуется
// User.js

function updateTheme(){
	let date = new Date();
	let hours = date.getHours();

	if (hours >= 21 || hours <= 6)
		document.body.style.backgroundColor = '#555';
}


addEventListener('DOMContentLoaded', async function(e){
	this.setTimeout(function(){
		updateTheme();
		const registerForm = document.getElementsByName('form_register')[0];
		

		
		registerForm.addEventListener('submit', async function(e) {
			e.preventDefault();
			console.log(e);

			const formData = new FormData(this);
			console.log(formData);

			User.Users.push(new User(Object.fromEntries(formData.entries())));
		});
	}, 5);
});

