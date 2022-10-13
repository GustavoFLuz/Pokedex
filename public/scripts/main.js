import { CarouselController } from './Controller/CarouselController.js'
import { PannelController } from './Controller/PannelController.js';
import PokemonController from './Controller/PokemonController.js';
import { inRangeId } from './Helper/helper.js'
class Main {
    constructor() {
        this.selectedPokemonId = null;

        this.pController = PokemonController;
        this.carouselController = null;
        this.pannelController = null;

        Promise.all([-1, -1, 1, 2, 3].map(id => this.pController.getPokemon(id)))
            .then(data=>{
                this.carouselController = new CarouselController(data);
                this.pannelController = new PannelController();
                this.selectedId = 1;
            })
    }

    set selectedId(id){
        this.selectedPokemonId = parseInt(id);

        if(this.pannelController)
            this.pannelController.update();

    }
    get selectedId(){
        return this.selectedPokemonId;
    }
}

const main = new Main();
export default main;
