function findMin(n1,n2,n3,n4,n5) {
	if(typeof n1 !== "number" || typeof n2 !== "number" || typeof n3 !== "number" || typeof n4 !== "number" || typeof n5 !== "number"){
		throw Error("Передано не число");
	}

	let newArray= [n1,n2,n3,n4,n5];
	sortArray(newArray);

	return newArray[0];
}

const TEST_ARRAY = [
	5, 4, 3, 2, 1
];

const TEST_ARRAY2 = [
	5, 12, 12, 2, 1
];

var test_array1 = TEST_ARRAY;
var test_array2 = TEST_ARRAY2;

function sortArray(array){
	let temp = 0;
	for(i = 0; i!=array.length;++i){
		for(j = 0; j!=array.length-1;++j){
			if(array[j] > array[j+1]){
				temp = array[j];
				array[j] = array[j+1];
				array[j+1] = temp;
			}
		}
	}
}

function findMinFromArray(array) {
	if(array.length==0)
		return null;

	let newArray = array;
	
	return sortArray(newArray)[0];
}




/*-------------------------------------------------------------------------------------------------------------------------------*/


const COMMANDMENTS = [
	'Я - Господь Бог твой; и не должны быть у тебя другие боги кроме меня.',
	'Не делай себе идола, и всякого подобия, не поклоняйся им и не служи им.',
	'Не произноси имени Господа Бога твоего напрасно.',
	'Шесть дней работай, а день седьмой - день покоя посвящай Господу Богу твоему.',
	'Почитай отца своего и матерь свою, чтобы тебе хорошо было, и чтобы ты долго прожил на земле.',
	'Не убивай.',
	'Не прелюбодействуй.',
	'Не воруй.',
	'Не произнеси на другого ложного свидетельства.',
	'Не желай себе того, что есть у ближнего твоего.',
]

/**
 * @param {Номер заповеди 1-10} number 
 */
function showCommandments(number){
	if(number === undefined || number === null)
		throw Error("Пустое значение");
	if(typeof number !== "number"){
		console.log(typeof(number));
		throw Error("Передано не число");
	}

	if(!Number.isInteger(number))
		throw Error("Введено не целое значение");
	if(number < 1 || number >10)
		throw Error("Введён неверный номер заповеди");

	alert(COMMANDMENTS[number-1]);
}

function showRequestedCommandment(){
	number = prompt('Введите число от 1 до 10');
	showCommandments(parseFloat(number));
}

/*-------------------------------------------------------------------------------------------------------------------------------*/

function squareOfTenNumbers(){
	let result = 0;
	for(i=1;i!=11;++i){
		result += Math.pow(i,2);
	}
	return result;
}
