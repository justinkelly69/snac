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


