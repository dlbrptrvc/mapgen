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
    }

    // fill in the borders for players
    for(let i=1;i<player.length;i++){
        let newLand = player[i].capitol
        let neighbor = 0
        if (isInside(mapTable.length,[newLand[0],newLand[1]-1])){
            neighbor = mapTable[newLand[0]][newLand[1]-1]
            player[i].border[neighbor].away.add([newLand[0],newLand[1]-1].toString())
        }
        if (isInside(mapTable.length,[newLand[0],newLand[1]+1])){
            neighbor = mapTable[newLand[0]][newLand[1]+1]
            player[i].border[neighbor].away.add([newLand[0],newLand[1]+1].toString())
        }
        if (isInside(mapTable.length,[newLand[0]-1,newLand[1]])){
            neighbor = mapTable[newLand[0]-1][newLand[1]]
            player[i].border[neighbor].away.add([newLand[0]-1,newLand[1]].toString())
        }
        if (isInside(mapTable.length,[newLand[0]+1,newLand[1]])){
            neighbor = mapTable[newLand[0]+1][newLand[1]]
            player[i].border[neighbor].away.add([newLand[0]+1,newLand[1]].toString())
        }
    }

    // simulate an attack from a chosen player that takes a pixel from a chosen enemy

})


function takePixel(w,l) {
// check if there's a pixel to select, if there is none generate new borders
    if (player[w].border[l].away.size==0) {redrawBorder(w,l)}

// check if there is a border to select a pixel from
    if (player[w].border[l].away.size==0 && player[w].border[l].home.size==0){return}

// get the pixel
    let newLand = player[w].border[l].away.values().next().value
    let xy = [+newLand.split(',')[0],+newLand.split(',')[1]]

// if it is the only pixel make sure the borders are in synch
    if (player[w].border[l].home.size==0) {
        player[l].border[w].home = player[w].border[l].away
        player[l].border[w].away = player[w].border[l].home
    }

// change it in mapTable,map,respective borders
    mapTable[xy[0]][xy[1]] = w
    player[w].border[l].home.add(newLand)
    player[w].border[l].away.delete(newLand)
    player[l].border[w].home.delete(newLand)
    player[l].border[w].away.add(newLand)
    context.fillStyle = player[w].color
    context.fillRect(xy[0],xy[1],1,1)

// check if the taken pixel is anyway conected to the area, if not take it of the border
// check surroundings for aditional borders the pixel might be a part of and change their info
    let removal = true
    if (isInside(mapTable.length,[xy[0]+1,xy[1]])) {
        let neighbor=mapTable[xy[0]+1][xy[1]]
        if (neighbor!==l){
            player[neighbor].border[l].away.delete(newLand)
            player[neighbor].border[w].away.add(newLand)
        } else removal=false
    }
    if (isInside(mapTable.length,[xy[0]-1,xy[1]])) {
        let neighbor=mapTable[xy[0]-1][xy[1]]
        if (neighbor!==l){
            player[neighbor].border[l].away.delete(newLand)
            player[neighbor].border[w].away.add(newLand)
        } else removal=false
    }
    if (isInside(mapTable.length,[xy[0],xy[1]-1])) {
        let neighbor=mapTable[xy[0]][xy[1]-1]
        if (neighbor!==l){
            player[neighbor].border[l].away.delete(newLand)
            player[neighbor].border[w].away.add(newLand)
        } else removal=false
    }
    if (isInside(mapTable.length,[xy[0],xy[1]+1])) {
        let neighbor=mapTable[xy[0]][xy[1]+1]
        if (neighbor!==l){
            player[neighbor].border[l].away.delete(newLand)
            player[neighbor].border[w].away.add(newLand)
        } else removal=false
    }
    if (removal) {
        player[w].border[l].home.delete(newLand)
        player[l].border[w].away.delete(newLand)
    }    
}

function redrawBorder(w,l) {
    let newBorder = new Set()
    player[w].border[l].home.forEach(pixel => {
        let xy=[+pixel.split(',')[0],+pixel.split(',')[1]]
        if (isInside(mapTable.length,[xy[0]+1,xy[1]])) {
            // console.log('west',mapTable[xy[0]+1][xy[1]])
            if (mapTable[xy[0]+1][xy[1]]==l) {newBorder.add([xy[0]+1,xy[1]].toString())}
        }
        if (isInside(mapTable.length,[xy[0]-1,xy[1]])) {
            // console.log('east',mapTable[xy[0]-1][xy[1]]);
            if (mapTable[xy[0]-1][xy[1]]==l) {newBorder.add([xy[0]-1,xy[1]].toString())}
        }
        if (isInside(mapTable.length,[xy[0],xy[1]-1])) {
            // console.log('south',mapTable[xy[0]][xy[1]-1])
            if (mapTable[xy[0]][xy[1]-1]==l) {newBorder.add([xy[0],xy[1]-1].toString())}
        }
        if (isInside(mapTable.length,[xy[0],xy[1]+1])) {
            // console.log('north',mapTable[xy[0]][xy[1]+1]);
            if (mapTable[xy[0]][xy[1]+1]==l) {newBorder.add([xy[0],xy[1]+1].toString())}
        }
    })
    // console.log('new border',newBorder)
    player[w].border[l].home.clear()
    player[w].border[l].away = newBorder
    player[l].border[w].home = newBorder
    player[l].border[w].away.clear()
}