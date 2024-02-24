import PopUp from "./PopUp.js";

class GameInterface{
    popUp = null;

    constructor(
        linesCounterDOM,
        scoreCounterDOM,
        speedCounterDOM,
        setBtnDOM,
        relBtnDOM
    ){
        this.linesDOM = linesCounterDOM;
        this.scoreDOM = scoreCounterDOM;
        this.speedLevelDOM = speedCounterDOM;
        this.setBtn = setBtnDOM; 
        this.reloadBtn = relBtnDOM;
    }

    static initFromDefault(){
        return new GameInterface(
            document.querySelector('#lines_counter'),
            document.querySelector('#score_counter'),
            document.querySelector('#speed_level_counter'),
            document.querySelector('#set_btn'),
            document.querySelector('#reload_btn'),
        );
    }

    update(newData){
        if(newData.lines){
            this.updateLines(newData.lines);
        }
        if(newData.score){
            this.updateScore(newData.score);
        }
        if(newData.speed){
            this.updateSpeed(newData.speed);
        }
    }

    updateLines(linesCount){
        this.linesDOM.innerText = linesCount;
    }

    updateScore(scoreCount){
        this.scoreDOM.innerText = scoreCount;     
    }

    updateSpeed(speed){
        this.speedLevelDOM.innerText = speed;
    }

    openPopUp(closeSaveBtnAction = null, closeCancelAction = null, values){
        if(!this.popUp){
            this.popUp = PopUp.initFromDefault();
        }

        this.popUp.open(closeSaveBtnAction, closeCancelAction, values);
    }
}

export default GameInterface