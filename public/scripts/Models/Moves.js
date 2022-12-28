import { getPokemonFromList, handleName } from "../Helper/helper.js"
export default class Move{
    constructor({id, learned_by_pokemon, name}, type){
        this.id = id;
        this.name = handleName(name)
        this.pokemon = getPokemonFromList(learned_by_pokemon)
        this.type = type;
    }
}