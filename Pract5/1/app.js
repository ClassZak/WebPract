

function sum(){
	let sum = 0;
	let a1 = document.querySelector('[name="a1"]').value;
	let a2 = document.querySelector('[name="a2"]').value;
	for(let i=a1;i<=a2;)
		sum += i++;

	document.querySelector('[name="result"]').value = sum;
}

addEventListener('DOMContentLoaded', function(e){
	this.setTimeout(function(){

	}, 5);
})