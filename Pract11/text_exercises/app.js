function getWords(text){
    let words = [];

    let word_index_start = 0;
    let word_index_end = 0;

    let word_detected = false;
    for(let i=0;i!=text.length;++i){

        if(!word_detected){
            
            if(!containsWhitespace(text.charAt(i))){
                word_index_start = i;
                word_detected = true;
            }
        }
        else{
            if(containsWhitespace(text.charAt(i))){
                word_index_end = i;
                word_detected = false;

                words.push(text.slice(word_index_start, word_index_end));
            }
        }
    }

    if(word_detected)
        words.push(text.slice(word_index_start, text.length));

    return words;
}
function containsWhitespace(text){
    return /\s/.test(text);
}

function getLargestWord(words){
    let largest_size = 0;
    words.forEach(element => {
        if(element.length > largest_size)
            largest_size = element.length;
    });

    for(let element of words)
        if(largest_size == element.length)
            return element;
}
function getSmallerWord(words){
    let smaller_size = 100000;
    words.forEach(element => {
        if(element.length < smaller_size)
            smaller_size = element.length;
    });

    for(let element of words)
        if(smaller_size == element.length)
            return element;
}
function getWordsCountWithAlphabetCombination(words, alphabets){
    let count = 0;
    words.forEach(element => {
        if(element.includes(alphabets))
            ++count;
    });

    return count;
}

function takeReport(text, alphabets){
    words = getWords(text);

    return `
        Длина предложения: ${text.length}
        Количество слов в предложении: ${words.length}
        Самое длинное слово: ${getLargestWord(words)}
        Самое короткое слово: ${getSmallerWord(words)}
        Количество указанных пользователем букв: ${alphabets.length}
        Количество слов, в которых встречается указанное сочетание букв: ${getWordsCountWithAlphabetCombination(words, alphabets)}
    `
}


function replaceForText(text,filter_word,new_word){
    return text.replaceAll(filter_word, new_word);
}


function trimSpaces(text){
    let new_text = text;

    while(new_text.includes('  '))
    new_text = new_text.replaceAll('  ', ' ');

    return new_text.trim();
}


