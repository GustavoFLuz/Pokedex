import API from "../Api/API.js";
import config from "../config.js";
class PokemonController{
    static instance = null;

    constructor(){  
        this.selectedId = 1;
        this.selectedIndex = 0;
        this.renderingPokemon = [];
        for(let i=config.minSelectedId;i<=config.maxSelectedId;i++){
            this.renderingPokemon.push(i)
        }
    }

    static getInstance(){
        if(!PokemonController.instance) return new PokemonController();
        return PokemonController.instance;
    }

    getPokemonStart(){
        return new Promise([-1, -1, this.renderingPokemon[0], this.renderingPokemon[1], this.renderingPokemon[2]].map(id => this.getPokemon(id)))
    }

    update(list){
        this.renderingPokemon = list;
        this.selectedId = list[0];
        this.selectedIndex = 0;
    }

    move(after){
        if(!this.getValid(after*3)) return null;
        return new Promise(async resolve=>{
            const pokemon = await API.getPokemon(this.renderingPokemon[this.selectedIndex+after*3])
            this.selectedIndex += after
            this.selectedId = this.renderingPokemon[this.selectedIndex];
            resolve(pokemon)
        })
    }

    getValid(dist){
        return Boolean(this.renderingPokemon[this.selectedIndex+dist])
    }
}

export default PokemonController.getInstance();