let date = new Date();
var day = date.getDate();
var month = date.getMonth();
var year = date.getFullYear();

var MONTH_NAME = ['января', 'февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
var WEEK_DAY = ['понедельник', 'вторник','среда','четверг','пятница','суббота','воскресенье']


document.writeln(`
	<p>
	Сегодня ${day} ${MONTH_NAME[month]} ${year}
	</p>
`);

todayDay = date.getDate();
var d = 1;
document.writeln(`<table border = 1>`);
for(let r = 0; r <= 4; ++r){
	document.writeln('<tr>')
	for(let c=0;c<7;++c){
		if(!(r==0 && c<3) && d <= 31){
			if(todayDay == d)
				document.writeln('<td bgcolor=pink>', d, '</td>');
			else
				document.writeln('<td>', d, '</td>');
			++d;
		}
		else
			document.writeln('<td></td>');
	}
	document.writeln('</tr>')
	51
}
document.writeln('</table>');






/* ---------------------------------------------------------- */

todayDay = date.getDate();
d = 1;
document.writeln(`<table border = 1>`);
let dayPos = date.getDate() % 7;
for(let i = 0; i!=5;++i){
	document.writeln('<tr>')
	for(let j = 0; j!=7;++j){
		if(d <= dayPos){
			document.writeln('<td></td>');
			--dayPos;
			continue;
		}
		if (d>31){
			document.writeln('<td></td>');
			continue;
		}
		if(d == todayDay)
			document.writeln('<td bgcolor=pink>', d++, '</td>');
		else
			document.writeln('<td>', d++, '</td>');
	}
	document.writeln('</tr>')
}
document.writeln('</table>');

/* ---------------------------------------------------------- */

function dateFormat1(){
	date = new Date();
	return `${date.getDate()}:${date.getMonth()}${MONTH_NAME[date.getMonth()]}:${date.getFullYear()}:${date.getDay()}:${WEEK_DAY[date.getDay()-1]}`;
}

document.writeln(`
	<p>
		${dateFormat1()}
	</p>
`);

function getAge(date){
	let startDate = new Date(date);
	let dateNow = new Date();
	let dateOfAge = new Date(
		dateNow.getFullYear()        - startDate.getFullYear(),
		dateNow.getMonth()           - startDate.getMonth(),
		dateNow.getDate()            - startDate.getDate(),
		dateNow.getHours()           - startDate.getHours(),
		dateNow.getMinutes()         - startDate.getMinutes(),
		dateNow.getSeconds()         - startDate.getSeconds(),
		dateNow.getMilliseconds()    - startDate.getMilliseconds(),
	);
	return dateOfAge.getFullYear() - 1900;
}


function getDaysBetweenDates(date1, date2){
	let differenceDate = new Date(
		Math.abs(date1.getFullYear()	- date2.getFullYear()),
		Math.abs(date1.getMonth()		- date2.getMonth()),
		Math.abs(date1.getDate()		- date2.getDate()),
		Math.abs(date1.getHours()		- date2.getHours()),
		Math.abs(date1.getMinutes()		- date2.getMinutes()),
		Math.abs(date1.getSeconds()		- date2.getSeconds()),
		Math.abs(date1.getMilliseconds()- date2.getMilliseconds()),
	)

	return Math.abs(date1.valueOf() - date2.valueOf()) / 1000 / 60 / 60 / 24;
}
