import PokemonController from './PokemonController.js';
import main from '../main.js';
import { inRangeId } from '../Helper/helper.js';
import Carousel from '../View/Carousel.js'
import API from '../Api/API.js';
export default class CarouselController {
    constructor(pokemon) {
        this.pokemonList = pokemon;        
        this.carousel = new Carousel();
        let {displayNames} = this.carousel.init(this.pokemonList)
        displayNames.find('input').on('change', event=>this.load(event.target))
    }
    move(direction){
        return this.getNewPokemon(direction).then(pokemon=>{
            if(!pokemon) return
            this.carousel.move(direction, pokemon);
        })
    }
    getNewPokemon(direction) {
        let after = direction=="Right"?1:-1;
        return new Promise(resolve => {
            resolve(PokemonController.move(after))
        }).then(pokemon=>{

                if(pokemon && this.pokemonList.map(el=>el?.name).includes(pokemon.name)) 
                    return this.pokemonList;
                
                if(after==1){
                    this.pokemonList.push(pokemon);
                    this.pokemonList.shift()
                } else {
                    this.pokemonList.unshift(pokemon)
                    this.pokemonList.pop();
                }
                return this.pokemonList;
            })
    }
    load(input){
        let id = parseInt(input.value);
        if(!inRangeId(id, 0)){
            input.value = main.selectedId;
            return;
        }
        main.selectedId = id;
        this.carousel.enableLoading(true);
        Promise.all(inRangeId(id).map(item=>API.getPokemon(item)))
            .then(pokemon=>this.pokemonList = pokemon)
            .then(pokemonList=> this.carousel.update(pokemonList))
    }
    reload(list){
        Promise.all(list.map(item=>API.getPokemon(item)))
            .then(pokemon=>this.pokemonList = pokemon)
            .then(pokemonList=> this.carousel.update(pokemonList))
    }
}