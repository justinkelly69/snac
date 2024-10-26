import xml2snac from "./xml2snac"
import { SNACItem, SNACElement, SNACText, SNACCDATA, SNACComment, SNACPINode } from "./types"

const find = (snac: SNACItem[], path: number[]): SNACItem | null => {
    const element: SNACItem = { N: "", A: {}, C: snac, a: true, o: true, q: false }
    return _find(element, path)
}

const _find = (snac: SNACItem, path: number[]): SNACItem | null => {
    if (path.length === 0) {
        return snac
    }
    else {
        if (snac.hasOwnProperty('C')) {
            const S = snac as SNACElement
            const [i, ...p] = path
            if (S.C.length > i) {
                return _find(S.C[i], p)
            }
        }
    }
    return null
}

export const findElement = (snac: SNACItem[], path: number[]) => {
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

const getRemovePaths = (removeFrom: number[], removeTo: number[] ) => {
    if(removeFrom.length !== removeTo.length) {
        return removeTo
    }
    else {
        for(let i in removeFrom.slice(0, removeFrom.length - 1)) {
            if(removeFrom[i] !== removeTo[i]) {
                return removeTo
            }
        }
        const from = removeFrom[removeFrom.length - 1]
        const to = removeTo[removeTo.length - 1]

        let out:number[] = []
        if(from > to){
            for(let i = to; i<=from; i++){
                out = [...out, i]
            }
        }
        else if(from < to) {

        }
        else {

        }
    }
}

const clone = (snac: SNACItem[], removeFrom: number[], removeTo: number[], replace: SNACItem[] | null): SNACItem[] => {
    const snac1: SNACItem[] = []
    for (const s in snac) {
        if (removeFrom[0] === parseInt(s)) {

        }
        else {
            snac1.push(snac[s])
        }
    }
    return snac1
}