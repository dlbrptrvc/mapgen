function initializeDOM(parentElementID) {
    window[parentElementID] = document.querySelector('#'+parentElementID)
    Array.from(window[parentElementID].children).forEach(element => {
        if (element.id) {initializeDOM(element.id)}        
    });
}
initializeDOM('main')

function isInside(pair) {
    let l = mapTable.length
    if (pair[0]>=0 && pair[0]<l && pair[1]>=0 && pair[1]<l) {
        return true
    } else return false
}

function generateCapitols() {
    let capList = []
    for(let i=0;i<nOfAreas.value;i++){
        let taken = false
        do {
            let xy = [Math.floor(Math.random()*mapSize.value),Math.floor(Math.random()*mapSize.value)]
            let capXY = xy.toString()
            if (!capList.includes(capXY)) {capList.push(capXY);taken=false}
            else {taken=true}
        } while (taken==true)
    }
    return capList    
}

let mapTable = []
let context = map.getContext('2d')
let player = []
let capitolList = []
let zoomQ = 2

function neighborList(xy) {
    let list = []
    if (isInside([xy[0],xy[1]+1])) {list.push([[xy[0],xy[1]+1],mapTable[xy[0]][xy[1]+1]])}
    if (isInside([xy[0],xy[1]-1])) {list.push([[xy[0],xy[1]-1],mapTable[xy[0]][xy[1]-1]])}
    if (isInside([xy[0]+1,xy[1]])) {list.push([[xy[0]+1,xy[1]],mapTable[xy[0]+1][xy[1]]])}
    if (isInside([xy[0]-1,xy[1]])) {list.push([[xy[0]-1,xy[1]],mapTable[xy[0]-1][xy[1]]])}
    return list
}

function borders(a,b) {
    if (player[a].border[b].away.size!==0||player[a].border[b].home.size!==0) {
        return true
    } else return false
}

function pixelByPixel() {
    for(let i=1;i<=player[1].desiredSize;i++){
        for(let j=1;j<player.length;j++){
            if (player[j].size<player[j].desiredSize){
                if (borders(j,0)) {
                    takePixel(j,0)
                } else {
                    let path=findPath(0,j)
                    for(let k=0;k<path.length-1;k++) {
                        takePixel(path[k+1],path[k])
                    }
                }
            }
        }
    }
}

function allAtOnce() {
    for(let i=1;i<player.length;i++){
        while (player[i].size<player[i].desiredSize) {
            if (borders(i,0)) {
                takePixel(i,0)
            } else {
                let path=findPath(0,i)
                for(let k=0;k<path.length-1;k++) {
                    takePixel(path[k+1],path[k])
                }            
            }
        }
    }
}

genMapBtn.addEventListener('click',()=>{
    // clear previous
    let start = Date.now()
    document.querySelectorAll('debug').forEach((element)=>{element.remove()})
    console.clear()
    mapTable = []
    player = []

    // gen an empty canvas
    map.style.border = "1px solid black"
    map.style.width = mapSize.value*zoomQ + "px"
    map.style.height = mapSize.value*zoomQ + "px"
    map.width = mapSize.value
    map.height = mapSize.value

    // gen area colors and sizes and other properties
    player = []
    for(let i=0;i<=+nOfAreas.value;i++){
        player[i]={}
        player[i].color="rgb("+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+")"
        player[i].size=1
        player[i].desiredSize=Math.floor(mapSize.value*mapSize.value/nOfAreas.value)
    }
    for(let i=1;i<=mapSize.value*mapSize.value%nOfAreas.value;i++) {
        player[i].desiredSize++
    }
    player[0].desiredSize = 0
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
    if (capitolList.length==0){caps = generateCapitols()}
    else {caps=capitolList}
    for(let i=1;i<player.length;i++){
        player[i].capitol = [+caps[i-1].split(',')[0],+caps[i-1].split(',')[1]]
        mapTable[player[i].capitol[0]][player[i].capitol[1]]=i
        context.fillStyle = player[i].color
        context.fillRect(player[i].capitol[0],player[i].capitol[1],1,1)
    }

    // generate borders
    for(let i=0;i<player.length;i++){
        player[i].border = []
        for(let j=0;j<player.length;j++) {
            player[i].border[j]={away:new Set(),home:new Set(),troops:0}    
        }
        if (i!==0){
            player[i].border[i].home.add(player[i].capitol.toString())
        }
    }

    // fill in the borders for neutral
    for(let i=1;i<player.length;i++) {
        player[0].border[i].away.add(player[i].capitol.toString())
    }

    // fill in the borders for players
    for(let i=1;i<player.length;i++){
        let newLand = player[i].capitol
        let neighbor = 0
        if (isInside([newLand[0],newLand[1]-1])){
            neighbor = mapTable[newLand[0]][newLand[1]-1]
            player[i].border[neighbor].away.add([newLand[0],newLand[1]-1].toString())
        }
        if (isInside([newLand[0],newLand[1]+1])){
            neighbor = mapTable[newLand[0]][newLand[1]+1]
            player[i].border[neighbor].away.add([newLand[0],newLand[1]+1].toString())
        }
        if (isInside([newLand[0]-1,newLand[1]])){
            neighbor = mapTable[newLand[0]-1][newLand[1]]
            player[i].border[neighbor].away.add([newLand[0]-1,newLand[1]].toString())
        }
        if (isInside([newLand[0]+1,newLand[1]])){
            neighbor = mapTable[newLand[0]+1][newLand[1]]
            player[i].border[neighbor].away.add([newLand[0]+1,newLand[1]].toString())
        }
    }
    // printStatus('TABLE after placement')
    // load the desired algorithm and attack player0 till desiredSize reached
    window[genAlgorithm.value]()
    let timeTaken = Date.now()-start
    console.log(timeTaken)
})

// simulate an attack from a chosen player that takes a pixel from a chosen enemy
function takePixel(w,l) {
// check if there is a border at all
    if (!borders(w,l)) {
        return
    } else {
// check if there's a pixel to select, if there is none generate new borders and try again
        if (player[w].border[l].away.size==0) {
            redrawBorder(w,l)
            takePixel(w,l)
            return
        } else {
// if there is retake it and adjust the borders
            let newLand = player[w].border[l].away.values().next().value
            let xy = [+newLand.split(',')[0],+newLand.split(',')[1]]
            let xyNeighbors = neighborList(xy)
            let xynNeighbors = xyNeighbors.filter((item) => {
                if (item[1]!==w && item[1]!==l) {return true}
            })
            mapTable[xy[0]][xy[1]] = w
            player[w].border[w].home.add(newLand)
            player[l].border[l].home.delete(newLand)
// for xy adjust n and l borders
            for (let i of xynNeighbors) {
                player[i[1]].border[l].away.delete(newLand)
                if (player[i[1]].border[l].away.size==0) {redrawBorder(i[1],l)}
                player[l].border[i[1]].home.delete(newLand)
// for xy adjust n and w borders
                player[w].border[i[1]].home.add(newLand)
                player[i[1]].border[w].away.add(newLand)
            }
// for xy adjust l and w border
            player[l].border[w].home.delete(newLand)
            player[w].border[l].away.delete(newLand)
            let check = false
            for(let i of xyNeighbors) {
                if (i[1]==l) {check=true}
            }
            if (check) {
                player[w].border[l].home.add(newLand)
                player[l].border[w].away.add(newLand)
            }
//now let's adjust the neighboring pixels
            for(let i of xynNeighbors) {
                normalizeBorder(i,w,l)
            }
            
            player[w].size++
            player[l].size--
            context.fillStyle = player[w].color
            context.fillRect(xy[0],xy[1],1,1)
            // printStatus()
        }
    }
}

function normalizeBorder(xyz,w,l) {
// normalize N and L border
    if (player[xyz[1]].border[l].home.has(xyz[0].toString())) {
        let check = false
        for (let j of neighborList(xyz[0])) {
            if (j[1]==l) {
                check = true
            }
        }
        if (!check) {player[xyz[1]].border[l].home.delete(xyz[0].toString())}
    }
    if (player[l].border[xyz[1]].away.has(xyz[0].toString())) {
        let check = false
        for (let j of neighborList(xyz[0])) {
            if (j[1]==l) {
                check = true
            }
        }
        if (!check) {player[l].border[xyz[1]].away.delete(xyz[0].toString())}
    }
}

// draws a new border
function redrawBorder(w,l) {
    let newBorder = new Set()
    player[w].border[l].home.forEach(pixel => {
        let xy=[+pixel.split(',')[0],+pixel.split(',')[1]]
        if (isInside([xy[0]+1,xy[1]])) {
            if (mapTable[xy[0]+1][xy[1]]==l) {newBorder.add([xy[0]+1,xy[1]].toString())}
        }
        if (isInside([xy[0]-1,xy[1]])) {
            if (mapTable[xy[0]-1][xy[1]]==l) {newBorder.add([xy[0]-1,xy[1]].toString())}
        }
        if (isInside([xy[0],xy[1]-1])) {
            if (mapTable[xy[0]][xy[1]-1]==l) {newBorder.add([xy[0],xy[1]-1].toString())}
        }
        if (isInside([xy[0],xy[1]+1])) {
            if (mapTable[xy[0]][xy[1]+1]==l) {newBorder.add([xy[0],xy[1]+1].toString())}
        }
    })
    player[w].border[l].home.clear()
    player[w].border[l].away = newBorder
    player[l].border[w].away.clear()
    player[l].border[w].home = newBorder
}

// searches for the shortest path from one player to another
function findPath(a,b) {
    let thePath = []
    let path = [a]
    let node = 0
    let minPathSize = player.length+1
    let wrongTurns = [[]]
    let possibleTurns = []
    let selected = ''
    while (path.length>0) {
// generate possible and wrong turns
        wrongTurns[node] = wrongTurns[node]||[]
        possibleTurns = []
        for (let i=0;i<player.length;i++){
            if (!wrongTurns[node].includes(i) && !path.includes(i) && borders(path[node],i)) {
                possibleTurns.push(i)
            }
        }
// check if we can reach b
        if (possibleTurns.includes(b)) {
            path.push(b)
            wrongTurns[node].splice(wrongTurns[node].length,0,...possibleTurns)
            node++
        } else {
// check if there is a path, if yes take it, if not backtrack
            if (possibleTurns.length>0) {
                selected = possibleTurns.pop()
                path.push(selected)
                wrongTurns[node].push(selected)
                node++
            } else {
                wrongTurns[node]=[]
                path.pop()
                node--
            }
        }
// check if the path is too long
        if (path.length>=minPathSize) {
            wrongTurns[node]=[]
            path.pop()
            node--
        } else {
// check if we have a best path
            if (path[path.length-1]==b) {
                if (path.length==3) {
                    return path
                }
                else {
                    minPathSize = path.length
                    thePath=structuredClone(path)
                }
            }
        }
    }
    return thePath
}