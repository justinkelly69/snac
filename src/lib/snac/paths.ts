export const addPath = (
    paths: number[][],
    path: number[]
): number[][] => {
    const len = paths.length - 1
    if (len === -1) {
        return [path]
    }
    if (len === 0 && comparePaths(paths[0], path) === 0) {
        return []
    }
    const start = comparePaths(paths[0], path)
    if (start === -1) {
        return [path, ...paths]
    }
    else if (start === 0) {
        return paths.slice(-1)
    }
    const end = comparePaths(paths[len], path)
    if (end === 0) {
        return paths.slice(0, -1)
    }
    else if (end === 1) {
        return [...paths, path]
    }
    return [path]
}

export const clearPaths = () => []

export const beforeFirstPath = (paths: number[][]): number[] | null => {
    if (paths.length > 0) {
        return prevPath(paths[0])
    }
    return null
}

export const prevPath = (path: number[]): number[] | null => {
    if (path.length > 0 && path[path.length - 1] > 0) {
        return [...path.slice(0, -1), path[path.length - 1] - 1]
    }
    return null
}

export const nextPath = (path: number[]): number[] | null => {
    if (path.length > 0 && path[path.length - 1] < path.length ) {
        return [...path.slice(0, -1), path[path.length - 1] + 1]
    }
    return null
}

export const afterLastPath = (paths: number[][]): number[] | null => {
    if (paths.length > 0) {
        return nextPath(paths[paths.length - 1])
    }
    return null
}

export const hasPath = (
    paths: number[][],
    path: number[]
): boolean => {
    for (const i in range(0, paths.length)) {
        if (comparePaths(paths[i], path) === 0) {
            return true
        }
    }
    return false
}

export const deepClone = (
    paths: number[][]
): number[][] => {
    let out: number[][] = []
    for (const i in range(0, paths.length)) {
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
        return -1
    }
    else if (pathA[len] === pathB[len] - 1) {
        return 1
    }
    else if (pathA[len] === pathB[len]) {
        return 0
    }
    return null
}

export const range = (start: number, end: number): number[] => {
    const length = end - start
    return Array.from({ length }, (_, i) => start + i)
}