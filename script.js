function initializeDOM(parentElementID) {
    window[parentElementID] = document.querySelector('#'+parentElementID)
    Array.from(window[parentElementID].children).forEach(element => {
        if (element.id) {initializeDOM(element.id)}        
    });
}
initializeDOM('main')

function isInside(l,pair) {
    if (pair[0]>=0 && pair[0]<l && pair[1]>=0 && pair[1]<l) {
        return true
    } else return false
}

let mapTable = []
let context = map.getContext('2d')
let player = []

genMapBtn.addEventListener('click',()=>{

    // gen an empty canvas
    map.style.border = "1px solid black"
    map.style.width = mapSize.value*16 + "px"
    map.style.height = mapSize.value*16 + "px"
    map.width = mapSize.value
    map.height = mapSize.value

    // gen area colors and sizes and other properties
    for(let i=0;i<=+nOfAreas.value;i++){
        player[i]={}
        player[i].color="rgb("+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+")"
        player[i].size=1
    }
    player[0].size=mapSize.value*mapSize.value-(+nOfAreas.value)

    // populate a neutral map table and map canvas
    for(let i=0;i<mapSize.value;i++){
        mapTable[i]=[]
        for(let j=0;j<mapSize.value;j++){
            mapTable[i][j]=0
        }
    }
    context = map.getContext('2d')
    context.rect(0, 0, mapSize.value, mapSize.value)
    context.fillStyle = player[0].color
    context.fill()

    // place capitols
    for(let i=1;i<player.length;i++){
        let taken = false
        let xy=[]
        do {
            xy = [Math.floor(Math.random()*mapSize.value),Math.floor(Math.random()*mapSize.value)]
            for(let j=1;j<i;j++){if (player[j].capitol==xy) {taken=true}}
        } while (taken==true)
        player[i].capitol = [xy[0],xy[1]]
        mapTable[xy[0]][xy[1]]=i
        context.fillStyle = player[i].color
        context.fillRect(player[i].capitol[0],player[i].capitol[1],1,1)
    }

    // generate borders
    for(let i=0;i<player.length;i++){
        player[i].border = []
        for(let j=0;j<player.length;j++) {
            player[i].border[j]={away:new Set(),home:new Set(),troops:0}    
        }
    }

    // fill in the borders for neutral
    for(let i=1;i<player.length;i++) {
        player[0].border[i].away.add(player[i].capitol.toString())
        let newLand = player[i].capitol
        if (isInside(mapTable.length,[newLand[0],newLand[1]-1])){
            if (mapTable[newLand[0]][newLand[1]-1]===0) {
                player[0].border[i].home.add([newLand[0],newLand[1]-1].toString())
            }
        }
        if (isInside(mapTable.length,[newLand[0],newLand[1]+1])){
            if (mapTable[newLand[0]][newLand[1]+1]===0) {
                player[0].border[i].home.add([newLand[0],newLand[1]+1].toString())
            } 
        }
        if (isInside(mapTable.length,[newLand[0]-1,newLand[1]])){
            if (mapTable[newLand[0]-1][newLand[1]]===0) {
                player[0].border[i].home.add([newLand[0]-1,newLand[1]].toString())
            }
        }
        if (isInside(mapTable.length,[newLand[0]+1,newLand[1]])){
            if (mapTable[newLand[0]+1][newLand[1]]===0) {
                player[0].border[i].home.add([newLand[0]+1,newLand[1]].toString())
            } 
        }
    }

    // fill in the borders for players
    for(let i=1;i<player.length;i++){
        let newLand = player[i].capitol
        let neighbor = 0
        if (isInside(mapTable.length,[newLand[0],newLand[1]-1])){
            neighbor = mapTable[newLand[0]][newLand[1]-1]
            player[i].border[neighbor].away.add([newLand[0],newLand[1]-1].toString())
            player[i].border[neighbor].home.add([newLand[0],newLand[1]].toString())
        }
        if (isInside(mapTable.length,[newLand[0],newLand[1]+1])){
            neighbor = mapTable[newLand[0]][newLand[1]+1]
            player[i].border[neighbor].away.add([newLand[0],newLand[1]+1].toString())
            player[i].border[neighbor].home.add([newLand[0],newLand[1]].toString())
        }
        if (isInside(mapTable.length,[newLand[0]-1,newLand[1]])){
            neighbor = mapTable[newLand[0]-1][newLand[1]]
            player[i].border[neighbor].away.add([newLand[0]-1,newLand[1]].toString())
            player[i].border[neighbor].home.add([newLand[0],newLand[1]].toString())
        }
        if (isInside(mapTable.length,[newLand[0]+1,newLand[1]])){
            neighbor = mapTable[newLand[0]+1][newLand[1]]
            player[i].border[neighbor].away.add([newLand[0]+1,newLand[1]].toString())
            player[i].border[neighbor].home.add([newLand[0],newLand[1]].toString())
        }
    }

    // simulate an attack from a chosen player that takes a pixel from a chosen enemy

})