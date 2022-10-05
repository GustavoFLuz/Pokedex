import {moveCarousel} from "../main.js";

export class ButtonEffects{
    constructor(){
        this.left = $('#left-btn');
        this.right = $('#right-btn');
        this.btnClicked = false;
        this.init();
    }
    
    init(){
        this.left.on('mousedown', ()=>this.buttonPress('Left'));
        this.left.on('mouseup', this.buttonRelease);
        this.right.on('mousedown', ()=>this.buttonPress('Right'));
        this.right.on('mouseup', this.buttonRelease);
    }

    buttonPress(direction){
        if(this.btnClicked) return;
        this.btnClicked=true;
        $("#bottom-btns").addClass('tilt'+direction)
        moveCarousel(direction)

        setTimeout(()=>{
            this.btnClicked = false;
        }, 500)
    }
    buttonRelease(){
        $("#bottom-btns").removeClass('tiltLeft')
        $("#bottom-btns").removeClass('tiltRight')
    }
    enabled(lower, higher){
        this.left.prop('disabled', !lower)
        this.right.prop('disabled', !higher)
    }
}