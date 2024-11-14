import {
    SNACNamesNode,
    SNACItem,
    SNACElement,
    AttributesXMLhasChildrenType,
    AttributesType,
    QuoteChar,
    AttributeXMLType,
    AttributeValueType,
    NamespaceAttributesType
} from './types'

import {
    nsNameArray,
    nsNameJoin,
    nsNameSplit,
    unEscapeHtml
} from './textutils'

const render = (xml: string) => {
    const stack: SNACNamesNode[] = []
    return _render(xml, stack)['out']
}

const _render = (remainder: string, stack: SNACNamesNode[]) => {
    const out: SNACItem[] = []

    while (remainder.length > 0) {
        const openTag = remainder.match(/^<([\w]*:?[\w]+)(.*)$/s)
        const closeTag = remainder.match(/^<\/([\w]*:?[\w]+)>(.*)$/s)
        const dataTag = remainder.match(/^<!\[CDATA\[(.*?)\]\]>(.*)$/s)
        const commentTag = remainder.match(/^<!--(.*?)-->(.*)$/s)
        const piTag = remainder.match(/^<\?(\w+=?)\s+(.*?)\?>(.*)$/s)
        const textTag = remainder.match(/^([^<>]+)(.*)$/s)
        const blankTag = remainder.match(/^$/s)

        if (openTag !== null) {
            const openTagNsName = nsNameSplit(openTag[1])
            const attributes = getAttributes(openTag[2])
            remainder = attributes['remainder']

            const snac: SNACElement = {
                ...openTagNsName,
                ...getNamespaces(attributes['attributes']),
                C: [],
                a: true,
                o: true,
                q: false
            }

            stack.push({
                ...openTagNsName,
            })

            if (attributes['hasChildren']) {
                const kids = _render(remainder, stack)
                snac.C = kids['out']
                remainder = kids['remainder']
                out.push(snac)
            }

            else {
                out.push(snac)
                stack.pop()
            }
        }

        else if (closeTag !== null) {
            const closeTagNsName = nsNameSplit(closeTag[1])
            const openTagNsName = stack.pop()

            if (!openTagNsName || !closeTagNsName) {
                throw Error("Tag is empty\n")
            }

            const openTagText = nsNameJoin(openTagNsName)
            const closeTagText = nsNameJoin(closeTagNsName)

            if (!openTagNsName || openTagText !== closeTagText) {
                throw Error(`\n\nUNMATCHED TAG <${openTagText}></${closeTagText}>\n`)
            }

            return {
                remainder: closeTag[2],
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
            remainder = dataTag[2]
        }

        else if (commentTag !== null) {
            if (stack.length > 0) {
                out.push({
                    M: commentTag[1],
                    o: true,
                    q: false
                })
            }
            remainder = commentTag[2]
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
            remainder = piTag[3]
        }

        else if (textTag !== null) {
            if (stack.length > 0) {
                out.push({
                    T: unEscapeHtml(textTag[1]),
                    o: true,
                    q: false
                })
            }
            remainder = textTag[2]
        }

        else if (blankTag !== null) {
            if (stack.length > 0) {
                out.push({
                    T: '',
                    o: true,
                    q: false
                })
            }
            remainder = ''
        }

        else {
            throw Error(`INVALID TAG ${remainder}\n`)
        }
    }

    return {
        remainder: '',
        out: out
    }
}

const getNamespaces = (attributes: AttributesType): NamespaceAttributesType => {
    let X = {}
    let A = {}

    for (const S of Object.keys(attributes)) {
        if (S === '@') {
            for (const N of Object.keys(attributes[S])) {
                if (N === 'xmlns') {
                    X['@'] = attributes['@']['xmlns']
                }
                else {
                    if(!A['@']) {
                        A['@'] = {}
                    }
                    A['@'][N] = attributes['@'][N]
                }
            }
        }
        else if (S === 'xmlns') {
            for (const N of Object.keys(attributes['xmlns'])) {
                X[N] = attributes['xmlns'][N]
            }
        }
        else {
            for (const N of Object.keys(attributes[S])) {
                if(!A[S]) {
                    A[S] = {}
                }
                A[S][N] = attributes[S][N]
            }
        }
    }

    return {
        X: X,
        A: A
    }
}

////////////////////////////////////////////////////////////////////////
// ATTRIBUTES 
////////////////////////////////////////////////////////////////////////

// Get all attributes for the current tag
const getAttributes = (remainder: string): AttributesXMLhasChildrenType => {
    let attributes: AttributesType = {}

    while (remainder.length > 0) {
        const closingTag = remainder.match(/^\s*(\/?>)(.*)$/s) // The next character is >
        const nextAttribute = remainder.match(/^\s*([\w]+:?[\w]+)=(['"])(.*)$/s) // Get the next attribute

        if (closingTag) { // space then >
            let hasChildren = false // '/>'

            if (closingTag[1] === '>') { // Open tag. Has children.
                hasChildren = true
            }

            return {
                remainder: closingTag[2], // Remainder after >
                hasChildren: hasChildren,
                attributes: attributes
            }
        }

        // next name="value" pair
        else if (nextAttribute) {
            const quoteChar = nextAttribute[2] as QuoteChar
            const att = addAttribute(
                attributes,
                nextAttribute[1],
                quoteChar,
                nextAttribute[3]
            )
            attributes = att['attributes']
            remainder = att['remainder']
        }

        else {
            throw Error(`INVALID ATTRIBUTE ${remainder}\n`)
        }
    }

    // End of file
    return {
        remainder: remainder,
        hasChildren: false,
        attributes: {}
    }
}

const addAttribute = (
    attributes: AttributesType,
    nameStr: string,
    quoteChar: QuoteChar,
    remainder: string
): AttributeXMLType => {

    const attVal = getAttributeValue(remainder, quoteChar)
    //attributes[nameStr] = attVal['value']

    const [ns, name] = nsNameArray(nameStr)

    if (ns === '') {
        if (!attributes['@']) {
            attributes['@'] = {}
        }
        // attributes['@'][name] = {
        //     V: attVal['value'],
        //     d: false
        // }

        attributes['@'][name] =  attVal['value']
    }
    else {
        if (!attributes[ns]) {
            attributes[ns] = {}
        }
        // attributes[ns][name] = {
        //     V: attVal['value'],
        //     d: false
        // }

        attributes[ns][name] = attVal['value']
    }

    return {
        attributes: attributes,
        remainder: attVal['remainder']
    }
}

const getAttributeValue = (
    remainder: string,
    quoteChar: QuoteChar
): AttributeValueType => {

    const values = getValueString(remainder, quoteChar)
    if (values === null) {
        throw Error(`BAD XML ${remainder}`)
    }

    const re = new RegExp(`\\${quoteChar}`, 'g')

    return {
        value: unEscapeHtml(values['value'].replace(re, quoteChar)),
        remainder: values['remainder']
    }
}

// Get all the string up to the next quoteChar
const getValueString = (
    remainder: string,
    quoteChar: QuoteChar
): AttributeValueType | null => {

    for (let i = 0; i < remainder.length; i++) {
        if (remainder.charAt(i) === quoteChar && remainder.charAt(i - 1) !== '\\') {
            return {
                value: remainder.substring(0, i),
                remainder: remainder.substring(i + 1)
            }
        }
    }
    return null
}

export default render
