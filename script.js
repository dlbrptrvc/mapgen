function initializeDOM(parentElementID) {
    window[parentElementID] = document.querySelector('#'+parentElementID)
    Array.from(window[parentElementID].children).forEach(element => {
        if (element.id) {initializeDOM(element.id)}        
    });
}
initializeDOM('main')

generateMap.addEventListener('click',()=>{
    map.style.border = "1px solid black"
    map.style.width = mapSize.value+"px"
    map.style.height = mapSize.value+"px"
    map.width = map.style.width
    map.height = map.style.height

})