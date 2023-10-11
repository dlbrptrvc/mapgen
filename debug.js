saveSetup.addEventListener('click',()=>{
    for (let i=1;i<player.length;i++) {
        localStorage.setItem(i,player[i].capitol.toString())
    }
    localStorage.setItem('l',mapSize.value)
    localStorage.setItem('p',nOfAreas.value)
})

loadSetup.addEventListener('click',()=>{
    mapSize.value = localStorage.getItem('l')
    nOfAreas.value = localStorage.getItem('p')
    for (let i=1;i<=nOfAreas.value;i++) {
        capitolList.push(localStorage.getItem(i))
    }
})

unloadSetup.addEventListener('click',()=>{
    capitolList=[]
})

function printStatus(statmes) {
    statmes = statmes|| ''
    let n = player.length
    let l = mapSize.value
    let deb = document.createElement('debug')
    deb.innerHTML += statmes+'<br>'
    let debMap = document.createElement('debug')
    //create map with coordinates
    for (let i=0;i<l;i++) {
            debMap.innerHTML += '-'+i
    }
    debMap.innerHTML += '<br>'
    for (let i=0;i<l;i++) {
        debMap.innerHTML += i+mapTable[i]+'<br>'
    }
    deb.append(debMap)
    //create player status messages
    for (let i=0;i<n;i++) {
        //check for actual size
        let sizeList = []
        for (let j=0;j<player.length;j++) {
            sizeList[j]=0
        }
        let msg = ''
        for (let j=0;j<mapTable.length;j++){
            for (let k=0;k<mapTable[j].length;k++) {
                sizeList[mapTable[j][k]]++
            }
        }
        if (player[i].size !== sizeList[i]) {msg=' !!!WRONG!!!. Its '+sizeList[i]}
        window['stat'+i] = document.createElement('debug')
        window['stat'+i].innerHTML = 'player '+i+' size:'+player[i].size+msg+'<br>'
        for (let j=0;j<n;j++) {
            if (i!==j) {
                window['stat'+i].innerHTML += 'border with '+j+' home:'+Array.from(player[i].border[j].home).join('|')+'<br>'
                window['stat'+i].innerHTML += 'border with '+j+' away:'+Array.from(player[i].border[j].away).join('|')+'<br>'
            }
        }
        deb.append(window['stat'+i])
    }
    main.append(deb)
}

function printPathStatus(a,b,p) {
    let ps = document.createElement('debug')
    ps.innerHTML = '<br>Looking for a path from '+a+' to '+b+': '+p+'<br>'
    main.append(ps)
}

function printAttackStatus(a,d,w) {
    let as = document.createElement('debug')
    as.innerHTML += 'player'+a+' attacks player'+d+' at '+w+'<br>'
    main.append(as)
}