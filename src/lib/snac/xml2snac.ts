import {
    SNACNamesNode, SNACItem, SNACElement, AttributesXMLhasChildrenType,
    AttributesType, QuoteChar, AttributeXMLType, AttributeValueType
} from './types'

import { unEscapeHtml } from './textutils'

const render = (xml: string) => {
    const stack: SNACNamesNode[] = []
    
    return _render(xml, stack)['out']
}

const _render = (xml: string, stack: SNACNamesNode[]) => {
    const out: SNACItem[] = []

    while (xml.length > 0) {
        const openTag = xml.match(/^<([\w]*:?[\w]+)(.*)$/s)
        const closeTag = xml.match(/^<\/([\w]*:?[\w]+)>(.*)$/s)
        const dataTag = xml.match(/^<!\[CDATA\[(.*?)\]\]>(.*)$/s)
        const commentTag = xml.match(/^<!--(.*?)-->(.*)$/s)
        const piTag = xml.match(/^<\?(\w+=?)\s+(.*?)\?>(.*)$/s)
        const textTag = xml.match(/^([^<>]+)(.*)$/s)
        const blankTag = xml.match(/^$/s)

        if (openTag !== null) {
            const tagName = openTag[1]
            const attributes = getAttributes(openTag[2])
            xml = attributes['xml']

            const snac: SNACElement = {
                N: tagName,
                A: attributes['attributes'],
                C: [],
                a: true,
                o: true,
                q: false
            }

            stack.push({
                N: snac['N']
            })

            if (attributes['hasChildren']) {
                const kids = _render(xml, stack)
                snac['C'] = kids['out']
                xml = kids['xml']
                out.push(snac)

            } else {
                out.push(snac)
                //eslint-disable-next-line
                const prev = stack.pop()
            }
        }

        else if (closeTag !== null) {
            const tagName = closeTag[1]
            const snac: SNACNamesNode = {
                N: tagName
            }

            const prev = stack.pop()
            if (prev && (prev['N'] !== snac['N'])) {
                throw Error(`\n\nUNMATCHED TAG <${prev['N']}></${snac['N']}>\n`)
            }

            return {
                xml: closeTag[2],
                out: out
            }
        }

        else if (dataTag !== null) {
            if (stack.length > 0) {
                out.push({
                    D: dataTag[1],
                    o: true,
                    q: false
                })
            }
            xml = dataTag[2]
        }

        else if (commentTag !== null) {
            if (stack.length > 0) {
                out.push({
                    M: commentTag[1],
                    o: true,
                    q: false
                })
            }
            xml = commentTag[2]
        }

        else if (piTag !== null) {
            if (stack.length > 0) {
                out.push({
                    L: piTag[1],
                    B: piTag[2],
                    o: true,
                    q: false
                })
            }
            xml = piTag[3]
        }

        else if (textTag !== null) {
            if (stack.length > 0) {
                out.push({
                    T: unEscapeHtml(textTag[1]),
                    o: true,
                    q: false
                })
            }
            xml = textTag[2]
        }

        else if (blankTag !== null) {
            if (stack.length > 0) {
                out.push({
                    T: "",
                    o: true,
                    q: false
                })
            }
            xml = ""
        }

        else {
            throw Error(`INVALID TAG ${xml}\n`)
        }
    }

    return {
        xml: "",
        out: out
    }
}

const getAttributes = (xml: string): AttributesXMLhasChildrenType => {
    let attributes: AttributesType = {}

    while (xml.length > 0) {
        const closingTag = xml.match(/^\s*(\/?>)(.*)$/s)
        const nextAttribute = xml.match(/^\s*([\w]+:?[\w]+)=(['"])(.*)$/s)

        if (closingTag) {
            let hasChildren = false

            if (closingTag[1] === '>') {
                hasChildren = true
            }

            return {
                xml: closingTag[2],
                hasChildren: hasChildren,
                attributes: attributes
            }
        }

        else if (nextAttribute) {
            const quoteChar = nextAttribute[2] as QuoteChar
            const att = addAttribute(attributes, nextAttribute[1], quoteChar, nextAttribute[3])
            attributes = att['attributes']
            xml = att['xml']
        }

        else {
            throw Error(`INVALID ATTRIBUTE ${xml}\n`)
        }
    }

    return {
        xml: xml,
        hasChildren: false,
        attributes: {}
    }
}

const addAttribute = (attributes: AttributesType, nameStr: string, quoteChar: QuoteChar, xml: string): AttributeXMLType => {
    const attVal = getAttributeValue(xml, quoteChar)
    attributes[nameStr] = attVal['value']

    return {
        attributes: attributes,
        xml: attVal['xml']
    }
}

const getAttributeValue = (text: string, quoteChar: QuoteChar): AttributeValueType => {
    const values = getValueString(text, quoteChar)
    if (values === null) {
        throw Error(`BAD XML ${text}`)
    }
    const re = new RegExp(`\\${quoteChar}`, 'g')

    return {
        value: unEscapeHtml(values['value'].replace(re, quoteChar)),
        xml: values['xml']
    }
}

const getValueString = (text: string, quoteChar: QuoteChar): AttributeValueType | null => {
    for (let i = 0; i < text.length; i++) {
        if (text.charAt(i) === quoteChar && text.charAt(i - 1) !== '\\') {
            return {
                value: text.substring(0, i),
                xml: text.substring(i + 1)
            }
        }
    }
    return null
}

export default render