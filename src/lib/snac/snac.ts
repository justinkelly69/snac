import { snacOpts } from "./opts"
import { afterLastPath, beforeFirstPath, comparePaths } from "./paths"
import {
    SNACItem,
    SNACElement,
    SNACText,
    SNACCDATA,
    SNACComment,
    SNACPINode,
    XMLModesType,
    XMLTextModesType
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

export const findElements = (
    snac: SNACItem[],
    paths: number[][]
): SNACItem[] => {
    const out: SNACItem[] = []

    for (const path of paths) {
        const element = findElement(snac, path)
        if (element !== null) {
            out.push(element)
        }
    }

    if (!out[0].hasOwnProperty('T')) {
        out.unshift({ T: '' })
    }

    if (!out[out.length - 1].hasOwnProperty('T')) {
        out.push({ T: '' })
    }

    return out
}

export const findElement = (
    snac: SNACItem[],
    path: number[]
): SNACItem | null => {
    const e = find(snac, path)

    if (e !== null) {
        if (e.hasOwnProperty('N')) {
            return e as SNACElement
        }
        else if (e.hasOwnProperty('T')) {
            return e as SNACText
        }
        else if (e.hasOwnProperty('D')) {
            return e as SNACCDATA
        }
        else if (e.hasOwnProperty('M')) {
            return e as SNACComment
        }
        else if (e.hasOwnProperty('L')) {
            return e as SNACPINode
        }
        else {
            console.log("Invalid element")
            return null
        }
    }
    else {
        console.log("No element found")
    }
    return null
}

export const clone = (
    snac: SNACItem[],
    paths: number[][],
    replace?: SNACItem[],
) => {
    return _clone(snac, paths, [], 0, replace)
}

export const _clone = (
    snac: SNACItem[],
    paths: number[][],
    tmpPath: number[],
    depth: number,
    replace?: SNACItem[],
): SNACItem[] => {
    const snacOut: SNACItem[] = []

    let blocked = false
    let pathsIndex = 0

    for (let i = 0; i < snac.length; i++) {

        if (paths.length > 0 && comparePaths(paths[pathsIndex], [...tmpPath, i]) === 0) {
            blocked = true
            pathsIndex = pathsIndex + 1
            continue
        }

        else if (blocked === true && replace) {
            for (let j = 0; j < replace.length; j++) {
                snacOut.push(replace[j])
            }
            blocked = false
        }

        if (snac[i].hasOwnProperty('C')) {
            const e = snac[i] as SNACElement
            if (e !== null) {


                const out = {
                    S: e.S,
                    N: e.N,
                    A: e.A,
                    X: e.X,
                    C: _clone(e.C, paths, [...tmpPath, i], depth + 1, replace)
                }
                snacOut.push(out)
            }
        }
        else {
            snacOut.push(snac[i])
        }
    }
    return snacOut
}

export const insertTagInText = (
    textModeContext: XMLTextModesType,
    path: number[],
    nsText: string,
    nameText: string,
    beforeText: string,
    duringText: string,
    afterText: string,
) => {
    if (nameText.length > 0) {
        let ns = '@'
        const name = nameText
        if (nsText.length > 0) {
            ns = nsText
        }
        insertInText(
            textModeContext,
            path,
            beforeText,
            {
                S: ns,
                N: name,
                X: {},
                A: {},
                C: [
                    { T: duringText }
                ]
            },
            afterText,
        )
    }
}

export const insertCDATAInText = (
    textModeContext: XMLTextModesType,
    path: number[],
    beforeText: string,
    duringText: string,
    afterText: string,
) => {
    insertInText(
        textModeContext,
        path,
        beforeText,
        { D: duringText },
        afterText,
    )
}

export const insertCommentInText = (
    textModeContext: XMLTextModesType,
    path: number[],
    beforeText: string,
    duringText: string,
    afterText: string,
) => {
    insertInText(
        textModeContext,
        path,
        beforeText,
        { M: duringText },
        afterText,
    )
}

export const piLanguages = () => {
    const out: string[] = []
    snacOpts.pi_languages.map((language) => {
        return out.push(language[0])
    })
    return out
}

export const insertPIInText = (
    textModeContext: XMLTextModesType,
    path: number[],
    language: string,
    beforeText: string,
    duringText: string,
    afterText: string,
) => {

    if (language.length > 0) {
        insertInText(
            textModeContext,
            path,
            beforeText,
            {
                L: language,
                B: duringText
            },
            afterText,
        )
    }
}

export const insertInText = (
    textModeContext: XMLTextModesType,
    path: number[],
    beforeText: string,
    payload: SNACItem,
    afterText: string,
) => {

    const {
        setBeforeText,
        setDuringText,
        setAfterText,
    } = textModeContext


    const out = [
        { T: beforeText },
        payload,
        { T: afterText },
    ]

    console.log(
        JSON.stringify(path, null, 4),
        JSON.stringify(out, null, 4)
    )
    setBeforeText('')
    setDuringText('')
    setAfterText('')
}

export const wrapElements = (
    snac: SNACItem[],
    xmlModesContext: XMLModesType,
    nsText: string,
    nameText: string,
) => {
    if (nameText.length > 0) {
        let ns = '@'
        const name = nameText
        if (nsText.length > 0) {
            ns = nsText
        }
        const out: SNACItem[] = [{
            S: ns,
            N: name,
            A: {},
            X: {},
            C: findElements(snac, xmlModesContext.paths)
        }]

        const before = beforeFirstPath(xmlModesContext.paths)
        const after = afterLastPath(xmlModesContext.paths)

        console.log('before', JSON.stringify(before, null, 4))
        console.log('after', JSON.stringify(after, null, 4))

        let beforeElement: any
        if (before !== null) {
            beforeElement = findElement(snac, before)
            console.log('beforeElement', JSON.stringify(beforeElement, null, 4))
            if (beforeElement === null || !beforeElement.hasOwnProperty('T')) {
                out.unshift({ T: '1111' })
            }
        }
        else {
            out.unshift({ T: '2222' })
        }

        let afterElement: any
        if (after !== null) {
            afterElement = findElement(snac, after)
            console.log('afterElement', JSON.stringify(afterElement, null, 4))
            if (afterElement === null || !afterElement.hasOwnProperty('T')) {
                out.push({ T: '3333' })
            }
        }
        else {
            out.push({ T: '4444' })
        }

        console.log(
            JSON.stringify(xmlModesContext.paths, null, 4),
            JSON.stringify(out, null, 4)
        )
    }
    else {
        console.log('You must select a tag name')
    }

    xmlModesContext.setMode('VIEW_MODE')
    xmlModesContext.setPaths([])
}
