import {getRandFigure, getRandColor} from "./js_modules/rand.js";
import config from "./js_modules/config.js";
import Canvas from "./js_modules/Canavs.js";
import GameInterface from "./js_modules/GameInterface.js";

const savedBackUp = localStorage.getItem('set');

if(savedBackUp){
    setSetings(JSON.parse(savedBackUp));
}

const cvs = new Canvas();
const Interface = GameInterface.initFromDefault();
const currentFigure = {
    position: [],
    shape: [],
    currentPivot: null,
    figureParams: null,
    moves: 0
}

let fieldState = [];
let gameState = getGameState();

function initGame(){
    initFieldArr();
    setListeners();
    createFigure(getRandFigure());
    cvs.setRandColor();
    cvs.updateState(fieldState);
}

function initFieldArr(){
    for (let x = 0; x < config.fieldSize.x; x++) {
        fieldState[x] = [];
        for (let y = 0; y < config.fieldSize.y; y++) {
            fieldState[x][y] = 0;
        }
    }
}

function startGame() {
    if(gameState.pause){
        return;
    }

    if(!moveDown()){
        if(currentFigure.moves < 2){
            lose();
            reload();
            return;
        }

        checkLine();
        createFigure(getRandFigure());
        gameState.inputMove = [];
    }

    if(gameState.inputMove.length > 0){
        for(let i = 0; i < gameState.inputMove.length; i++) {
            if(i > config.inputMovesOfTick){
                break;
            }

            makeInputMove(gameState.inputMove[i]);
        }

        gameState.inputMove = [];
    }

    updateInterface();
    cvs.updateState(fieldState);

    setTimeout(() => {
        startGame();
    }, gameState.currentSpeed);
}

function makeInputMove(btnCase){
    switch (btnCase) {
        case 'ArrowLeft':
        case 'a':
        case 'ф':
            moveLeft();
            break;
        case 'ArrowRight':
        case 'd':
        case 'в':
            moveRight();
            break;
        case 'ArrowDown':
        case 's':
        case 'ы':
            while(true){
                if(!moveDown()){
                    checkLine();
                    createFigure(getRandFigure());
                    break;
                }
            }
            break;
        case 'ArrowUp':
        case 'w':
        case'ц':
            rotateFigure();
            break;
    }
}

function moveDown(){
    const nextFigurePosition = currentFigure.position.map(pos => {
        fieldState[pos.x][pos.y] = 0;
        return ({x: pos.x, y: pos.y + 1})
    });

    if(bottomCollision(nextFigurePosition)){
        returnFigureInField();
        return false;
    }

    changeFigurePosition('up', 'y');
    return true;
}

function moveLeft(){
    const nextFigurePosition = currentFigure.position.map(pos => {
        fieldState[pos.x][pos.y] = 0;
        return {x: pos.x - 1, y: pos.y};
    });

    if(leftRightCollision(nextFigurePosition)){
        returnFigureInField();
        return;
    }

    changeFigurePosition('down', 'x');
    return true;
}

function moveRight(){
    const nextFigurePosition = currentFigure.position.map(pos => {
        fieldState[pos.x][pos.y] = 0;
        return {x: pos.x + 1, y: pos.y};
    });

    if(leftRightCollision(nextFigurePosition)){
        returnFigureInField();
        return false;
    }

    changeFigurePosition('up', 'x');
    return true;
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

    if(currentFigure.figureParams.rotate){
        currentFigure.currentPivot[vectorName] += param;
    }
    currentFigure.position.forEach((pos) => {
        pos[vectorName] += param;
    });
    currentFigure.position.forEach((pos) => {
        fieldState[pos.x][pos.y] = 1;
    });    
    currentFigure.moves++;
}

function leftRightCollision(figureCellsPos){
    let minMaxX = {min: figureCellsPos[0].x,  max: figureCellsPos[0].x};

    figureCellsPos.forEach((pos) => {
        if(pos.x > minMaxX.max){
            minMaxX.max = pos.x;
        }else if(pos.x < minMaxX.min){
            minMaxX.min = pos.x;
        }
    });

    let collision = false;

    figureCellsPos.forEach((pos) => {
        if(pos.x == minMaxX.max || pos.x == minMaxX.min){
            if(pos.x >= config.fieldSize.x || pos.x < 0){
                collision = true;
            }else if(fieldState[pos.x][pos.y] == 1){
                collision = true;
            }
        }
    });

    return collision;
}

function bottomCollision(figureCellsPos){
    let collision = false;
    figureCellsPos.forEach((pos) => {
        if(pos.y >=  config.fieldSize.y){
            collision = true;
        }else if(fieldState[pos.x][pos.y] == 1){
            collision = true;
        }
    });

    return collision;
}

function returnFigureInField(){
    currentFigure.position.forEach((pos) => {
        fieldState[pos.x][pos.y] = 1;
    });
}

function createFigure(figure){
    currentFigure.position = [];
    currentFigure.moves = 0;
    currentFigure.currentPivot = {};
    currentFigure.figureParams = figure.figureParams;
    currentFigure.shape = figure.shape;

    figure.shape.forEach((arr, arrKey) => {
        arr.forEach((el, key) => {
            
            if(el == 1){
                const x = Math.floor(config.fieldSize.x / 4) + 1 + key;
                const y = arrKey;
                if(figure.figureParams.rotate){
                    if(figure.figureParams.rotate.x == arrKey && figure.figureParams.rotate.y == key){
                        currentFigure.currentPivot.x = x;
                        currentFigure.currentPivot.y = y;
                    }
                }
                currentFigure.position.push({x: x, y: y});
                fieldState[x][y] = 1;
            }
        })
    });
}

function setListeners(){
    document.addEventListener('keydown', (event) => {
        if(gameState.inputMove.length <= config.inputMovesOfTick){
            gameState.inputMove.push(event.key);
        }
    });

    Interface.setBtn.addEventListener('click', () => {
        gamePause(true);

        Interface.openPopUp(savedPopUpData, () => {
            gamePause(false)
            startGame();
        }, {
            width: config.fieldSize.x,
            height: config.fieldSize.y,
            speed: config.speed,
            speedMin: config.minSpeed,
            speedUpBy: config.speedUpBy,
            speedUpLevels: config.speedUpEvery,
        });
    });

    Interface.reloadBtn.addEventListener('click', () => {
        gamePause(true);
        setTimeout(reload, config.speed);
    });
}

function checkLine(){
    const fullLinesKeys = [];

    for (let rowIndex = 0; rowIndex < config.fieldSize.y; rowIndex++) {
        let isRowFull = true;
        for (let columnIndex = 0; columnIndex < config.fieldSize.x; columnIndex++) {
            if (fieldState[columnIndex][rowIndex] !== 1) {
                isRowFull = false;
                break;
            }
        }
        if (isRowFull) {
            fullLinesKeys.push(rowIndex);
        }
    }

    if(fullLinesKeys.length > 0){
        removeFullLines(fullLinesKeys);

        updateStatistics(fullLinesKeys.length);
    }
}

function removeFullLines(keys){
    const newMatrix = rotateMatrix(fieldState);

    keys.sort((a, b) => b - a).forEach((key) => {
        newMatrix.splice(key, 1);
    });

    for (let i = 0; i < keys.length; i++) {
        newMatrix.unshift(new Array(fieldState[0].length).fill(0)); 
    }

    fieldState = unRotateMatrix(newMatrix);
}

function updateStatistics(linesCounter) {
    gameState.lines += linesCounter;
    gameState.score += (config.baseScoreOfLine + Math.round(gameState.currentSpeed / 50)) * linesCounter;

    if (gameState.lines >= config.speedUpEvery * (gameState.speedLevel)) {
        gameState.currentSpeed -= config.speedUpBy;
        gameState.speedLevel++;
        cvs.setRandColor();
    }
}


function unRotateMatrix(matrix){
    let newMatrix = [];

    for (let column = 0; column < matrix.length; column++) {
        newMatrix[column] = [];
    }

    for (let row = 0; row < matrix[0].length; row++) {
        for (let column = 0; column < matrix.length; column++) {
            newMatrix[column][row] = matrix[row][column]; 
        }
    }

    return newMatrix;
}

function rotateMatrix(matrix){
    let newMatrix = [];

    for (let row = 0; row < matrix[0].length; row++) {
        newMatrix[row] = [];
    }

    for (let rowIndex = 0; rowIndex < matrix[0].length; rowIndex++) {
        for (let columnIndex = 0; columnIndex < matrix.length; columnIndex++) {
            newMatrix[rowIndex].push(matrix[columnIndex][rowIndex]);   
        }
    }

    return newMatrix;
}

function rotateFigure() {
    if(!currentFigure.figureParams.rotate){
        return;
    }

    deleteFigure();

    let pivotX = currentFigure.currentPivot.x;
    let pivotY = currentFigure.currentPivot.y;

    const newPositions = currentFigure.position.map(pos => {
        
        let offsetX = pos.x - pivotX;
        let offsetY = pos.y - pivotY;

        let newX = -offsetY + pivotX;
        let newY = offsetX + pivotY;

        return { x: Math.round(newX), y: Math.round(newY) };
    });

    if(canPlaceFigure(newPositions)){
        currentFigure.position = newPositions.map(pos => ({ x: pos.x, y: pos.y }));
        returnFigureInField(); 
    } else {
        returnFigureInField();
    }
}

function deleteFigure(){
    currentFigure.position.forEach((pos) => {
        fieldState[pos.x][pos.y] = 0;
    });
}

function canPlaceFigure(position) {
    for (const pos of position) {
        if (pos.x < 0 || pos.x >= config.fieldSize.x || pos.y < 0 || pos.y >= config.fieldSize.y || fieldState[pos.x][pos.y] === 1) {
            return false; 
        }
    }
    return true;
}

function updateInterface(){
    Interface.update({
        lines: gameState.lines,
        score: gameState.score,
        speed: gameState.speedLevel,
    });
}

function savedPopUpData(newValues){
    localStorage.setItem('set', JSON.stringify(newValues));
    setSetings(newValues);
    reload();
}

function reload(){
    cvs.reload();
    gameState = getGameState();
    fieldState = [];
    initFieldArr();
    createFigure(getRandFigure());
    cvs.setRandColor();
    cvs.updateState(fieldState);
    updateInterface();
    startGame();
}

function getGameState(){
    return {
        inputMove: [],
        lines: 0,
        score: 0,
        currentSpeed: config.speed,
        speedLevel: 1,
        pause: false,
    };
}

function setSetings(newValues){
    config.fieldSize.x = newValues.width;
    config.fieldSize.y = newValues.height;
    config.speed = newValues.speed;
    config.minSpeed = newValues.speedMin;
    config.speedUpBy = newValues.speedUpBy;
    config.speedUpEvery = newValues.speedUpLevels;
}

function gamePause(value){
    gameState.pause = value;
}

function lose(){
    alert('lose');
}

initGame();
startGame();