class PopUp{
    constructor(
        overlayDOM,
        widthInput,
        heightInput,
        speedInput,
        speedMinInput,
        speedUpByInput,
        speedUpLevels,        
        saveBtnDOM,
        closeBtnDOM,
    ){
        this.overlay = overlayDOM;
        this.widthInput = widthInput;
        this.heightInput = heightInput;
        this.speedInput = speedInput;
        this.speedMinInput = speedMinInput;
        this.speedUpByInput = speedUpByInput;
        this.speedUpLevelsInput = speedUpLevels;
        this.saveBtn = saveBtnDOM;
        this.closeBtn = closeBtnDOM;

        this.setListeners();
    }

    static initFromDefault(){
        const popUp = document.querySelector('.pop-up');

        return new PopUp(
            document.querySelector('.overlay'),
            document.querySelector('#x'),
            document.querySelector('#y'),
            document.querySelector('#speed'),
            document.querySelector('#speedMin'),
            document.querySelector('#speedUpBy'),
            document.querySelector('#speeUpLevels'),
            document.querySelector('#popUpSaveBtn'),
            document.querySelector('#popUpCloseBtn'),

        );
    }

    open(closeSaveBtnAction = null, closeCanceBtnlAction = null, values){
        this.closeSaveBtnAction = closeSaveBtnAction;
        this.closeCanceBtnlAction = closeCanceBtnlAction;

        this.widthInput.value = values.width;
        this.heightInput.value = values.height;
        this.speedInput.value = values.speed;
        this.speedMinInput.value = values.speedMin;
        this.speedUpByInput.value = values.speedUpBy;
        this.speedUpLevelsInput.value = values.speedUpLevels;

        this.overlay.classList.add('active');
    }
    
    saveClose(){
        if(this.closeSaveBtnAction){
            this.closeSaveBtnAction(
                {
                    width: this.widthInput.value,
                    height: this.heightInput.value,
                    speed: this.speedInput.value,
                    speedMin: this.speedMinInput.value,
                    speedUpBy: this.speedUpByInput.value,
                    speedUpLevels: this.speedUpLevelsInput.value,
                }
            );
        }

        this.close();
    }
    
    Cancelclose(){
        if(this.closeCanceBtnlAction){
            this.closeCanceBtnlAction();
        }

        this.close();
    }
    
    close(){
        this.overlay.classList.remove('active');
    }

    setListeners(){
        this.saveBtn.addEventListener('click', () => {
            this.saveClose();
        });

        this.closeBtn.addEventListener('click', () => {
            this.Cancelclose();
        });
    }
}

export default PopUp