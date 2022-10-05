import API from "./API.js"

import Pokemon from "../Models/Pokemon.js"
import Type from "../Models/Type.js"
import Ability from "../Models/Ability.js";
import Nature from "../Models/Nature.js";

import PokemonSpecies from "../Models/PokemonSpecies.js";
import { updatePannel } from "../main.js";
import { getIdFromUrl, handleName } from "../Helper/helper.js";

export default class PokemonController{
    static list = [];
    static speciesList = [];
    static selectedPokemonId = 1;
    static types = [];
    static abilities = [];
    static natures = [];


    static getPokemon(id){
        if(id<0) return null;
        return new Promise(async (resolve, reject)=>{
            if(PokemonController.list[id] !=undefined) 
                return resolve(PokemonController.list[id]);
                var data = await API.getPokemon(id);
                var species = await PokemonController.getPokemonSpecies(id)
                var abilities = await PokemonController.getPokemonAbilities(data.abilities);
            PokemonController.list[id] = new Pokemon(data, species, abilities);
            //console.log(PokemonController.list[id])
            resolve(PokemonController.list[id]);
        })
    }

    static getPokemonSpecies(id){
        if(id<0) return null;
        return new Promise(async (resolve, reject)=>{
            if(PokemonController.speciesList[id] !=undefined) 
                return resolve(PokemonController.list[id]);
            var data = await API.getPokemonSpecies(id);
            PokemonController.speciesList[id] = new PokemonSpecies(data);
            resolve(PokemonController.speciesList[id]);
        })
    }

    static getPokemonTypes(){
        return API.getTypes().then(data=>{
            return Promise.all(data.results.map(type=>API.getTypesInfo(type.name)))
                .then(typesInfo=>typesInfo.forEach((obj=>{
                    let type = new Type(obj)
                    PokemonController.types[type.name] = type.info;
                })))
        });
    }

    static getPokemonAbilities(abilitiesData){
        return Promise.all(abilitiesData.map(ab=>{
            let name = handleName(ab.ability.name);
            let id = getIdFromUrl(ab.ability.url)
            return new Promise(async (resolve, reject)=>{
                if(PokemonController.abilities[name] !=undefined) 
                    return resolve(PokemonController.abilities[name]);
                var data = await API.getAbility(id);
                PokemonController.abilities[name] = new Ability(data);
                resolve(PokemonController.abilities[name]);
            })
        }));
    }

    static getPokemonNatures(){
        return API.getNatures().then(data=>{
            return Promise.all(data.results.map(nature=>API.getNaturesInfo(nature.name)))
                .then(naturesInfo=>naturesInfo.forEach((obj=>{
                    let nature = new Nature(obj)
                    PokemonController.natures[nature.name] = nature;
                })))
        });
    }
    static set selectedId(id){
        updatePannel();
        PokemonController.selectedPokemonId = parseInt(id);
    }
    static get selectedId(){
        return PokemonController.selectedPokemonId;
    }
}