import { handleName, getPokemonFromList } from "../Helper/helper.js";

export default class Ability{
    constructor(data){
        this.name = handleName(data.name);
        this.effect = data.effect_entries.find(ef=>ef.language.name == 'en').short_effect
        this.pokemon = getPokemonFromList(data.pokemon).map((id, index)=>[id, data.pokemon[index].is_hidden]);
    }
}