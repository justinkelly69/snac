import { AttributeValueType, QuoteChar } from "./types"

export const escapeHtml = (text: string) => {
    text = text.replace(/&/g, '&amp;')
    text = text.replace(/</g, '&lt;')
    text = text.replace(/>/g, '&gt;')
    text = text.replace(/'/g, '&apos;')
    text = text.replace(/"/g, '&quot;')

    return text
}

export const unEscapeHtml = (text: string) => {
    text = text.replace(/&amp;/g, '&')
    text = text.replace(/&lt;/g, '<')
    text = text.replace(/&gt;/g, '>')
    text = text.replace(/&apos;/g, '\'')
    text = text.replace(/&quot;/g, '"')

    return text
}

export const escapeCDATA = (text: string) => {
    return text.replace(/]]>/g, ']]&gt;')
}

export const unEscapeCDATA = (text: string) => {
    return text.replace(/]]&gt;/g, ']]>')
}

export const escapeComment = (text: string) => {
    return text.replace(/--/g, ' - - ')
}

export const unEscapeComment = (text: string) => {
    return text.replace(/ - - /g, '--')
}

export const testPILang = (text: string) => {
    return text.match(/^[a-z]+[0-9]?=?/) ? true : false
}

export const escapePIBody = (text: string) => {
    return text.replace(/\?>/g, '?&gt;')
}

export const unEscapePIBody = (text: string) => {
    return text.replace(/\?&gt;/g, '?>')
}

