var students = []

function scanStudent(){
	let name = prompt('введите имя');
	if(name === null)
		return null;
	let surname = prompt('Введите фамилию');
	if(surname === null)
		return null;

		
	return {'name' : name, 'surname' : surname};
}


function enterStudent(){

}

function scanStudents(){
	while(1===1){
		obj = scanStudent();
		if(obj === null)
			break;
		else
			students.push(obj);
	}
}

function showStudents(){
	if(newWindow!==undefined && newWindow!== null)
		newWindow.close();
	var newWindow = open('','sdgdgdfjkg',"width=100,height=100,status=no");

	let string_students=''
	students.forEach(el=>{string_students += `Имя: ${el.name}\nФамилия:${el.surname}\n`});

	newWindow.document.write(`<!DOCTYPE html>
<html lang="en">
<head>1
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
		scanStudents();
		if(students.length != 0)
			showStudents();
	},50);
})