function getWordsCount(text){
    let words_count = 0;

    let word_index_start = 0;
    let word_index_end = 0;

    let word_detected = false;
    for(let i=0;i!=text.length;++i){

        if(!word_detected){
            
            if(!containsWhitespace(text.charAt(i))){
                word_index_start = i;
                word_detected = true;

                ++words_count;
            }
        }
        else{
            if(containsWhitespace(text.charAt(i))){
                word_index_end = i-1;
                word_detected = false;
            }
        }
    }

    return words_count;
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


function containsWhitespace(text){
    return /\s/.test(text);
}