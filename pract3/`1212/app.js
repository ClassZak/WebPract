var resultWindow = null;

/**
 * 
 * @param {Число от 1 до 12} number 
 * @returns 
 */
function season(number){
    let a=String(number);
    let s
    switch (a)
    {
        case '1':
        case '2':
        case '12': 
            s="Зима"
        break

        case '3':
        case '4':
        case '5': 
            s="Весна"
        break

        case '6':
        case '7':
        case '8': 
            s="Лето"
        break

        case '9':
        case '10':
        case '11':
            s="Осень"
        break

        default: s="Ты чё ввёл?"
    }
    return s
}

/**
 * 
 * @param {Строка с данными} data 
 */
function showWindow(data){
    if(resultWindow !== null)
        resultWindow.close();

    data = String(data);

    resultWindow = window.open('', 'windowName',`width=${data.length * 23},height=100,status=no`);
    resultWindow.document.write(
        `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>345345345</title>
</head>
<body>
    <h1>${data}</h1>
</body>
</html>`
    );
}


function getMax(n1, n2, n3){
    if((n1 === null || n2 === null || n3 === null) || 
		(n1 === undefined || n2 === undefined || n3 === undefined) ||
		(typeof n1 !== 'number' || typeof n2 !== 'number' || typeof n3 !== 'number') ||
		(isNaN(n1) || isNaN(n2) || isNaN(n3)) 
    )
		throw Error('Wrong input');

	return n1 > n2 ? (n1 > n3 ? n1 : n3) : (n2 > n3 ? n2 : n3);
}