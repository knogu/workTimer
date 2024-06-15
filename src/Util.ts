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

export function isProd() {
    return import.meta.env.MODE === 'production'
}

export function curDate() {
    // if (isProd()) {
        return new Date();
    // } else {
    //     const curPosix = new Date().getTime()
    //     const milliSecsPerDay = 24 * 60 * 60 * 1000;
    //     const posixTime = (curPosix * 60) % milliSecsPerDay;
    //     return new Date(posixTime);
    // }
}
