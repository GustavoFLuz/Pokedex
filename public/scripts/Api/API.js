import Pokemon from "../Models/Pokemon.js";
import Type from "../Models/Type.js"
import Ability from "../Models/Ability.js";
import Nature from "../Models/Nature.js";
import Move from "../Models/Moves.js";
import PokemonSpecies from "../Models/PokemonSpecies.js";

import { handleName, getIdFromUrl} from "../Helper/helper.js";
import config from "../config.js";

class API{
    static instance = null;

    constructor(){
        this.pokedexWrapper = new Pokedex.Pokedex();
        this.pokedexWrapper.config.cacheImages = true;
        this.pokedexWrapper.config.timeout = 10000;
        this._lists = {
            pokemon: [],
            species: [],
            type: [],
            move: [],
            ability:[]
        }
        API.instance = this;
    }

    static getInstance(){
        if(API.instance == null) return new API();
        return API.instance;
    }

    async getPokemonData(id){
        id = typeof(id)=="string"?id.toLowerCase():id;
        return this.pokedexWrapper.getPokemon(id)
    }   
    getPokemon(id){
        if(id<0) return null;
        console.time("Loading pokemon "+id);
        if(this._lists.pokemon[id]){
            console.timeEnd("Loading pokemon "+id);

            return new Promise((resolve, reject)=>resolve(this._lists.pokemon[id]))
        }
        return new Promise(async (resolve, reject)=>{
            const data1 = await Promise.all([this.getPokemonData(id), this.getPokemonSpecies(id)])
            var pokemonData = data1[0];
            var species = data1[1]
            const data2 = await Promise.all([this.getPokemonAbilities(pokemonData.abilities), this.getPokemonMoves(pokemonData.moves)])
            var abilities = data2[0];
            var moves = data2[1];
            var pokemon = new Pokemon(pokemonData, species, abilities, moves);
            this._lists.pokemon[id] = pokemon;
            console.timeEnd("Loading pokemon "+id);
            resolve(pokemon);
        })
    }
    async preload(){
        this.pokedexWrapper.getNature(Array.from(Array(26).keys()).slice(1));
        this.pokedexWrapper.getType(Array.from(Array(config.maxTypeId).keys()).slice(1));
    }
    async getLists(){
        return Promise.all([
            $.get("https://pokeapi.co/api/v2/pokemon/?limit="+config.maxSelectedId),
            $.get("https://pokeapi.co/api/v2/ability/?limit="+config.maxAbilityId),
            $.get("https://pokeapi.co/api/v2/move/?limit="+config.maxMoveId),
            $.get("https://pokeapi.co/api/v2/type/?limit="+config.maxTypeId)
        ])
    }

    getPokemonSpecies(id){
        if(id<0) return null;
        id = typeof(id)=="string"?id.toLowerCase():id;
        if(this._lists.species[id]) return new Promise(async (resolve, reject)=>resolve(this._lists.species[id]))

        return new Promise(async (resolve, reject)=>{
            var data = await this.pokedexWrapper.getPokemonSpeciesByName(id);
            var species = new PokemonSpecies(data);
            this._lists.species[id] = species;
            resolve(species);
        })
    }

    getPokemonType(id){
        id = typeof(id)=="string"?id.toLowerCase():id;
        if(id<0) return null;
        if(this._lists.type[id]) return new Promise(async (resolve, reject)=>resolve(this._lists.type[id]))
        return new Promise(async (resolve, reject)=>{
            var data = await this.pokedexWrapper.getType(id);
            var type = new Type(data);
            this._lists.type[id] = type;
            resolve(type);
        })
    }

    getPokemonTypes(){
        return Promise.all(Array.from(Array(19).keys()).slice(1).map(id=>this.pokedexWrapper.getType(id)))
            .then(data=>data.reduce((arr, type)=>{
                const formatedType = new Type(type);
                arr[formatedType.name] = formatedType;
                return arr;
            }, []))
    }

    getPokemonAbility(id){
        id = typeof(id)=="string"?id.toLowerCase():id;
        if(this._lists.ability[id]) return new Promise((resolve, reject)=>resolve(this._lists.ability[id]))
        return new Promise(async (resolve, reject)=>{
            let abilityData = await this.pokedexWrapper.getAbility(id)
            let ability = new Ability(abilityData);
            this._lists.ability[id] = ability;
            resolve(ability);
        })
    }

    getPokemonAbilities(abilitiesData){
        return Promise.all(abilitiesData.map(data => this.getPokemonAbility(getIdFromUrl(data.ability.url))))
    }

    getPokemonNature(id){
        if(id<0) return null;
        return new Promise(async (resolve, reject)=>{
            var data = await this.pokedexWrapper.getNature(id);
            var nature = new Nature(data);
            resolve(nature);
        })
    }

    getPokemonNatures(){
        return Promise.all(Array.from(Array(26).keys()).slice(1).map(id=>this.pokedexWrapper.getNature(id)))
            .then(data=>data.reduce((arr, nat)=>{
                const formatedNature = new Nature(nat);
                arr[handleName(formatedNature.name)] = formatedNature;
                return arr;
            }, []))
    } 
    
    getPokemonMove(id){
        if(id<0) return null;
        if(this._lists.move[id]) return new Promise(async (resolve, reject)=>resolve(this._lists.move[id]))
        return new Promise(async(resolve, reject)=>{
            const data = await this.pokedexWrapper.getMove(id)
            const type = await this.getPokemonType(id)
            const move = new Move(data, type)
            this._lists.move[id] = move
            resolve(move)
        })
    }
    getPokemonMoves(moveList){
        const filteredData = moveList.filter(move => move.version_group_details.find(version => version.version_group.name == "black-white"))
        return Promise.all([this.pokedexWrapper.getMove(filteredData.map(move => getIdFromUrl(move.move.url)))])
            .then(async res=>{
                return await Promise.all(res[0].map(async (data)=>{
                    const id = data.id
                    const type = await this.getPokemonType(getIdFromUrl(data.type.url))
                    const move = new Move(data, type)
                    this._lists.move[id] = move
                    return move
                }))
            })
    }
}
export default API.getInstance();