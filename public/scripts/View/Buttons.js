import main from "../main.js";

export class Buttons{
    constructor(){
        this.left = $('#left-btn');
        this.right = $('#right-btn');
        this.btnClicked = false;
        this.btnTimeout = null;
        this.btnClickedTimeout = null;
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
        main.pokedex.carouselController.move(direction).then(res=>{
            setTimeout(()=>{this.btnClicked = false;}, 250)
        })
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