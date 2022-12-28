import config from "../config.js"
export function handleName(string) {
    return string.split(' ')[0].split(/[-]+/).map((part)=>{
        return part.charAt(0).toUpperCase()+ part.slice(1)
    }).join(' ')
}
export function inRangeId(id, dist){
    id = parseInt(id)
    if(dist!=null){
        return (id+dist>=config.minSelectedId && id+dist<=config.maxSelectedId)
    }
    var range =[];
    for(let i=-2;i<=2;i++){
        if(id+i>=config.minSelectedId && id+i<=config.maxSelectedId) range.push(id+i);
        else range.push(-1)
    }
    return range;
}

export function getPokemonFromList(list){
    return list.map(el=>{return {id:getIdFromUrl(el.url), name:handleName(el.name)}}).filter(el=>(el.id>=config.minSelectedId && el.id<=config.maxSelectedId))
}

export function getIdFromUrl(url){
    return url.split('/').slice(-2)[0];
}

export const emptyImage = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='