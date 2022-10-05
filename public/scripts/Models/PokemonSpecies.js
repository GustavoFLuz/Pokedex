export default class PokemonSpecies{
    constructor({color, flavor_text_entries, generation, genera, form_descriptions}){
        this.color = color?.name;
        this.entry = handleEntries(flavor_text_entries);
        this.gen = parseInt(generation.url.split('/')[generation.url.split('/').length-2])
        this.desc = genera.find(i=>i.language.name == 'en').genus;
        this.hasForms = form_descriptions.length>0;
    }
}
function handleEntries(entries){
    return entries
        .filter(entry=>entry.language.name == 'en')
        .filter(entry=>['black', 'white', 'black 2', 'white 2'].includes(entry.version.name))
        .map(entry=>entry.flavor_text)[0]
        //.replaceAll('\n', ' ')
}