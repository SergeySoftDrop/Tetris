import figures from "./js_modules/figures.js";
import getRandomInt from "./js_modules/rand.js";

const cellSize = 25;
const fieldSize = {
    x: 10,
    y: 20
};

let ctx;
let cvs;

let currentFigure = {
    position: [],
    moves: 0,
};
let fieldState = [];

let intervalId;

function loadGame() {
    cvs = createField();
    ctx = cvs.getContext('2d');
    initArr();
    startGame();
}

function startGame(){
    createFigure(getRandFigure());
    drawState();

    intervalId = setInterval(() => {
        drawState();
        if(!moveDown('up', 'y')){
            createFigure(getRandFigure());
        }
    }, 700);
}

function moveDown(){
    const position = currentFigure.position.map(pos => ({x: pos.x, y: pos.y + 1})); 
    
    if(collision(position) || bottomBorderCollision(position)){
        console.log('block||bottom border collision');
        return false;
    }

    changeFigurePosition('up', 'y');
}

function moveLeft(){
    const position = currentFigure.position.map(pos => ({x: pos.x - 1, y: pos.y})); 
    
    if(collision(position) || bottomBorderCollision(position)){
        console.log('block||bottom border collision');
        return false;
    }

    changeFigurePosition('up', 'y');
}

function moveRight() {
    const position = currentFigure.position.map(pos => ({x: pos.x - 1, y: pos.y})); 
    
    if(collision(position) || bottomBorderCollision(position)){
        console.log('block||bottom border collision');
        return false;
    }

    changeFigurePosition('up', 'x');
}

function changeFigurePosition(key, vectorName){
    let param;
    switch (key) {
        case 'down':
            param = -1;
        break;
        case 'up':
            param = 1;
        break;
    }

    currentFigure.position.forEach((pos) => {
        fieldState[pos.x][pos.y] = 0;
    });
    currentFigure.position.forEach((pos) => {
        pos[vectorName] += param;
    });
    currentFigure.position.forEach((pos) => {
        fieldState[pos.x][pos.y] = 1;
    });    
    currentFigure.moves++;
}

function move(key, vectorName){
    const position = currentFigure.position.map(pos => ({x: pos.x, y: pos.y + 1})); 

    const isBlockCollision = collision(position);
    const isBorderCollision = bottomBorderCollision(position);

    if(isBlockCollision || isBorderCollision){
        console.log('block||bottom border collision');
        return false;
    }

    return true;
}

function bottomBorderCollision(figureCellsPos){
    let maxY = figureCellsPos[0].y;

    figureCellsPos.forEach(pos => {
        if(pos.y > maxY){
            maxY = pos.y;
        }
    });

    if(maxY >= fieldSize.y){
        return true;
    }

    return false;
}

function collision(figureCellsPos){
    let maxY = figureCellsPos[0].y;
    let minMaxX = {min: figureCellsPos[0].x, max: figureCellsPos[0].x};

    figureCellsPos.forEach((pos) => {
        if (pos.y > maxY) {
            maxY = pos.y;
        }

        if(pos.x > minMaxX.max){
            minMaxX.max = pos.x;
        }else if(pos.x < minMaxX.min){
            minMaxX.min =  pos.x
        }
    });


    
    let collision = false;
    figureCellsPos.forEach((pos) => {
        if (pos.y == maxY){
            if (fieldState[pos.x][pos.y] == 1){
                collision = true;
            }
        }
        
        if(pos.x == minMaxX.max || pos.x == minMaxX.min){
            if (fieldState[pos.x][pos.y] == 1){
                collision = true;
            }    
        }
    });


    return collision;
}

function drawState(){
    // console.group('fieldState');
    // console.log(fieldState);
    // console.groupEnd();

    clear();
    fieldState.forEach((x, xKey) => {
        x.forEach((y, yKey) => {
            if(y == 1){
                createSquaere(xKey * cellSize, yKey * cellSize);
            }
        });
    });
}

function initArr(){
    for (let x = 0; x < fieldSize.x; x++) {
        fieldState[x] = [];
        for (let y = 0; y < fieldSize.y; y++) {
            fieldState[x][y] = 0;
        }
    }
}

function createField(){
    const cvs = document.createElement('canvas');
    document.body.append(cvs);
    cvs.width = cellSize * fieldSize.x;
    cvs.height = cellSize * fieldSize.y;
    cvs.style.border = "2px solid black"
    return cvs;
}

function createFigure(figure){
    currentFigure.position = [];
    currentFigure.moves = 0;

    figure.forEach((arr, arrKey) => {
        arr.forEach((el, key) => {
            if(el == 1){
                const x = (3 + key);//3??
                const y = arrKey;
                currentFigure.position.push({x: x, y: y});

                fieldState[x][y] = 1;
            }
        })
    });
}

function createSquaere(x, y){
    // console.log("createSquare", x, y);
    ctx.fillRect(x, y, cellSize, cellSize);
}

function moveFullDown(){
    while(true){
        if(!moveDown()){
            break;
        }
    }
}

function clear(){
    cvs.width = cvs.width;
}

function minMaxCoord(arr){

}

function getRandFigure(){
    return figures[getRandomInt(figures.length)];
}

function checkLoseCase(posX, posY){

}

document.addEventListener("keydown", (ev) => {
    switch(ev.key){
        case 'ArrowDown':
        case 's':
            moveFullDown();
            break;
        case 'ArrowRight':
        case 'd':
            moveRight();
            break;
        case 'ArrowLeft':
        case 'a':
            moveLeft();
            break;
    }
});

loadGame();