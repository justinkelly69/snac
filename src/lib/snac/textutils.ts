import { AttributesType, SNACNamesNode } from "./types"

export const escapeHtml = (text: string): string => {
    return text.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/'/g, '&apos;')
        .replace(/"/g, '&quot;')
}

export const unEscapeHtml = (text: string): string => {
    return text.replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&apos;/g, '\'')
        .replace(/&quot;/g, '"')
}

export const escapeCDATA = (text: string): string => {
    return text.replace(/]]>/g, ']]&gt;')
}

export const unEscapeCDATA = (text: string): string => {
    return text.replace(/]]&gt;/g, ']]>')
}

export const escapeComment = (text: string): string => {
    return text.replace(/--/g, ' - - ')
}

export const unEscapeComment = (text: string): string => {
    return text.replace(/ - - /g, '--')
}

export const testPILang = (text: string): boolean => {
    return text.match(/^[a-z]+[0-9]?=?/) ? true : false
}

export const escapePIBody = (text: string): string => {
    return text.replace(/\?>/g, '?&gt;')
}

export const unEscapePIBody = (text: string): string => {
    return text.replace(/\?&gt;/g, '?>')
}

export const nsNameSplit = (text: string): SNACNamesNode => {
    const nsName = text.split(/:/)
    if (nsName.length === 1) {
        return {
            S: '',
            N: nsName[0]
        }
    }
    else {
        return {
            S: nsName[0],
            N: nsName[1]
        }
    }
}

export const nsNameArray = (text: string): string[] => {
    const nsName = text.split(/:/)
    if (nsName.length === 1) {
        return ['', nsName[0]]

    }
    else {
        return nsName
    }
}

export const nsNameJoin = (nsNode?: SNACNamesNode): string | null => {
    if (nsNode) {
        if (nsNode.S.length === 0) {
            return nsNode.N
        }
        else {
            return `${nsNode.S}:${nsNode.N}`
        }
    }
    return null
}

export const attributeKeys = (attributes: AttributesType): string[][] => {
    const out:string[][] = []

    Object.keys(attributes).map((ns, i) => {
        
        return Object.keys(attributes[ns]).map((name, j) => {
            out.push([ns, name])
        })
    })
    return out
}

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

