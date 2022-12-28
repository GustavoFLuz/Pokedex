import { handleName, getPokemonFromList } from "../Helper/helper.js"
export default class Type{
    constructor(data){
        this.name = null;
        this.process(data);
    }
    process(type){
        const handleVariable = (array, name, bonus)=>{
            array[handleName(name)] = bonus;
        }
        let rel = type.damage_relations;
        let name = handleName(type.name)
        this.damageDeal = [];
        rel.double_damage_to    .forEach(type=>handleVariable(this.damageDeal, type.name, 2));
        rel.half_damage_to      .forEach(type=>handleVariable(this.damageDeal, type.name, 0.5));
        rel.no_damage_to        .forEach(type=>handleVariable(this.damageDeal, type.name, 0));
        this.damageReceive = [];
        rel.double_damage_from  .forEach(type=>handleVariable(this.damageReceive, type.name, 2));
        rel.half_damage_from    .forEach(type=>handleVariable(this.damageReceive, type.name, 0.5));
        rel.no_damage_from      .forEach(type=>handleVariable(this.damageReceive, type.name, 0));
        this.pokemonPrimary = getPokemonFromList(type.pokemon.filter(el=>el.slot==1).map(el=>el.pokemon))
        this.pokemonSecondary = getPokemonFromList(type.pokemon.filter(el=>el.slot==2).map(el=>el.pokemon))
        this.name = name;
        this.color= Type.getColor(name)
    }
    static getColor(name){
        return {
            Normal:     "#AAAA99",
            Fighting:   "#BB5544",
            Flying:     "#8899FF",
            Poison:     "#AA5599",
            Ground:     "#DDBB55",
            Rock:       "#BBAA66",
            Bug:        "#AABB22",
            Ghost:      "#6666BB",
            Steel:      "#AAAABB",
            Fire:       "#FF4422",
            Water:      "#3399FF",
            Grass:      "#77CC55",
            Electric:   "#FFCC33",
            Psychic:    "#FF5599",
            Ice:        "#77CC55",
            Dragon:     "#7766EE",
            Dark:       "#775544",
            Fairy:      "#EE99AC"
        }[name]
    }
}