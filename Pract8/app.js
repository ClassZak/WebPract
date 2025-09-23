/*function generateMathTable(){
	let result = '';

	for ( let i = 1 ; i != 10; ++i){
		for ( let j = 1 ; j != 10; ++j)
			result+=`${i} x ${j} = ${i * j} \n`;
		result+='\n';
	}

	return result;
}

addEventListener('DOMContentLoaded', function(e){
	this.setTimeout(function(){
		let table = generateMathTable();
		document.getElementById('table').innerHTML = table.replaceAll('\n', '<br>');
	},50);
})*/

function areaOfTriangle(obj){
	let a=1*obj.st1.value;
	let b=1*obj.st2.value;
	let c=1*obj.st3.value;

	
	if(!checkExistenceOfTriangle(a,b,c)){
		console.error("Ошибка. Не существует треугольник");
		return;
	}

	let p=(a+b+c)/2;
	let s=Math.sqrt(p*(p-a)*(p-b)*(p-c));
	obj.result.value=s.toFixed(2);
}

function minMaxRandom(obj){
	let min=1*obj.i1.value;
	let max=1*obj.i2.value;
	obj.result.value= Math.random() * (max - min) + min;
}

// ax^2 + bx + c = 0
// D = b^2 - ac
//			-b +- sqrt(D) 
// x =   ----------------
//			2a
function resolveSquareEqual(a,b,c){
	let D = Math.pow(b,2) - a*c;
	if(D < 0)
		throw Error('Нет решений в множестве вещественных чисел');

	if(D==0){
		let x = (-b + Math.sqrt(D)) / 2*a;
		
		return x.toString();
	}
	else{
		let x1 = (-b + Math.sqrt(D)) / 2*a;
		let x2 = (-b - Math.sqrt(D)) / 2*a;

		return `${x1} ${x2}`;
	}
}

function resolveSquareEqual_FromForm(obj){
	try {
		obj.result.value = resolveSquareEqual(
			parseFloat(obj.i1.value),
			parseFloat(obj.i2.value),
			parseFloat(obj.i3.value)
		)
	} catch (error) {
		console.log(error);
		alert(error);
		obj.result.value = error;
	}
}

function renderEqual(obj){
	let element = document.getElementById('equal');
	if(element !== undefined && element !== null){
		element.textContent = 
		`${parseFloat(obj.i1.value)}x^2 + 
		${parseFloat(obj.i2.value)}x +
		${parseFloat(obj.i3.value)}
		`
	}
}

function checkExistenceOfTriangle(a,b,c){
	return (a + b > c && a + c > b && b + c > a);
}