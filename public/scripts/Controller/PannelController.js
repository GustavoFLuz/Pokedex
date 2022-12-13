import { Pannel } from "../View/Pannel.js";
import main from "../main.js";
import PokemonController from "./PokemonController.js";
export class PannelController {
    constructor() {
        this.pannel = new Pannel();
        this.selectedPannel = 1;
        this.init();
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
                PokemonController.getPokemon(main.selectedId)
                    .then(pokemon=>{
                        this.pannel.renderInfo(pokemon); 
                        this.pannel.enableLoading(false);
                    })
                break;
            case 2: 
                this.pannel.renderSearch();
                this.pannel.enableLoading(false);
                break;
            case 3:
                this.pannel.renderList();
                this.pannel.enableLoading(false);
                break;
        }
    }
}