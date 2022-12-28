import API from "../Api/API.js";
import PokemonController from "../Controller/PokemonController.js";
export default class PannelInfo {
    constructor(contentDiv) {
        this.infoDiv = contentDiv.find('#pokemon-info');
        this.nature = null;
        this.pokemon = null;
        this.init();
    }
    setPokemon(pokemon) {
        this.pokemon = pokemon;
        return new Promise(async (resolve, reject) => {
            resolve(this.renderInfo(this.pokemon))
        })
    }

    setNature(nature) {
        return API.getPokemonNature(nature)
            .then(nat => this.nature = nat)
    }

    init() {
        let infoDiv = this.infoDiv;
        this.setNature('hardy')
        infoDiv.find('.pokemon-desc').click(event => {
            if (!$(event.target).hasClass('pokemon-desc'))
                $(event.target).parents('.pokemon-desc').toggleClass('active')
            else $(event.target).toggleClass('active')
        })

        infoDiv.find('.abilities-selection').append($(`
            <button id="selectAbility1" class="active"></button>
            <button id="selectAbility2"></button>
            <button id="selectAbility3"></button>
        `))

        infoDiv.find('.abilities-info ul').append('<li></li><li></li><li></li>')
        $('.abilities-selection button').click(event => {
            infoDiv.find('.abilities-selection>button').removeClass('active');
            infoDiv.find(`.abilities-selection>button:nth-child(${event.target.id.slice(-1)})`).addClass('active');

            infoDiv.find(`.abilities-info ul`)
                .removeClass("selectedAbility1 selectedAbility2 selectedAbility3")
                .addClass("selectedAbility" + event.target.id.slice(-1))
        });
        API.getPokemonNatures().then(natures => Object.keys(natures).sort().forEach(key => {
            infoDiv.find('.select-nature').append($(`<option value="${natures[key].name}">${natures[key].name}</option>`))
        }))
        $('#level-range').on("input", (event) => { infoDiv.find('.level-show').text("Level " + event.target.value); this.setStats() })
        $('.select-nature').change((ev) => { this.setNature(ev.target.value).then(() => this.setStats()) })

        $('input[class^="ev_"]').on('input', (ev) => { this.validateEVs(ev); this.setStats() })
        $('input[class^="iv_"]').on('input', (ev) => { this.validateIVs(ev); this.setStats() })
    }
    renderInfo(pokemon) {
        let infoDiv = this.infoDiv;
        $('.block')[0].scrollTo()
        clearInterval(this.descriptionChangingInterval)

        //Header
        infoDiv.find('.pokemon-sprite').attr('src', pokemon.sprite.default)
        infoDiv.find('.pokemon-sprite').attr('style', `filter:drop-shadow(0 0 15px ${pokemon.speciesData.color});`)
        infoDiv.find('.pokemon-name').text(`${pokemon.name} #${pokemon.id.toString().padStart(3, '0')}`)

        //Description
        infoDiv.find('.pokemon-desc .title').text(pokemon.speciesData.desc)
        infoDiv.find('.pokemon-desc .desc').text(pokemon.speciesData.entry)

        //Abilities
        infoDiv.find('.pokemon-abilities .abilities-selection input').hide();
        infoDiv.find('.pokemon-abilities .abilities-selection button').removeClass('active')
        infoDiv.find('.pokemon-abilities .abilities-selection button:nth-child(1)').addClass('active')
        infoDiv.find('.pokemon-abilities .abilities-selection button').hide();
        infoDiv.find('.pokemon-abilities .abilities-info ul li').text('');
        this.pokemon.abilities.forEach((ability, index) => {
            infoDiv.find(`.pokemon-abilities .abilities-selection input:nth-child(${index})`).show();
            infoDiv.find(`.pokemon-abilities .abilities-selection button:nth-child(${index + 1})`).show()
                .text(ability.name);

            infoDiv.find(`.pokemon-abilities .abilities-info ul li:nth-child(${index + 1})`).text(ability.effect)
        })
        infoDiv.find(`.abilities-info ul`)
            .removeClass("selectedAbility1 selectedAbility2 selectedAbility3")
            .addClass("selectedAbility1")

        //Stats
        this.setStats();

        //Types
        API.getPokemonTypes().then((arr) => {
            infoDiv.find('.pokemon-types').html('')
            pokemon.types.forEach(type => {
                let typeData = arr[type];
                infoDiv.find('.pokemon-types').append(`<div class="${pokemon.types.length > 1 ? 'double' : 'single'}"style="background-color: ${typeData.color}">${typeData.name}</div>`)
            })
        })

        //Moves
        $("#pokemon-moves ul li").remove();
        pokemon.moves.forEach(move=>{
            let imageSrc = ""
            switch(move.method){
                case "machine": imageSrc = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-"+move.type.name.toLowerCase()+".png";break;
                case "egg": imageSrc = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mystery-egg.png";break;
                case "level-up": imageSrc = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/rare-candy.png";break;
                case "tutor": imageSrc = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/rsvp-mail.png";break;
            }
            $("#pokemon-moves ul").append(`<li style="background:${move.type.color};"><img src="${imageSrc}"><div class="level">${move.level?"Lv "+move.level:''}</div><div class="name">${move.name}</div></li>`)
        })

    }
    setStats() {
        let infoDiv = this.infoDiv;
        const level = parseInt($('#level-range').val());
        const stats = this.pokemon.stats.getStats(this.nature, level, this.getEVs(), this.getIVs())
        stats.forEach(stat => {
            infoDiv.find('.stats-sliders #stat_' + stat.name).val(stat.value)
            infoDiv.find('.stats-sliders #stat_' + stat.name).parent('div').find('.value').text(parseInt(stat.value))
        })

    }
    validateEVs(event) {
        let target = $(event.target);
        let elementClass = event.target.classList[0];
        let value = parseInt(target.val())

        let sum = $('input[class^="ev_"]:not(.' + elementClass + ')').toArray().reduce((total, el) => total += parseInt($(el).val()), 0)
        if (sum + value > 510) target.val(510 - sum);
        if (value > 255) target.val(255)
    }
    getEVs() {
        return {
            'hp': parseInt($('input[class=ev_hp]').val()),
            'attack': parseInt($('input[class=ev_attack]').val()),
            'defense': parseInt($('input[class=ev_defense]').val()),
            'special-attack': parseInt($('input[class=ev_special-attack]').val()),
            'special-defense': parseInt($('input[class=ev_special-defense]').val()),
            'speed': parseInt($('input[class=ev_speed]').val()),
        }
    }
    validateIVs(event) {
        let target = $(event.target);
        let value = parseInt(target.val())
        if (value > 31) target.val(31)
    }
    getIVs() {
        return {
            'hp': parseInt($('input[class=iv_hp]').val()),
            'attack': parseInt($('input[class=iv_attack]').val()),
            'defense': parseInt($('input[class=iv_defense]').val()),
            'special-attack': parseInt($('input[class=iv_special-attack]').val()),
            'special-defense': parseInt($('input[class=iv_special-defense]').val()),
            'speed': parseInt($('input[class=iv_speed]').val()),
        }
    }
}