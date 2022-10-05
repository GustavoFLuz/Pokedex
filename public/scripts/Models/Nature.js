import { handleName } from "../Helper/helper.js"

export default class Nature{
    constructor({name, decreased_stat, increased_stat}){
        this.name = handleName(name)
        this["attack"] = 1;
        this["defense"] = 1;
        this["special-attack"] = 1;
        this["special-defense"] = 1;
        this["speed"] = 1;

        if(decreased_stat)
            this[decreased_stat.name] = 0.9;
        if(increased_stat)
            this[increased_stat.name] = 1.1;
    }
}