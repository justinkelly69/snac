import { AttributesType, EditAttributesType, SNACNamesNode } from "./types"

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

export const attributeKeys = (attributes: AttributesType | EditAttributesType): string[][] => {
    const out:string[][] = []
    Object.keys(attributes).map((ns, i) => {
        return Object.keys(attributes[ns]).map((name, j) => {
            return out.push([ns, name])
        })
    })
    return out
}

export const repeatString = (
    start: number,
    end: number,
    str: string
): string => {
    return Array.from('x'.repeat(end - start), (_, i) => 'x').join(str)
}

export const isLonger = (
    text1: string,
    length: number,
):boolean => {
    return text1.length > length
}

export const trimBody = (
    isChildrenOpen: boolean,
    body: string,
    trimLength: number,
    ellipsis: string
):[string, boolean] => {
    if(!isChildrenOpen) {
        if(body.trim().length === 0){
            return ['', false]
        }
        else if(isLonger(body, trimLength)) {
            return [`${body.split(/\s+/).join(' ').substring(0, trimLength)} ${ellipsis}`, true]
        }
        else if(body.length > body.trim().length) {
            return [`${body.split(/\s+/).join(' ').trim()}`, true]
        }
        else {
            return [`${body.split(/\s+/).join(' ').trim()}`, false]
        }
    }
    else {
        if(body.trim().length === 0){
            return ['', false]
        }
        else if(isLonger(body, trimLength)) {
            return [body, true]
        }
        else if(body.length > body.trim().length) {
            return [body, true]
        }
        else {
            return [body, false]
        }
    }
}

