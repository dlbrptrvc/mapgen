function attack(w,l,n) {
    for(let i=0;i<n;i++) {
        if (borders(w,l)) {
            takePixel(w,l)
        } else {
            return i
        }
    } return n
}