import { getIdFromUrl, handleName } from "../Helper/helper.js"
export default class Move{
    constructor({id, learned_by_pokemon, name}, type){
        this.id = id;
        this.name = handleName(name)
        this.pokemon = learned_by_pokemon.map(poke=>getIdFromUrl(poke.url))
        this.type = type;
    }
}