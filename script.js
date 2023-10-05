function initializeDOM(parentElementID) {
    window[parentElementID] = document.querySelector('#'+parentElementID)
    Array.from(window[parentElementID].children).forEach(element => {
        if (element.id) {initializeDOM(element.id)}        
    });
}
initializeDOM('main')
let mapTable = []
let context = map.getContext('2d')
let playerList = []
let neutral = {color:'lightGray',size:0}

genMapBtn.addEventListener('click',()=>{

    // gen an empty canvas
    map.style.border = "1px solid black"
    map.style.width = mapSize.value*4 + "px"
    map.style.height = mapSize.value*4 + "px"
    map.width = mapSize.value
    map.height = mapSize.value

    // gen area colors and sizes and other properties
    for(let i=0;i<+nOfAreas.value;i++){
        playerList[i]={}
        playerList[i].color="rgb("+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+")"
        playerList[i].size=0
        playerList[i].capitol = 'none'
    }

    // populate a neutral map table and map canvas
    neutral.size = mapSize.value*mapSize.value
    for(let i=0;i<mapSize.value;i++){
        mapTable[i]=[]
        for(let j=0;j<mapSize.value;j++){
            mapTable[i][j]='neutral'
        }
    }
    context = map.getContext('2d')
    context.rect(0, 0, mapSize.value, mapSize.value)
    context.fillStyle = 'lightGray'
    context.fill()

    // place capitols
    for(let i=0;i<playerList.length;i++){
        let taken = false
        let xy=[]
        playerList.capitol = []
        do {
            xy = [Math.floor(Math.random()*mapSize.value),Math.floor(Math.random()*mapSize.value)]
            for(let j=0;j<i;j++){if (playerList[j].capitol==xy) {taken=true}}
        } while (taken==true)
        playerList[i].capitol = xy
        mapTable[xy[0],xy[1]]=i
        context.fillStyle = playerList[i].color
        context.fillRect(playerList[i].capitol[0],playerList[i].capitol[1],1,1)
    }

})