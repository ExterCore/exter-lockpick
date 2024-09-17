let timer_start, timer_finish, timer_time, speed, timerStart;
let game_started = false;

const random = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
}

let stage = false

let colors = [];
let lastRotation = 0;
let currentCircle = 1;
let currentCirclePos = [];

const sleep = (ms, fn) => {return setTimeout(fn, ms)};

window.addEventListener("message", function (event) {
    let data = event.data;
    switch (data.type) {
        case 'open':
            target = data.target;
            finishTime = data.time;
            start(finishTime);
            // $('.minigame').css('display','block')
            document.getElementById("mini").style.display = "block"
            break;
            case 'close':
            // $('.minigame').css('display','none')
            document.getElementById("mini").style.display = "none"
            break;        
    }
});

function fillColor(color){
    let dots = stage.find('#dots-'+(45 * currentCircle))[0];
    dots.getChildren().forEach(dot => {
        dot.fill(color);
    });
    let sections = stage.find('#section-'+(45 * currentCircle))[0];
    sections.getChildren().forEach(section => {
        section.fill(color);
    });
}

function check(timeout){
    if (timeout) {
        fillColor('rgba(234,6,6,0.8)');
        stopTimer();
    }else if(currentCirclePos[45 * currentCircle] === 0){
        if(currentCircle === 5){
            finish()
            $.post('http://exter-lockpick/callback', JSON.stringify({'success': true}));
        }else{
            fillColor('#08AF93DB');
            currentCircle++;
            dots = stage.find('#dots-'+(45 * currentCircle))[0];
            lastRotation = dots.rotation();
        }
    }else{
        fillColor('rgba(234,6,6,0.8)');
        finish()
        $.post('http://exter-lockpick/callback', JSON.stringify({'success': false}));
        stopTimer();
    }
}

function reset(){

    resetTimer();
    clearTimeout(timer_start);
    clearTimeout(timer_finish);

    document.querySelector('.splash').classList.remove('hidden');
    document.querySelector('.game-canvas').classList.add('hidden');

}


document.addEventListener("keydown", function(ev) {
    let key_pressed = ev.key;
    let valid_keys = ['a','d','ArrowRight','ArrowLeft','Enter',' '];

    if(key_pressed === 'r'){
        stopTimer();
        reset();
        return;
    }
    if(game_started && valid_keys.includes(key_pressed) ){
        ev.preventDefault();
        let rotation = false;
        switch(key_pressed){
            case 'a':
            case 'ArrowLeft':
                rotation = -1;
                break;
            case 'd':
            case 'ArrowRight':
                rotation = 1;
                break;
            case 'Enter':
            case ' ':
                check();
                return;
        }
        let dots = stage.find('#dots-'+(45 * currentCircle))[0];
        let currentRotation = dots.rotation() - lastRotation;
        
        if(rotation !== false && currentRotation > -30 && currentRotation < 30){
            currentCirclePos[45 * currentCircle] += rotation;
            if(currentCirclePos[45 * currentCircle] < 0) currentCirclePos[45 * currentCircle] = 11;
            if(currentCirclePos[45 * currentCircle] > 11) currentCirclePos[45 * currentCircle] = 0;
            lastRotation += 30 * rotation;
            new Konva.Tween({node: dots, duration: 0.2, rotation: lastRotation}).play();
        }
    }
});

function rotate(rotation) {
    if(game_started){
        let dots = stage.find('#dots-'+(45 * currentCircle))[0];
        let currentRotation = dots.rotation() - lastRotation;

        if(currentRotation > -30 && currentRotation < 30){
            currentCirclePos[45 * currentCircle] += rotation;
            if(currentCirclePos[45 * currentCircle] < 0) currentCirclePos[45 * currentCircle] = 11;
            if(currentCirclePos[45 * currentCircle] > 11) currentCirclePos[45 * currentCircle] = 0;
            lastRotation += 30 * rotation;
            new Konva.Tween({node: dots, duration: 0.2, rotation: lastRotation}).play();
        }
    }
}

function rotateRight(){
    rotate(1); // Rotation to the right
}

function rotateLeft(){
    rotate(-1); // Rotation to the left
}

function tryUnlock(){
    if(game_started){
        check(); // Try to unlock
    }
}

// Bind the functions to button clicks
document.querySelector('.rotate-btn.left').addEventListener('click', rotateLeft);
document.querySelector('.rotate-btn.right').addEventListener('click', rotateRight);
document.querySelector('.unlock-btn.unlock').addEventListener('click', tryUnlock);


function addDots(radius){
    
    let dotsGroup = new Konva.Group({id: 'dots-'+radius, x: 270, y: 270});

    let cols = ['#dd2169', '#258fe6', '#ffc30a'];
    colors[radius] = [];

    for(let i = 0; i < 12; i++) {
        let randomColor = cols[Math.floor(Math.random() * cols.length)];
        colors[radius][i] = [randomColor, Math.random() > 0.2];
        
        if( colors[radius][i][1] ) {
            dotsGroup.add(new Konva.Circle({
                x: Math.floor(radius * Math.cos(2 * Math.PI * i / 12)),
                y: Math.floor(radius * Math.sin(2 * Math.PI * i / 12)),
                radius: 8,
                fill: randomColor,
            }));
        }
    }
    
    return dotsGroup;
}

function addSections(radius){
    let sectionsGroup = new Konva.Group({id: 'section-'+radius, x: 270, y: 270});

    for(let i = 0; i < 12; i++) {
        if(colors[radius][i][1] && Math.random() > 0.3) {
            sectionsGroup.add(new Konva.Arc({
                fill: colors[radius][i][0],
                innerRadius: radius + 15,
                outerRadius: radius + 20,
                angle: 30,
                rotation:  ((30 * (i+1)) - 45)
            }));
        }
    }
    
    return sectionsGroup;
}

function shuffleDots(){
    for(let i=1; i<=5; i++){
        let randomPos = random(1,11);
        currentCirclePos[45*i] = randomPos;
        let dots = stage.find('#dots-'+(45 * i))[0];
        if(dots) {
            dots.rotation(30 * randomPos);
            if(i === 1) lastRotation = 30 * randomPos;
        } else {
            // Handle the case where 'dots' is undefined
            console.error('The dots object for circle ' + i + ' is undefined.');
        }
    }  
}


function start(set_time){

    document.body.style.display = "block";
    // Define the scale factor (0.75 for 75% size)
    const scaleFactor = 1;
    // Calculate the new size of the canvas
    const newSize = 540 * scaleFactor;
    if(stage !== false){
        stage.destroy();
    }
    stage = new Konva.Stage({
        container: 'game-canvas',
        width: newSize,
        height: newSize,
    });
    colors = [];
    lastRotation = 0;
    currentCircle = 1;
    currentCirclePos = [];
   
    let staticLayer = new Konva.Layer();
    for(let i=1; i<=5; i++){
        staticLayer.add( new Konva.Circle({x: newSize/2, y: newSize/2, radius: (45*i)*scaleFactor, stroke: 'white', strokeWidth: 2*scaleFactor}) );
    }
    for(let i=0; i<=5; i++){
        staticLayer.add( new Konva.Line({x:newSize/2,y:newSize/2,points: [(-240 *scaleFactor), 0, (240*scaleFactor), 0], stroke: '#ffffffa0', strokeWidth: 1*scaleFactor, rotation: 30*i}) );
    }
    staticLayer.add( new Konva.Line({points: [0, newSize, newSize, newSize], stroke: '#26303e', strokeWidth: 15*scaleFactor}) );
    staticLayer.add( new Konva.Line({id: 'progress',points: [0, newSize, newSize, newSize], stroke: '#ff4e00', strokeWidth: 15*scaleFactor}) );
    stage.add(staticLayer);

    let gameLayer = new Konva.Layer({id:'game'});
    for(let i=1; i<=5; i++){
        gameLayer.add(addDots(45*i*scaleFactor));
        gameLayer.add(addSections(45*i*scaleFactor));
    }
    stage.add(gameLayer);

    shuffleDots();

    timer_start = sleep(500, function(){
        document.querySelector('.splash').classList.add('hidden');
        document.querySelector('.game-canvas').classList.remove('hidden');
        
        game_started = true;

        startTimer();
        speed = set_time;

        let progress = stage.find('#progress')[0];
        new Konva.Tween({node: progress, duration: speed, points: [0, 540, 0, 540]}).play();
        
        timer_finish = sleep((speed * 1000), function(){
            finish()
            $.post('http://exter-lockpick/callback', JSON.stringify({'success': false}));
            check(true);
        });
    });
}



function startTimer(){
    timerStart = new Date();
    timer_time = setInterval(timer,1);
}
function timer(){
    let timerNow = new Date();
    let timerDiff = new Date();
    timerDiff.setTime(timerNow - timerStart);
    let ms = timerDiff.getMilliseconds();
    let sec = timerDiff.getSeconds();
    if (ms < 10) {ms = "00"+ms;}else if (ms < 100) {ms = "0"+ms;}
}
function stopTimer(){
    clearInterval(timer_time);
    game_started = false;
}
function resetTimer(){
    clearInterval(timer_time);

}

function finish(){
    document.body.style.display = "none";
    reset();
}