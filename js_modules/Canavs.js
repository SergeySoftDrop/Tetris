import config from "./config.js";
import { getRandColor } from "./rand.js";

class Canvas{
    constructor(){
        this.init();
    }

    init(){
        this.DOMcvs = this.create();
        this.#setSize();
        this.ctx = this.DOMcvs.getContext('2d');
        this.#drawCells();   
    }
    
    create(){
        const cvs = document.createElement('canvas');
        document.querySelector('#game').append(cvs);
        return cvs;
    }

    #createSquare(x, y){
        this.ctx.fillRect(x, y, config.cellSize, config.cellSize);
    }

    updateState(state){
        this.clear();
        this.#drawCells();
        state.forEach((x, xKey) => {
            x.forEach((y, yKey) => {
                if(y == 1){
                    this.#createSquare(xKey * config.cellSize, yKey * config.cellSize);
                }
            });
        });
    }

    clear(){
        this.ctx.clearRect(0, 0, this.DOMcvs.width, this.DOMcvs.height);        
    }

    setFillStyle(styles){
        if(styles.color){
            this.ctx.fillStyle = styles.color;
        }
        if(styles.opacity){
            this.ctx.globalAlpha = styles.opacity;
        }
        if(styles.pattern){
            const pattern = this.ctx.createPattern(styles.pattern, 'repeat');
            this.ctx.fillStyle = pattern;
        }
    }
    
    setStrokeStyle(styles){
        if(styles.color){
            this.ctx.strokeStyle = styles.color;
        }
        if(styles.width){
            this.ctx.lineWidth = styles.width;
        }
        if(styles.opacity){
            this.ctx.globalAlpha = styles.opacity;
        }
        if(styles.dash){
            this.ctx.setLineDash(styles.dash);
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
            this.#drawLine({x: x * config.cellSize, y: 0}, {x: x * config.cellSize, y: this.DOMcvs.height});
        }
        
        for (let y = 0; y <= config.fieldSize.y; y++){
            this.#drawLine({x: 0, y: y * config.cellSize}, {x: this.DOMcvs.width, y: y * config.cellSize});
        }
    }
    
    #drawLine(posOne, posTwo){
        this.ctx.beginPath();
        this.ctx.moveTo(posOne.x, posOne.y);
        this.ctx.lineTo(posTwo.x, posTwo.y);
        this.ctx.stroke();
    }    

    #setSize(){
        this.width = config.fieldSize.x * config.cellSize;
        this.height = config.fieldSize.y * config.cellSize;

        this.DOMcvs.width = this.width;
        this.DOMcvs.height = this.height;
    }
}

export default Canvas