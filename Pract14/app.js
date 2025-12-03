//import Month from "./Month";
//import Season from "./Season";

const SEASONS = [
	new Season('Зима', 1),
	new Season('Весна', 2),
	new Season('Лето', 3),
	new Season('Осень', 4),
]

const MONTHS = [
	new Month('Январь',			'img/1.jpg',	1	, 1),
	new Month('Февраль',		'img/2.jpg',	2	, 1),
	new Month('Март',			'img/3.jpg',	3	, 2),
	new Month('Апрель',			'img/4.jpg',	4	, 2),
	new Month('Май',			'img/5.jpg',	5	, 2),    
	new Month('Июнь',			'img/6.jpg',	6	, 3),
	new Month('Июль',			'img/7.jpg',	7	, 3),
	new Month('Август',			'img/8.jpg',	8	, 3),
	new Month('Сентябрь',		'img/9.jpg',	9	, 4),
	new Month('Октябрь',		'img/10.jpg',	10	, 4),
	new Month('Ноябрь',			'img/11.jpg',	11	, 4),
	new Month('Декабрь',		'img/12.jpeg',	12	, 1),    
];

function renderCard(month){
	const el = document.getElementsByName('images')[0];
	let newMonth = document.createElement('div');

	newMonth.innerHTML=`
	<div>
		<h1>${month.name}</h1>
		<img src="${month.imageSource}">
	</div>
	`;
	el.appendChild(newMonth);
}


document.addEventListener('DOMContentLoaded', function(){
	setTimeout(function(){
		MONTHS.forEach(element => {
			renderCard(element);
		});
	},5);
});


function clearImages(){
	const el = document.getElementsByName('images')[0];
	el.innerHTML = '';
}

function renderByTextQuery(query){
	let selected = [];
	const queryLower = query.toLowerCase();
	MONTHS.forEach(element => {
		if (element.name.toLowerCase().includes(queryLower) ||
			element.seasonNumber.toString().includes(queryLower) ||
			element.number.toString().includes(queryLower)
		)
			selected.push(element);
	});

	selected.forEach(element => {
		renderCard(element);
	});
}