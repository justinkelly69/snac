import { 
    SNACItem, 
    SNACElement, 
    SNACText, 
    SNACCDATA, 
    SNACComment, 
    SNACPINode 
} from "./types"


// Find an element in the tree
const find = (
    snac: SNACItem[], 
    path: number[]
): SNACItem | null => {

    // Create a blank SNAC element with snac as the children
    const element: SNACItem = {
        S: "", 
        N: "",
        X: {},
        A: {}, 
        C: snac,
        q: false, 
    }

    // Call the search function recursively
    return _find(element, path)
}

// Recursive search function
const _find = (
    element: SNACItem,  // Element to be searched
    path: number[]      // path from that element
): SNACItem | null => {

    if (path.length === 0) { // Element found.
        return element       // Return it.
    }

    else {
        if (element.hasOwnProperty('C')) {   // Depth first search
            const S = element as SNACElement
            const [i, ...p] = path           // Drop down a level
            if (S.C.length > i) {
                return _find(S.C[i], p)      // And search
            }
        }
    }

    return null // Return null if nothing found
}

export const findElement = (
    snac: SNACItem[], 
    path: number[]
) => {

    const e = find(snac, path)

    if (e !== null) {

        if (e.hasOwnProperty('N')) {
            const element = e as SNACElement
            console.log(element.N)
        }
        else if (e.hasOwnProperty('T')) {
            const element = e as SNACText
            console.log(element.T)
        }

        else if (e.hasOwnProperty('D')) {
            const element = e as SNACCDATA
            console.log(element.D)
        }

        else if (e.hasOwnProperty('M')) {
            const element = e as SNACComment
            console.log(element.M)
        }

        else if (e.hasOwnProperty('L')) {
            const element = e as SNACPINode
            console.log(element.B)
        }

        else {
            console.log("Invalid Element")
        }
    }
    
    else {
        console.log("No element found")
    }
}

// Compare 2 arrays.
// 
const isAdjacent = (
    array1: number[], 
    array2: number[] 
):number | null => {

    // Nodes are different lengths. Return null.
    if(array1.length !== array2.length) {
        return null
    }

    else {

        // Nodes are the same length but not adjacent. Return null.
        for(let i in array1.slice(0, array1.length - 1)) {
            if(array1[i] !== array2[i]) {
                return null
            }
        }

        // Nodes are the same length and match.
        // Compare the last number in each.
        const last1 = array1[array1.length - 1]
        const last2 = array2[array2.length - 1]

        if(last1 === last2 + 1){
            return 1
        }
        else if(last1 === last2 - 1) {
            return -1
        }
        else {
            return 0
        }
    }
}

const createNumberArea = (base:number[], from: number, to: number):number[][] => {
    const out:number[][] = []
    if(from <= to){
        for(const i in range(from, to)){
            out.push([...base, parseInt(i)])
        }
    }
    return out
}

const clone = (
    snac: SNACItem[], 
    removeFrom: number[], 
    removeTo: number[], 
    replace: SNACItem[] | null
): SNACItem[] => {

    const snacOut: SNACItem[] = []
    for (const s in snac) {
        if (removeFrom[0] === parseInt(s)) {

        }
        else {
            snacOut.push(snac[s])
        }
    }
    return snacOut
}

export const range = (start: number, end: number): number[] => {
    const length = end - start
    return Array.from({ length }, (_, i) => start + i)
}
