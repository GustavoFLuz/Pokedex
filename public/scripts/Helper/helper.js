export function handleName(string) {
    return string.split(' ')[0].split(/[-]+/).map((part)=>{
        return part.charAt(0).toUpperCase()+ part.slice(1)
    }).join(' ')
}
export const minSelectedId = 1;
export const maxSelectedId = 649;
export function inRangeId(id, dist){
    id = parseInt(id)
    if(dist!=null){
        return (id+dist>=minSelectedId && id+dist<=maxSelectedId)
    }
    var range =[];
    for(let i=-2;i<=2;i++){
        if(id+i>=minSelectedId && id+i<=maxSelectedId) range.push(id+i);
        else range.push(-1)
    }
    return range;
}

export function getPokemonFromList(list){
    return list.map(poke=>poke.pokemon.url.split('/').slice(-2)[0]).filter(id=>(id>=minSelectedId && id<=maxSelectedId))
}

export function getIdFromUrl(url){
    return url.split('/').slice(-2)[0];
}

export const emptyImage = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='