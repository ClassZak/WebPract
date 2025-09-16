var students = []


function scanStudent(){
	let name = prompt('введите имя');
	let surname = prompt('Введите фамилию');

	if(name === null || surname === null){}
		
	return {'name' : name, 'surname' : surname};
}

/**
 * 
 * @param {Число студентов} count 
 */
function scanStudents(count){
	for(let i=0; i!=BigInt(count); ++i){
		students.push(scanStudent());
	}
}

function showStudents(){
	var newWindow = open('','sdgdgdfjkg',"width=100,height=100,status=no");

	let string_students=''
	students.forEach(el=>{string_students += `Имя: ${el.name}\nФамилия:${el.surname}\n`})
	newWindow.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>

    <script src="app.js" defer></script>
	<link rel="stylesheet" href="style.css">
</head>
<body>
<p>${string_students.replaceAll('\n','<br>')}</p>
</body>
</html>`)
}

addEventListener('DOMContentLoaded', function(e){
	this.setTimeout(function(){
		scanStudents(parseInt(prompt('Введите число студентов')));
		if(students.length != 0)
			showStudents();
	},50);
})