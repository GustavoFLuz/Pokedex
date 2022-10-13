import API from "../Api/API.js"

import Pokemon from "../Models/Pokemon.js"
import Type from "../Models/Type.js"
import Ability from "../Models/Ability.js";
import Nature from "../Models/Nature.js";

import PokemonSpecies from "../Models/PokemonSpecies.js";
import { handleName } from "../Helper/helper.js";
class PokemonController{
    static instance = null;

    constructor(){
        this.api = API.getInstance();
        this.api.preload();
    }

    static getInstance(){
        if(PokemonController.instance==null) return new PokemonController();
        return PokemonController.instance;
    }

    getPokemon(id){
        if(id<0) return null;
        return new Promise(async (resolve, reject)=>{
            var data = await this.api.getPokemon(id);
            var species = await this.getPokemonSpecies(id)
            var abilities = await this.getPokemonAbilities(data.abilities);
            var pokemon = new Pokemon(data, species, abilities);
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
        return new Promise(async (resolve, reject)=>{
            var data = await this.api.getType(id);
            var type = new Type(data);
            resolve(type);
        })
    }

    getPokemonTypes(){
        return Promise.all(Array.from(Array(18).keys()).slice(1).map(n=>this.api.getType(n)))
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
}

export default PokemonController.getInstance();