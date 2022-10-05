import PokemonController from './PokemonController.js';
import { inRangeId } from '../Helper/helper.js';
import Carousel from '../View/Carousel.js'
export class CarouselController {
    constructor(pokemon) {
        this.pokemonList = pokemon;        
        this.carousel = new Carousel();
        let {displayNames} = this.carousel.init(this.pokemonList)
        displayNames.find('input').on('change', event=>this.load(event.target))
    }
    move(direction){
        this.getNewPokemon(direction).then(pokemon=>{
            PokemonController.selectedId = this.carousel.move(direction, pokemon);
        })
    }
    async getNewPokemon(direction) {
        let after = direction=="Right"?1:-1;
        return new Promise(resolve => {
            let newId = PokemonController.selectedId + (after * 3);
            resolve(inRangeId(newId, 0)?PokemonController.getPokemon(newId):null)
        }).then(pokemon=>{
                if(after==1){
                    this.pokemonList.push(pokemon);
                    this.pokemonList.shift()
                } else {
                    this.pokemonList.unshift(pokemon)
                    this.pokemonList.pop();
                }
                return this.pokemonList
            })
    }
    load(input){
        let id = parseInt(input.value);
        if(!inRangeId(id, 0)){
            input.value = PokemonController.selectedId;
            return;
        }
        PokemonController.selectedId = id;
        this.carousel.enableLoading(true);
        Promise.all(inRangeId(id).map(item=>PokemonController.getPokemon(item)))
            .then(pokemon=>this.pokemonList = pokemon)
            .then(pokemonList=> this.carousel.update(pokemonList))
    }
}