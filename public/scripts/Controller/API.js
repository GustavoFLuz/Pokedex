export default class API{
    static async getPokemon(id){
        return new Promise(function (resolve, reject) {
            $.get('https://pokeapi.co/api/v2/pokemon/'+id, (data)=>resolve(data))
        });
    }
    static async getPokemonSpecies(id){
        return new Promise(function (resolve, reject) {
            $.get('https://pokeapi.co/api/v2/pokemon-species/'+id, (data)=>resolve(data))
        });
    }
    static async getTypes(){
        return new Promise(function (resolve, reject) {
            $.get('https://pokeapi.co/api/v2/type/?limit=18', (data)=>resolve(data))
        });
    }
    static async getTypesInfo(name){
        return new Promise(function (resolve, reject) {
            $.get('https://pokeapi.co/api/v2/type/'+name, (data)=>resolve(data))
        });
    }
    static async getAbility(name){
        return new Promise(function (resolve, reject) {
            $.get('https://pokeapi.co/api/v2/ability/'+name, (data)=>resolve(data))
        });
    }
    
    static async getNatures(){
        return new Promise(function (resolve, reject) {
            $.get('https://pokeapi.co/api/v2/nature/', (data)=>resolve(data))
        });
    }
    static async getNaturesInfo(name){
        return new Promise(function (resolve, reject) {
            $.get('https://pokeapi.co/api/v2/nature/'+name, (data)=>resolve(data))
        });
    }
}