function getMax(n1, n2, n3){
    if((n1 === null || n2 === null || n3 === null) || 
		(n1 === undefined || n2 === undefined || n3 === undefined) ||
		(typeof n1 !== 'number' || typeof n2 !== 'number' || typeof n3 !== 'number') ||
		(isNaN(n1) || isNaN(n2) || isNaN(n3)) 
    )
		throw Error('Wrong input');

	return n1 > n2 ? (n1 > n3 ? n1 : n3) : (n2 > n3 ? n2 : n3);
}