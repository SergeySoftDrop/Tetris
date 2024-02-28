import config from "./config.js";
import { getRandColor } from "./rand.js";

class Canvas{

    constructor(){
        this.init();
    }

    init(){
        this.DOMMcvs = this.create();
        this.#setSize();
        this.ctx = this.#createCtx();
        this.#drawCells();   
    }
    
    create(){
        const cvsMain = document.createElement('canvas');
        const cvsNext = document.createElement('canvas');
        document.querySelector('#main_canvas').append(cvsMain);
        document.querySelector('#next_canvas').append(cvsNext);
        return {main: cvsMain, next: cvsNext};
    }

    #createCtx(){
        return {
            main: this.DOMMcvs.main.getContext('2d'),
            next: this.DOMMcvs.next.getContext('2d'),
        };
    }

    #createSquare(x, y, ctx){
        ctx.fillRect(x, y, config.cellSize, config.cellSize);
    }

    updateState(state, nextFigure){
        this.clear();
        this.#drawCells();
        state.forEach((x, xKey) => {
            x.forEach((y, yKey) => {
                if(y == 1){
                    this.#createSquare(xKey * config.cellSize, yKey * config.cellSize, this.ctx.main);
                }
            });
        });

        nextFigure.shape.forEach((y, yKey) => {
            y.forEach((x, xKey) => {
                if(x == 1){
                    this.#createSquare(xKey * config.cellSize, yKey * config.cellSize, this.ctx.next);
                }
            });
        });
    }

    clear(){
        this.ctx.main.clearRect(0, 0, this.DOMMcvs.main.width, this.DOMMcvs.main.height);        
        this.ctx.next.clearRect(0, 0, this.DOMMcvs.next.width, this.DOMMcvs.next.height);
    }

    setFillStyle(styles){
        if(styles.color){
            this.ctx.main.fillStyle = styles.color;
        }
        if(styles.opacity){
            this.ctx.main.globalAlpha = styles.opacity;
        }
        if(styles.pattern){
            const pattern = this.ctx.main.createPattern(styles.pattern, 'repeat');
            this.ctx.main.fillStyle = pattern;
        }
    }
    
    setStrokeStyle(styles){
        if(styles.color){
            this.ctx.main.strokeStyle = styles.color;
        }
        if(styles.width){
            this.ctx.main.lineWidth = styles.width;
        }
        if(styles.opacity){
            this.ctx.main.globalAlpha = styles.opacity;
        }
        if(styles.dash){
            this.ctx.main.setLineDash(styles.dash);
        }
    }
    
    setRandColor(){
        const randColor = getRandColor();
        this.setFillStyle({color: randColor})
        this.setStrokeStyle({color: randColor})
    }

    reload(){
        this.#setSize();
        this.#drawCells();   
    }

    #drawCells(){
        for (let x = 0; x <= config.fieldSize.x; x++){
            this.#drawLine({x: x * config.cellSize, y: 0}, {x: x * config.cellSize, y: this.DOMMcvs.main.height}, this.ctx.main);
        }
        for (let y = 0; y <= config.fieldSize.y; y++){
            this.#drawLine({x: 0, y: y * config.cellSize}, {x: this.DOMMcvs.main.width, y: y * config.cellSize}, this.ctx.main);
        }

        for (let i = 0; i <= config.figureSize; i++) {
            this.#drawLine({x: 0, y: i * config.cellSize}, {x: this.DOMMcvs.next.width, y: i * config.cellSize}, this.ctx.next)
            this.#drawLine({x: i * config.cellSize, y: 0}, {x: i * config.cellSize, y: this.DOMMcvs.next.height}, this.ctx.next);
        }
    }
    
    #drawLine(posOne, posTwo, ctx){
        ctx.beginPath();
        ctx.moveTo(posOne.x, posOne.y);
        ctx.lineTo(posTwo.x, posTwo.y);
        ctx.stroke();
    }    

    #setSize(){
        this.DOMMcvs.main.width = config.fieldSize.x * config.cellSize;;
        this.DOMMcvs.main.height = config.fieldSize.y * config.cellSize;
        this.DOMMcvs.next.width = config.figureSize * config.cellSize;
        this.DOMMcvs.next.height = config.figureSize * config.cellSize;
    }
}

export default Canvas