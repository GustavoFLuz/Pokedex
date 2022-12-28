import { Pannel } from "../View/Pannel.js";
import main from "../main.js";
import API from "../Api/API.js";
export default class PannelController {
    constructor() {
        this.pannel = new Pannel();
        this.selectedPannel = 1;
        this.init();
        this.update();
    }
    init() {
        this.pannel.selector.find('li:not(.slider)').click((event) => {
            var index = this.pannel.dislocate(event)
            if(!index) return;
            this.selectedPannel = index;
            setTimeout(()=>{
                this.pannel.enableLoading(true)
                this.update()
            }, this.pannel.transitionTime)
        })
    }
    update(){
        switch(this.selectedPannel){
            case 1: 
                return API.getPokemon(main.selectedId)
                    .then(pokemon=>{
                        this.pannel.renderInfo(pokemon); 
                        this.pannel.enableLoading(false);
                    })
            case 2: 
                return this.pannel.enableLoading(false);
            case 3:
                return this.pannel.enableLoading(false);
        }
    }
}