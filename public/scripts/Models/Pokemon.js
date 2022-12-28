import { handleName, getIdFromUrl } from "../Helper/helper.js";
import PokemonController from "../Controller/PokemonController.js";
import Stats from "./Stats.js";
export default class Pokemon {
    constructor({ name, id, stats, height, weight, sprites, types, moves }, species, abilitiesObj, movesFromPromises) {
        this.id = id;
        this.name = handleName(name);
        this.abilities = handleAbilities(abilitiesObj, this.id);
        this.stats = new Stats(handleStats(stats));
        this.moves = handleMoves(moves,movesFromPromises);
        this.height = height;
        this.weight = weight;
        this.sprite = {
            main: sprites.other.dream_world.front_default,
            default: sprites.front_default
        };
        this.types = types.map(type => handleName(type.type.name))
        this.speciesData = species;
        if (this.speciesData.hasForms) this.name = this.name.split(' ')[0]
    }
}
function handleStats(stats) {
    return stats.reduce((obj, st) => { obj[st.stat.name] = st.base_stat; return obj }, {})
}
function handleAbilities(abilitiesObj, id) {
    return abilitiesObj.map(ability => {
        return {
            name: ability.name,
            effect: ability.effect,
            is_hidden: ability.pokemon.find(pair => pair.id == id).hidden
        }
    })
}

function handleMoves(data, promiseResults) {
    const filteredData = data.filter(move => move.version_group_details.find(version => version.version_group.name == "black-white"))
    const moves = filteredData.map((unformatedMove, index) => {
        const move = promiseResults[index]
        let versionConfig = unformatedMove.version_group_details.find(version => version.version_group.name == "black-white")
        move.method = versionConfig.move_learn_method.name;
        move.level = versionConfig.level_learned_at;
        return move;
    })
    const sortedMoves = moves.filter(move=>move.method=="level-up").sort((a, b)=>a.level-b.level).concat(
        moves.filter(move=>move.method=="machine"),
        moves.filter(move=>move.method=="egg"),
        moves.filter(move=>move.method=="tutor")
        )
    return sortedMoves;
}
