export function padZero(n: number) {
    let str = n.toString()
    if (str.length === 1) {
        str = "0" + str
    }
    return str
}

export function displayedMinutes(minutes: number) {
    return Math.floor(minutes/60).toString() + ":" + padZero(minutes % 60)
}