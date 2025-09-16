var x, y;
with(Math){
    y=PI/2;
    x=sin(y/7)+pow(y,2);

    console.log(x,y);
}

student_={}
student_['name']='fhfgh';
console.log(student_)

A = {}
A[2] = '12'

console.log(A)

function Student(name, age, group){
    this.name = name;
    this.age = age;
    this.group = group;
}
/*
class Student {
    constructor(name, age, group) {
        this.name = name;
        this.age = age;
        this.group = group;
    }
}
*/


Paul = new Student("Павел", 18, 13);
console.log(Paul);

/*class IndividualPlan{
    static GREETING = 'Hello, university!';
    constructor(student, yearCount){
        this.person = student;
        this.year = yearCount;
        this.hello = IndividualPlan.GREETING;
    }
}*/
GREETING = 'Hello, university!';
var myGreeting = function(arg){
    console.log(`Hello, ${arg}`);
}
function IndividualPlan(student, yearCount){
    this.person = student;
    this.year = yearCount;
    this.hello = IndividualPlan.GREETING;
}

individualPlan = new IndividualPlan(Paul,3);
console.log(individualPlan);
individualPlan.hello=myGreeting;
individualPlan.hello('UNIVERSITY');

individualPlan.hello = function(){
    document.writeln('Вдладелец индивидуального плана: ' + this.person.name);
}
individualPlan.hello();

console.log(individualPlan.hello);


const FPS = 60
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function animation() {
    let date = new Object();
    while(true){
        date = new Date();
        document.getElementById('seconds').textContent = `${date.toString()}`;
        await sleep(1000 / FPS);
    }
}
setTimeout(event=>{animation();}, 500);

window.document.bgColor = 'yellow'