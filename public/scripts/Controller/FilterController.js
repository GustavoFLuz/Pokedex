import { getPokemonFromList } from "../Helper/helper.js";
import config from "../config.js";
import API from "../Api/API.js";
export default class FilterController{
    constructor(){
        this.div = $('#pokemon-search>.block');
        this.validPokemon = [];
        this.pokemonList = []
        for(let i=1;i<=config.maxSelectedId;i++){
            this.validPokemon[i] = true;
            this.pokemonList.push(i)
        }
    }
    async getData(){
        return new Promise(async (resolve, reject)=>{
            const data = await API.getLists()
            this.nameList =     getPokemonFromList(data[0].results);
            this.abilityList =  getPokemonFromList(data[1].results);
            this.moveList =     getPokemonFromList(data[2].results);
            this.typeList =     getPokemonFromList(data[3].results);
            this.genList = generationsBoundries;
            resolve({name:this.nameList, ability:this.abilityList, move:this.moveList, type:this.typeList})
        })
    }
    async filter(){
        const div = this.div;
        const genFilter = $("#gen-search>option:selected").index()
        const filteredInputs = []
        let filteredPerName = []
        div.find('input').each((i, el)=>{
            let id  = $(el).prop('id')
            let val = $(el).val()
            if(!val.length) return;
            let searchById = !isNaN(parseInt(val))
            let type= id.split('-')[0];
            let listToFilter = this[type+"List"]

            let found = listToFilter.filter(el=>{
                if(searchById)
                    return el.id == val
                return new RegExp(val.toLowerCase()).test((el.name).toLowerCase())
            })
            switch(type){
                case "name":
                    return filteredPerName = found.map(el=>el.id)
                case "ability":
                case "move":
                    return filteredInputs[type] = found.map(el=>el.id);
                case "type":
                    return filteredInputs[type+id[id.length-1]] = found.map(el=>el.id);
            }
        })
        if(!Object.keys(filteredInputs).length && !filteredPerName.length) return [...Array(config.maxSelectedId)].map((n,i)=>i+1);
        const promises = []
        if(filteredInputs.type1)    promises.push(Promise.all(filteredInputs.type1.map(id=>API.getPokemonType(id))))
        else promises.push([])
        if(filteredInputs.type2)    promises.push(Promise.all(filteredInputs.type2.map(id=>API.getPokemonType(id))))
        else promises.push([])
        if(filteredInputs.ability)  promises.push(Promise.all(filteredInputs.ability.map(id=>API.getPokemonAbility(id))))
        else promises.push([])
        if(filteredInputs.move)     promises.push(Promise.all(filteredInputs.move.map(id=>API.getPokemonMove(id))))
        else promises.push([])
        return Promise.all(promises).then(res=>this.getValid(filteredPerName, res, genFilter))
    }
    getValid(names, data, gen){
        let idsLists = data.map((list, index)=>{
            let prop = "pokemon"
            switch(index){
                case 0: prop+="Primary";break;
                case 1: prop+="Secondary";break;
            }
            return this.extractIds(list, prop);
        })
        if(names) idsLists.push(names.map(el=>parseInt(el)))
        idsLists = idsLists.filter(list=>list.length)
        const common = idsLists[0].filter(element =>idsLists.every(array => array.includes(element)));
        const res = common.filter(el=>el>=this.genList[gen].min && el<=this.genList[gen].max)
        this.validPokemon = this.validPokemon.map((el, i)=>res.includes(i))
        this.pokemonList = this.validPokemon.reduce((arr, el, i)=>{
            if(el) arr.push(i)
            return arr
        }, [])
        return this.pokemonList;
    }
    extractIds(data, prop){
        return Array.from(new Set([].concat(...data.map(item=>item[prop].map(poke=>parseInt(poke.id)))))).sort((a, b)=>a-b)
    }
}

const generationsBoundries = [
    {min:0, max:650},
    {min:1, max:151},
    {min:152, max:251},
    {min:252, max:386},
    {min:387, max:493},
    {min:494, max:649}
]