export const addPath = (
    paths: number[][],
    path: number[]
): number[][] => {

    if (paths.length === 0) {
        return [path]
    }

    if (paths.length === 1 &&
        comparePaths(paths[0], path) === 0) {
        return []
    }

    const start = comparePaths(paths[0], path)
    if (start === -1) {
        return [path, ...paths]
    }
    else if (start === 0) {
        return paths.slice(-1)
    }

    const end = comparePaths(paths[paths.length - 1], path)
    if (end === 0) {
        return paths.slice(0, -1)
    }
    else if (end === 1) {
        return [...paths, path]
    }

    return [path]
}

export const hasPath = (
    paths: number[][],
    path: number[]
):boolean => {
    
    for(const i in range(0, paths.length)) {
        if(comparePaths(paths[i], path) == 0) {
            return true
        }
    }

    return false
}


export const deepClone = (
    paths: number[][]
): number[][] => {
    let out: number[][] = []

    for(const i in range(0, paths.length)){
        out = [...out, [...paths[i]]]
    }

    return out
}



export const comparePaths = (
    pathA: number[],
    pathB: number[]
): number | null => {

    if (pathA.length !== pathB.length) {
        return null
    }

    const len = pathA.length - 1

    if (len === -1) {
        return null
    }

    for (const i in range(0, len)) {
        if (pathA[i] !== pathB[i]) {
            return null
        }
    }

    if (pathA[len] === pathB[len] + 1) {
        return 1
    }
    else if (pathA[len] === pathB[len] - 1) {
        return -1
    }

    return 0
}

export const range = (start: number, end: number): number[] => {
    const length = end - start
    return Array.from({ length }, (_, i) => start + i)
}