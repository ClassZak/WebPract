function generateMathTable(){
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
})