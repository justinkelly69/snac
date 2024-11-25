export const range = (start: number, end: number): number[] => {
    const length = end - start
    return Array.from({ length }, (_, i) => start + i)
}

export const repeatString = (
    start: number,
    end: number,
    str: string
): string => {
    return Array.from('x'.repeat(end - start), (_, i) => 'x').join(str)
}

export const trimBody = (
    isChildrenOpen: boolean,
    body: string,
    trimLength: number,
    ellipsis: string
) => {
    return !isChildrenOpen && body.length > trimLength ?
        `${body.split(/\s+/).join(' ').substring(0, trimLength)} ${ellipsis}` :
        body
}

