import PokemonController from "../Controller/PokemonController.js";

export class Pannel {
    constructor() {
        this.display = $('#secondary-display')
        this.selector = $('#tab-selector');
        this.slider = this.selector.find('#slider');
        this.content = this.display.find('.content');
        
        this.changingAnimation = true;
        this.transitionTime = 1000;

        this.pokemon = null;
        this.init();
    }
    init() {
        this.slider.addClass('dislocate1');
        this.selector
        setTimeout(() => {
            this.changingAnimation = false;
        }, this.transitionTime)
        this.initInfo();
    }
    dislocate(event) {
        if (this.changingAnimation) return false;
        let li = $(event.target)
        if (li[0].nodeName != "LI") li = li.parents('li')
        this.slider.attr('class', 'dislocate' + li.index());
        this.switchDisplay(li.index())
        return li.index();
    }
    switchDisplay(index) {
        this.changingAnimation = true;
        this.content.find('.active').toggleClass('active hiding')
        setTimeout(() => {
            this.content.find(`div`).removeClass('hiding')
            this.content.find(`div:nth-child(${index})`).toggleClass('active');
            setTimeout(() => {
                this.changingAnimation = false;
            }, this.transitionTime)
        }, this.transitionTime)
    }


    enableLoading(enable){
        if(enable){
            this.display.find('.content>div').append('<div class="loading-secondary-display"></div>');
            return;
        }
        this.content.find('.loading-secondary-display').remove();
    }
    initInfo(){
        let infoDiv = this.content.find('#pokemon-info');

        infoDiv.find('.pokemon-desc').click(event=>{
            if(!$(event.target).hasClass('pokemon-desc')) 
                $(event.target).parents('.pokemon-desc').toggleClass('active')
            else $(event.target).toggleClass('active')
        })

        infoDiv.find('.abilities-selection').append($(`
            <button id="selectAbility1" class="active"></button>
            <button id="selectAbility2"></button>
            <button id="selectAbility3"></button>
        `))

        infoDiv.find('.abilities-info ul').append('<li></li><li></li><li></li>')
        $('.abilities-selection button').click(event=>{
            infoDiv.find('.abilities-selection>button').removeClass('active');
            infoDiv.find(`.abilities-selection>button:nth-child(${event.target.id.slice(-1)})`).addClass('active');

            infoDiv.find(`.abilities-info ul`)
                .removeClass("selectedAbility1 selectedAbility2 selectedAbility3")
                .addClass("selectedAbility"+event.target.id.slice(-1))
        });
        Object.keys(PokemonController.natures).forEach(nature=>{
            infoDiv.find('.select-nature').append($(`<option value="${nature}">${nature}</option>`))
        })
        $('#level-range').on("input",(event)=>{infoDiv.find('.level-show').text("Level " + event.target.value);this.setStats()})
        $('.select-nature').change(()=>this.setStats())

        $('input[class^="ev_"]').on('input', (ev)=>{this.validateEVs(ev);this.setStats()})
        $('input[class^="iv_"]').on('input', (ev)=>{this.validateIVs(ev);this.setStats()})
    }
    renderInfo(pokemon){
        this.pokemon = pokemon;

        $('.block')[0].scrollTo()
        clearInterval(this.descriptionChangingInterval)
        let infoDiv = this.content.find('#pokemon-info')
        infoDiv.find('.pokemon-sprite').attr('src', this.pokemon.sprite.default)
        infoDiv.find('.pokemon-sprite').attr('style', `filter:drop-shadow(0 0 15px ${this.pokemon.speciesData.color});`)
        infoDiv.find('.pokemon-name').text(`${this.pokemon.name} #${this.pokemon.id.toString().padStart(3, '0')}`)

        infoDiv.find('.pokemon-types').html('')
        this.pokemon.types.forEach(type=>{
            let typeData = PokemonController.types[type];
            infoDiv.find('.pokemon-types').append(`<div class="${this.pokemon.types.length>1?'double':'single'}"style="background-color: ${typeData.color}">${type}</div>`)
        })
        infoDiv.find('.pokemon-desc .title').text(this.pokemon.speciesData.desc)
        infoDiv.find('.pokemon-desc .desc').text(this.pokemon.speciesData.entry)

        infoDiv.find('.pokemon-abilities .abilities-selection input').hide();
        infoDiv.find('.pokemon-abilities .abilities-selection button').removeClass('active')
        infoDiv.find('.pokemon-abilities .abilities-selection button:nth-child(1)').addClass('active')
        infoDiv.find('.pokemon-abilities .abilities-selection button').hide();
        infoDiv.find('.pokemon-abilities .abilities-info ul li').text('');
        this.pokemon.abilities.forEach((ability, index)=>{
            infoDiv.find(`.pokemon-abilities .abilities-selection input:nth-child(${index})`)  .show();
            infoDiv.find(`.pokemon-abilities .abilities-selection button:nth-child(${index+1})`).show()
                .text(ability.name);
                
            infoDiv.find(`.pokemon-abilities .abilities-info ul li:nth-child(${index+1})`).text(ability.effect)
        })
        infoDiv.find(`.abilities-info ul`)
            .removeClass("selectedAbility1 selectedAbility2 selectedAbility3")
            .addClass("selectedAbility1")

        this.setStats();
    }
    setStats(){
        let infoDiv = this.content.find('#pokemon-info')
        const level = parseInt($('#level-range').val());
        const nature= $('.select-nature').val();
        const stats = this.pokemon.stats.getStats(nature, level, this.getEVs(), this.getIVs());
        stats.forEach(stat=>{
            infoDiv.find('.stats-sliders #stat_'+stat.name).val(stat.value)
            infoDiv.find('.stats-sliders #stat_'+stat.name).parent('div').find('.value').text(parseInt(stat.value))
        })
    }
    validateEVs(event){
       let target = $(event.target);
       let elementClass = event.target.classList[0];
       let value = parseInt(target.val())
       
       let sum = $('input[class^="ev_"]:not(.'+elementClass+')').toArray().reduce((total, el)=>total+=parseInt($(el).val()), 0)
       if(sum+value>510) target.val(510-sum);
       if(value>255) target.val(255)
    }
    getEVs(){
        return {
            'hp':               parseInt($('input[class=ev_hp]').val()),             
            'attack':           parseInt($('input[class=ev_attack]').val()),         
            'defense':          parseInt($('input[class=ev_defense]').val()),        
            'special-attack':   parseInt($('input[class=ev_special-attack]').val()), 
            'special-defense':  parseInt($('input[class=ev_special-defense]').val()),
            'speed':            parseInt($('input[class=ev_speed]').val()),          
        }
    }
    validateIVs(event){
        let target = $(event.target);
        let value = parseInt(target.val())
        if(value>31) target.val(31)
    }
    getIVs(){
        return {
            'hp':               parseInt($('input[class=iv_hp]').val()),             
            'attack':           parseInt($('input[class=iv_attack]').val()),         
            'defense':          parseInt($('input[class=iv_defense]').val()),        
            'special-attack':   parseInt($('input[class=iv_special-attack]').val()), 
            'special-defense':  parseInt($('input[class=iv_special-defense]').val()),
            'speed':            parseInt($('input[class=iv_speed]').val()),          
        }
    }
    renderSearch(){

    }
    renderList(){

    }
}