const FPS = 5;
const FRAME_RATE = 1000 / FPS;

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
	let dynamic = document.getElementById('equal');
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

function colorChange(color){
	if (event.srcElement.type == "button")
		event.srcElement.style.backgroundColor=color;
}

async function flash(){
	if (tab.style.borderColor == 'yellow')
		tab.style.borderColor ='red';
	else
		tab.style.borderColor = 'yellow';
}




document.addEventListener('DOMContentLoaded', function() {
	setInterval(function(){
		flash();
	}, 50)
});

a_link = new Array()
a_link[0] = 'yellow'
a_link[1] = '#80ff80'
a_link[2] = '#ffff80'
a_link[3] = '#408000'
a_vlink = new Array()
a_vlink[0] = 'blue'
a_vlink[1] = 'purple'
a_vlink[2] = 'black'
a_vlink[3] = 'red'
function colorCh(){
	alink= Math.round((a_link.length+0.1)*Math.random())
	vlink= Math.round((a_vlink.length+0.1)*Math.random())
	document.linksColor=a_link[alink]
	document.linksColor=a_vlink[vlink]
}

document.addEventListener('DOMContentLoaded', function() {
	setInterval(function(){
		changeColorOfLi();
	}, 500)
});

function changeColorOfLi(){
	let li1 = document.getElementById('li1')
	let li2 = document.getElementById('li2')
	let li3 = document.getElementById('li3')

	li1.style.color = a_link[Math.round((a_link.length+0.1)*Math.random())];
	li2.style.color = a_link[Math.round((a_link.length+0.1)*Math.random())];
	li3.style.color = a_link[Math.round((a_link.length+0.1)*Math.random())];

	li1.style.background = a_vlink[Math.round((a_link.length+0.1)*Math.random())];
	li2.style.background = a_vlink[Math.round((a_link.length+0.1)*Math.random())];
	li3.style.background = a_vlink[Math.round((a_link.length+0.1)*Math.random())];
}



var dx=undefined;
var dy=undefined;
function init_move(){
	dx=8;
	dy=3;
	setInterval(function(){move();},200);
}
function move(){
	let y=parseInt(document.all.pic.style.top);
	let x=parseInt(document.all.pic.style.left);

	document.all.pic.style.top	= `${y+dy}px`;
	document.all.pic.style.left	= `${x+dx}px`;
}



var x = 0;

function moveCurve(xid, yexpr, xexpr){
	x += 1;
	yexpr = 100 + 50 * Math.sin(0.03 * x)
	xexpr = 50+x

	document.all[xid].style.top		= `${eval(yexpr)}px`;
	document.all[xid].style.left	= `${eval(xexpr)}px`;
}

function curveMove(xid, yexpr, xexpr, ztime){
	if(!xid)
		return null;
	if(!yexpr)
		yexpr = "x";
	if(!xexpr)
		xexpr = "x";
	if(!ztime)
		ztime = 100;

	x = 0;
	setInterval(function(){moveCurve(xid, yexpr, xexpr);},ztime)
}


var action, coef_px = -1, coef_pt=1, p_move = 5;

function startMove(/*id*/){
	/*element = document.getElementById(id);
	element.style.left = `${parseInt(document.body.offsetWidth)/3+200}px`
	element.style.top = 0;*/
	dynamic.style.left = `${parseInt(document.body.offsetWidth)/3+200}px`
	dynamic.style.top = 0;

	action = window.setInterval(function(){move3();}, 100);

	
}

function move3(){
	px = parseInt(dynamic.style.left);
	px = px + coef_px * p_move;
	dynamic.style.left = `${px}px`;
	if(	px <= parseInt(document.body.offsetWidth)/3 - 200 ||
		px >= parseInt(document.body.offsetWidth)/3 + 200
	)
		coef_px *= -1;

	pt = parseInt(dynamic.style.top);
	pt = pt + coef_pt * p_move;
	dynamic.style.top = `${pt}px`;
	if(	pt <= 0 || pt >= 200){
		coef_pt *= -1;
	}
}