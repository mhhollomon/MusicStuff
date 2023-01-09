export function capitalize(s : string) {
    return s.substring(0,1).toUpperCase() + s.substring(1).toLowerCase();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function rotateArray(arr : any[], k : number) : any[] {
    return arr.slice(k).concat(arr.slice(0, k));
}

export function range(start : number, end : number) {
    end = Math.floor(end);
    start = Math.floor(start);
    return Array.from({length: (end - start)}, (v, k) => k + start)
}