import PannelInfo from "./PannelInfo.js";
export class Pannel {
    constructor() {
        this.display = $('#secondary-display')
        this.selector = $('#tab-selector');
        this.slider = this.selector.find('#slider');
        this.content = this.display.find('.content');
        
        this.changingAnimation = true;
        this.transitionTime = 1000;
    
        this.pannelInfo = new PannelInfo(this.content);
        this.init();
    }
    init() {
        this.slider.addClass('dislocate1');
        this.selector
        setTimeout(() => {
            this.changingAnimation = false;
        }, this.transitionTime)
    }
    dislocate(event) {
        if (this.changingAnimation) return false;
        let li = $(event.target)
        if (li[0].nodeName != "LI") li = li.parents('li')
        this.slider.attr('class', 'dislocate' + li.index());
        this.switchDisplay(li.index())
        return li.index();
    }
    switchDisplay(index) {
        this.changingAnimation = true;
        this.content.find('.active').toggleClass('active hiding')
        setTimeout(() => {
            this.content.find(`div`).removeClass('hiding')
            this.content.find(`div:nth-child(${index})`).toggleClass('active');
            setTimeout(() => {
                this.changingAnimation = false;
            }, this.transitionTime)
        }, this.transitionTime)
    }


    enableLoading(enable){
        if(enable){
            this.display.find('.block').addClass('ds-none');
            this.display.find('.content>div').append('<div class="loading-secondary-display"></div>');
            return;
        }
        this.display.find('.block').removeClass('ds-none');
        this.content.find('.loading-secondary-display').remove();
    }
    
    renderInfo(pokemon){
        this.pannelInfo.setPokemon(pokemon)
    }

    renderSearch(){

    }
    renderList(){

    }
}