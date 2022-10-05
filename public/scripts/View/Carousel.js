import { ButtonEffects } from '../View/Buttons.js'
import { inRangeId, emptyImage } from '../Helper/helper.js';
import PokemonController from '../Controller/PokemonController.js';
export default class Carousel {
    constructor() {
        this.list = $('#main-display');
        this.displayLi = null;
        this.loading = $('#loading-main-display')
        this.pokemonName = $('#pokemon-name');
        this.displayNames = null;
        this.buttons = new ButtonEffects();
    }
    init(pokemonList) {
        
        this.list.find('li').remove();
        PokemonController.selectedId = pokemonList[2].id;
        pokemonList.forEach((pokemon, index) => {
            this.list.append($(`<li class="displayPokemon${index}"> <img src="${pokemon ? pokemon.sprite.main:emptyImage}"/></li>`))
        })
        pokemonList.slice(1, 4).forEach((pokemon, index)=>{
            this.pokemonName.append($(`<div class="pokemonName${index}"><input type="number" value="${pokemon?pokemon.id:0}"><span>. ${pokemon?pokemon.name:''}</span></div>`))
        })
        this.displayLi = this.list.find('li')
        this.displayNames = this.pokemonName.find('div')

        this.buttons.enabled(pokemonList[1] != null, pokemonList[3] != null)
        return {displayLi:this.displayLi, displayNames:this.displayNames};
    }
    move(direction, newPokemonList) {
        this.displayLi.addClass('moving' + direction)
        this.displayNames.addClass('moving' + direction)
        if (direction == 'Left') PokemonController.selectedId--;
        if (direction == 'Right') PokemonController.selectedId++;
        setTimeout(() => {
            this.displayLi.removeClass('moving' + direction)
            this.displayNames.removeClass('moving' + direction)
            
            this.buttons.enabled(inRangeId(PokemonController.selectedId, -1), inRangeId(PokemonController.selectedId, 1))
            this.update(newPokemonList)
        }, 500)
        return PokemonController.selectedId;
    }
    update(pokemonList){
        PokemonController.selectedId = pokemonList[2].id;
        this.displayLi.each((index, li)=>{
            let img = $(li).find('img')
            let pokemon = pokemonList[index];

            img.attr('src', pokemon?pokemon.sprite.main:emptyImage)
        })
        this.displayNames.each((index, div)=>{
            let pokemon = pokemonList[index+1];
            $(div).find('input').val(pokemon?pokemon.id:0);
            $(div).find('span').text(pokemon?`. ${pokemon.name}`:'');
        })
        this.enableLoading(false)
        return PokemonController.selectedId;
    }
    enableLoading(enable){
        if(enable){
            this.displayLi.find('img').attr('src', emptyImage);
            this.loading.addClass('active');
            return;
        }

        this.loading.removeClass('active');
    }
}