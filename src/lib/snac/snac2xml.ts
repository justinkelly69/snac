import {
    SNACItem,
    SNACElement,
    AttributesType,
    SNACText,
    SNACCDATA,
    SNACComment,
    SNACPINode,
    XMLOpts
} from './types'

import {
    escapePIBody,
    escapeCDATA,
    escapeComment
} from './textutils'

import {
    escapeHtml,
} from './textutils'

const render = (snac: SNACItem[], opts: XMLOpts) => {
    return _render(snac, [], opts)
}

const _render = (snac: SNACItem[], path: number[], opts: XMLOpts) => {
    let out: string = "";
    let prefix = getPrefix(path, true, opts)

    for (let i in Object.keys(snac)) {
        const newPath = [...path, parseInt(i)]

        if (snac[i].hasOwnProperty("N")) {
            const elementNode: SNACElement = snac[i] as SNACElement

            let tagName = elementNode.N
            if (elementNode.S.length > 0) {
                tagName = `${elementNode.S}:${elementNode.N}`
            }

            if (elementNode.C.length === 0 && opts.xml_selfCloseTags) {
                out += `${prefix}<${tagName}${attributes(prefix, elementNode.A, opts)}/>`
            }
            else {
                out += `${prefix}<${tagName}${attributes(prefix, elementNode.A, opts)}>`
                out += _render(elementNode.C, newPath, opts)
                out += `${prefix}</${tagName}>`
            }
        }

        else if (snac[i].hasOwnProperty("T")) {
            const textNode: SNACText = snac[i] as SNACText
            let text = escapeHtml(textNode["T"])
            if (opts.xml_trimText) {
                text = text.trim()
                if (text.length > 0) {
                    out += `${prefix}${text}`
                }
            }
            else {
                out += `${prefix}${text}`
            }
        }

        else if (snac[i].hasOwnProperty("D")) {
            const dataNode: SNACCDATA = snac[i] as SNACCDATA
            out += `${prefix}<![CDATA[${escapeCDATA(dataNode.D)}]]>`
        }

        else if (snac[i].hasOwnProperty("M")) {
            if (opts.xml_allowComments) {
                const commentNode: SNACComment = snac[i] as SNACComment
                out += `${prefix}<!--${escapeComment(commentNode.M)}-->`
            }
        }

        else if (snac[i].hasOwnProperty("L")) {
            if (opts.xml_allowPIs) {
                const piNode: SNACPINode = snac[i] as SNACPINode
                out += `${prefix}<?${piNode.L} ${escapePIBody(piNode.B)} ?>`
            }
        }
    }
    return out
}

const attributes = (prefix: string, atts: AttributesType, opts: XMLOpts) => {
    let out: string = ""
    const attPrefix = prefix + opts.prefix_attributePrefix
    for(const ns of Object.keys(atts)) {
        for(const name of Object.keys(atts[ns])) {
            if(ns === '@') {
                out += ` ${attPrefix}${name}="${escapeHtml(atts['@'][name][0])}"`
            }
            else {
                out += ` ${attPrefix}${ns}:${name}="${escapeHtml(atts[ns][name][0])}"`
            }
        }
    }
    return out;
}

const getPrefix = (path: number[], newline: boolean, opts: XMLOpts): string => {
    let out = ""
    if (opts.prefix_showPrefix) {
        out = newline ? "\n" : ""
        for (let i in path) {
            out += opts.prefix_char
        }
    }
    return out
}

export default render
