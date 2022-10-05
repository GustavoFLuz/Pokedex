import PokemonController from "../Controller/PokemonController.js";

export default class Stats{
    constructor(basestats){
        this['hp']=                 basestats['hp'];
        this['attack']=             basestats['attack'];
        this['defense']=            basestats['defense'];
        this['special-attack'] =    basestats['special-attack'];
        this['special-defense'] =   basestats['special-defense'];
        this['speed'] =             basestats['speed'];
    }
    getStats(nature, level, evs, ivs){
        let natureObj = PokemonController.natures[nature]
        return [
            {name:'hp',value:               this.getHP  ('hp',             level,            evs['hp'],             ivs['hp'])},
            {name:'attack',value:           this.getStat('attack',         natureObj, level, evs['attack'],         ivs['attack'])},
            {name:'defense',value:          this.getStat('defense',        natureObj, level, evs['defense'],        ivs['defense'])},
            {name:'special-attack',value:   this.getStat('special-attack', natureObj, level, evs['special-attack'], ivs['special-attack'])},
            {name:'special-defense',value:  this.getStat('special-defense',natureObj, level, evs['special-defense'],ivs['special-defense'])},
            {name:'speed',value:            this.getStat('speed',          natureObj, level, evs['speed'],          ivs['speed'])},
        ]
    }
    getHP(stat, level, ev, iv){
        if(isNaN(ev)) ev=0;
        if(isNaN(iv)) iv=0;
        return ((((2*this[stat])+iv+Math.floor(ev/4))*level)/100 + level + 10)
    }
    getStat(stat, nature, level, ev, iv){
        if(isNaN(ev)) ev=0;
        if(isNaN(iv)) iv=0;
        return Math.ceil((((((2*this[stat])+iv+Math.floor(ev/4))*level)/100)+5) * nature[stat])
    }
}