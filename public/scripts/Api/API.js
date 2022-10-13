export default class API{
    static instance = null;

    constructor(){
        this.pokedexWrapper = new Pokedex.Pokedex();
        this.pokedexWrapper.config.cacheImages = true;
        this.pokedexWrapper.config.timeout = 2000;

        API.instance = this;
    }

    static getInstance(){
        if(API.instance == null) return new API();
        return API.instance;
    }

    async getPokemon(id){
        id = typeof(id)=="string"?id.toLowerCase():id;
        return this.pokedexWrapper.getPokemon(id)
    }
    async getPokemonSpecies(id){
        id = typeof(id)=="string"?id.toLowerCase():id;
        return this.pokedexWrapper.getPokemonSpeciesByName(id);
    }
    async getType(id){
        id = typeof(id)=="string"?id.toLowerCase():id;
        return this.pokedexWrapper.getType(id)
    }
    
    async getAbility(id){
        id = typeof(id)=="string"?id.toLowerCase():id;
        return this.pokedexWrapper.getAbility(id);
    }
    
    async getNature(id){
        id = typeof(id)=="string"?id.toLowerCase():id;
        return this.pokedexWrapper.getNature(id);
    }

    async preload(){
        this.pokedexWrapper.getNature(Array.from(Array(26).keys()).slice(1));
        this.pokedexWrapper.getType(Array.from(Array(18).keys()).slice(1));
    }

}