import API from "../Api/API.js"

import Pokemon from "../Models/Pokemon.js"
import Type from "../Models/Type.js"
import Ability from "../Models/Ability.js";
import Nature from "../Models/Nature.js";
import Move from "../Models/Moves.js";

import PokemonSpecies from "../Models/PokemonSpecies.js";
import { handleName, getIdFromUrl } from "../Helper/helper.js";
class PokemonController{
    static instance = null;

    constructor(){
        this.api = API.getInstance();
        this.api.preload();
        this.pokemonList = [];
        this.typeList = [];
        this.moveList = [];
    }

    static getInstance(){
        if(PokemonController.instance==null) return new PokemonController();
        return PokemonController.instance;
    }

    getPokemon(id){
        if(id<0) return null;
        if(this.pokemonList[id]) return new Promise((resolve, reject)=>resolve(this.pokemonList[id]))
        return new Promise(async (resolve, reject)=>{
            const data1 = await Promise.all([this.api.getPokemon(id), this.getPokemonSpecies(id)])
            var pokemonData = data1[0];
            var species = data1[1]
            const data2 = await Promise.all([this.getPokemonAbilities(pokemonData.abilities), this.getPokemonMoves(pokemonData.moves)])
            var abilities = data2[0];
            var moves = data2[1];
            var pokemon = new Pokemon(pokemonData, species, abilities, moves);
            this.pokemonList[id] = pokemon
            resolve(pokemon);
        })
    }

    getPokemonSpecies(id){
        if(id<0) return null;
        return new Promise(async (resolve, reject)=>{
            var data = await this.api.getPokemonSpecies(id);
            var species = new PokemonSpecies(data);
            resolve(species);
        })
    }

    getPokemonType(id){
        if(id<0) return null;
        if(this.typeList[id]) return new Promise(async (resolve, reject)=>resolve(this.typeList[id]))
        return new Promise(async (resolve, reject)=>{
            var data = await this.api.getType(id);
            var type = new Type(data);
            this.typeList[id] = type;
            resolve(type);
        })
    }

    getPokemonTypes(){
        return Promise.all(Array.from(Array(19).keys()).slice(1).map(n=>this.api.getType(n)))
            .then(data=>data.reduce((arr, type)=>{
                const formatedType = new Type(type);
                arr[formatedType.name] = formatedType;
                return arr;
            }, []))
    }

    getPokemonAbilities(abilitiesData){
        return Promise.all(abilitiesData
            .map(data => this.api.getAbility(data.ability.name)))
            .then(info => info.map(ability => new Ability(ability)))
    }

    getPokemonNature(id){
        if(id<0) return null;
        return new Promise(async (resolve, reject)=>{
            var data = await this.api.getNature(id);
            var nature = new Nature(data);
            resolve(nature);
        })
    }

    getPokemonNatures(){
        return Promise.all(Array.from(Array(26).keys()).slice(1).map(n=>this.api.getNature(n)))
            .then(data=>data.reduce((arr, nat)=>{
                const formatedNature = new Nature(nat);
                arr[handleName(formatedNature.name)] = formatedNature;
                return arr;
            }, []))
    } 
    getPokemonMoves(moveList){
        const filteredData = moveList.filter(move => move.version_group_details.find(version => version.version_group.name == "black-white"))
        return Promise.all(filteredData.map(move => this.getMoveData(getIdFromUrl(move.move.url))))
    }
    getMoveData(id){
        if(id<0) return null;
        if(this.moveList[id]) return new Promise(async (resolve, reject)=>resolve(this.moveList[id]))
        return new Promise(async(resolve, reject)=>{
            const data = await this.api.getMove(id)
            const type = await this.getPokemonType(getIdFromUrl(data.type.url))
            const move = new Move(data, type)
            this.moveList[id] = move
            resolve(move)
        })
    }
}

export default PokemonController.getInstance();