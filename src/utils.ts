export function prettyDate(d: Date): string {
    return `${d.getFullYear()}-${pad(d.getMonth(), 2)}-${pad(d.getDate(), 2)}`
}

function pad(num: number, size: number) {
    let str = num.toString();
    while (str.length < size) str = "0" + str;
    return str;
}