import { hasChildren, lastAttribute, nextAttribute } from "./match"
import { nsNameArray, unEscapeHtml } from "./textutils"
import { AttributesType, AttributesXMLhasChildrenType, AttributeValueType, AttributeXMLType, QuoteChar } from "./types"

// Get all attributes for the current tag
export const getAllAttributes = (remainder: string): AttributesXMLhasChildrenType => {
    let attributes: AttributesType = {}

    while (remainder.length > 0) {
        const isLastAttribute = lastAttribute(remainder)
        const hasNextAttribute = nextAttribute(remainder)

        if (isLastAttribute) { // space then >
            return {
                remainder: isLastAttribute[2], // Remainder after >
                hasChildren: hasChildren(isLastAttribute[1]),
                attributes: attributes
            }
        }

        // next name="value" pair
        else if (hasNextAttribute) {
            const quoteChar = hasNextAttribute[2] as QuoteChar
            const att = newAttribute(
                attributes,
                hasNextAttribute[1],
                quoteChar,
                hasNextAttribute[3]
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

const newAttribute = (
    attributes: AttributesType,
    nameStr: string,
    quoteChar: QuoteChar,
    remainder: string
): AttributeXMLType => {

    const attVal = newAttributeValue(remainder, quoteChar)
    const [ns, name] = nsNameArray(nameStr)

    if (ns === '') {
        if (!attributes['@']) {
            attributes['@'] = {}
        }
        attributes['@'][name] = attVal['value']
    }
    else {
        if (!attributes[ns]) {
            attributes[ns] = {}
        }
        attributes[ns][name] = attVal['value']
    }

    return {
        attributes: attributes,
        remainder: attVal['remainder']
    }
}

const newAttributeValue = (
    remainder: string,
    quoteChar: QuoteChar
): AttributeValueType => {

    const values = newValueString(remainder, quoteChar)
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
const newValueString = (
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