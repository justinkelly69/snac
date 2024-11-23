// const range = (start, end, length = end - start + 1) =>
//     Array.from({ length }, (_, i) => start + i)

export const range = (start:number, end: number):number[] => {
    const length = end - start
    return Array.from({ length }, (_, i) => start + i)
}

export const repeatString = (
    start: number, 
    end: number, 
    str:string
): string => {
    return Array.from('x'.repeat(end - start), (_, i) => 'x').join(str)
}