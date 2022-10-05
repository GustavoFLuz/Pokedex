import { handleName } from "../Helper/helper.js";
import Stats from "./Stats.js";
export default class Pokemon {
    constructor({ name,  id, stats, moves, height, weight, sprites, types}, species, abilitiesObj) {
        this.id = id;
        this.name =         handleName(name);
        this.abilities =    handleAbilities(abilitiesObj, this.id);
        this.stats =        new Stats(handleStats(stats));
        this.moves =        handleMoves(moves);
        this.height =       height;
        this.weight =       weight;
        this.sprite =       {main: sprites.other.dream_world.front_default,
                            default:sprites.front_default};
        this.types =        types.map(type=>handleName(type.type.name))
        this.speciesData =  species;
        if(this.speciesData.hasForms) this.name = this.name.split(' ')[0]
    }
}
function handleStats(stats){
    return stats.reduce((obj, st)=>{obj[st.stat.name] = st.base_stat; return obj}, {})
}
function handleAbilities(abilitiesObj, id){
    return abilitiesObj.map(ability=>{
        return {
            name: ability.name,
            effect: ability.effect,
            is_hidden: ability.pokemon.find(pair=>pair[0]==id)[1]
        }
    })
}
function handleMoves(moves){
    return moves.reduce((obj, move)=>{
        var versionConfig = move.version_group_details.find(version=>version.version_group.name == "black-white")
        if(!versionConfig) return obj;
        var method = versionConfig.move_learn_method.name;
        var level = versionConfig.level_learned_at;
        var moveName = handleName(move.move.name)
        var move = method!='level-up'?moveName:{name:moveName, learned_at:level}
        if(!obj[method]) obj[method] = [];
        obj[method].push(move)
        return obj;
    }, {})
}
