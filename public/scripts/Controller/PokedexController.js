import CarouselController from "./CarouselController.js";
import PannelController from "./PannelController.js";
import FilterController from "./FilterController.js";
export default class PokedexController{
    constructor(initialPokemon){
        console.time("Carousel Loading")
        this.carouselController = new CarouselController(initialPokemon);
        console.timeEnd("Carousel Loading")
        console.time("Pannel Loading")
        this.pannelController = new PannelController(initialPokemon[2]);
        console.timeEnd("Pannel Loading")
        console.time("Filter Loading")
        this.filterController = new FilterController();
        console.timeEnd("Filter Loading")
        this.filterController.getData()
    }

    update(res){
        let list = [-1, -1, res[0]?res[0]:-1, res[1]?res[1]:-1, res[2]?res[2]:-1];
        
        this.carouselController.reload(list)
        this.pannelController.update();
    }
}