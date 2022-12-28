import { handleName, getPokemonFromList } from "../Helper/helper.js";

export default class Ability{
    constructor({name, pokemon, effect_entries}){
        this.name = handleName(name);
        this.effect = effect_entries.find(ef=>ef.language.name == 'en').short_effect
        this.pokemon = getPokemonFromList(pokemon.map(el=>el.pokemon)).map((el, index)=>{el.hidden = pokemon[index].is_hidden; return el});
    }
}