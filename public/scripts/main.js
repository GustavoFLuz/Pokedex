import { CarouselController } from './Controller/CarouselController.js'
import { PannelController } from './Controller/PannelController.js';
import PokemonController from './Controller/PokemonController.js';
import { inRangeId } from './Helper/helper.js'
class Main {
    constructor() {
        this.carouselController = null;
        this.pannelController = null;
        this.init(); 
    }
    init() {
        Promise.all([
            PokemonController.getPokemonTypes(), 
            PokemonController.getPokemonNatures()
        ]).then((promisesResults) => {
            Promise.all(
                [-1, -1, 1, 2, 3].map(id => PokemonController.getPokemon(id)),
            )
                .then(data => {
                    this.pannelController = new PannelController();
                    this.carouselController = new CarouselController(data)
                })
        })
    }
}

const main = new Main();
export default main;
export function moveCarousel(direction){return main.carouselController.move(direction)};
export function updatePannel(){return main.pannelController.update()};