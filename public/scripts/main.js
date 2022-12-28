import PokedexController from './Controller/PokedexController.js';
import PokemonController from './Controller/PokemonController.js';
import API from './Api/API.js';
import "./config.js"
class Main {
    constructor() {
        console.time("Controller Loading");
        this.api = API;
        this.pokemonController = PokemonController;
        Promise.all([-1, -1, 1, 2, 3].map(id => this.api.getPokemon(id)))
        .then(data=>{
                console.timeEnd("Controller Loading");
                this.pokedex = new PokedexController(data)
            })
        .then(()=>this.addEvents())
    }

    addEvents() {
        //filter data
        this.pokedex.filterController.getData().then(data =>
            $('#pokemon-search>.block input').on("input", (ev) => {
                const typed = ev.target.value.toLowerCase();
                const filter = $(ev.target).prop("id").split("-")[0]
                const res = data[filter].filter(el => new RegExp(typed).test((el.name).toLowerCase()))
                $(`#pokemon-search>.block #${filter}List option`).remove()
                for (let n of res) {
                    $(`#pokemon-search>.block #${filter}List`).append(`<option value="${n.name}" data-id="${n.id}"></option>`)
                }
            })
        )

        //search button
        $(".search-button>button").on("click", ()=>{
            this.pokedex.filterController.filter().then(res=>{
                this.pokemonController.update(res);
                this.pokedex.update(res);
            })
        });
    }

    get selectedIndex(){
        return this.pokemonController.getSelectedIndex();
    }

    set selectedId(id){
        this.pokemonController.selectedId = parseInt(id);
        if(this.pokedex)
            this.pokedex.update()
    }
    get selectedId(){
        return this.pokemonController.selectedId;
    }
}

const main = new Main();
export default main;
