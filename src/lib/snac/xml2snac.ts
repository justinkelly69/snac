import {
    SNACNamesNode,
    SNACItem,
    SNACElement,
    AttributesType,
    NamespaceAttributesType
} from './types'

import {
    isOpenTag,
    isCloseTag,
    isCDATATag,
    isCommentTag,
    isPITag,
    isText,
    isBlank,
} from './match'

import {
    nsNameJoin,
    nsNameSplit,
    unEscapeHtml
} from './textutils'
import { getAllAttributes } from './atts2snac'

const render = (xml: string) => {
    const stack: SNACNamesNode[] = []
    return _render(xml, stack)['out']
}

const _render = (remainder: string, stack: SNACNamesNode[]) => {
    const out: SNACItem[] = []

    while (remainder.length > 0) {
        const openTag = isOpenTag(remainder)
        const closeTag = isCloseTag(remainder)
        const CDATATag = isCDATATag(remainder)
        const commentTag = isCommentTag(remainder)
        const PITag = isPITag(remainder)
        const textTag = isText(remainder)
        const blankTag = isBlank(remainder)

        if (openTag !== null) {
            const openTagNsName = nsNameSplit(openTag[1])
            const attributes = getAllAttributes(openTag[2])
            remainder = attributes['remainder']

            const snac: SNACElement = {
                ...openTagNsName,
                ...getNamespaces(attributes['attributes']),
                C: [],
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

        else if (CDATATag !== null) {
            if (stack.length > 0) {
                out.push({
                    D: CDATATag[1],
                })
            }
            remainder = CDATATag[2]
        }

        else if (commentTag !== null) {
            if (stack.length > 0) {
                out.push({
                    M: commentTag[1],
                })
            }
            remainder = commentTag[2]
        }

        else if (PITag !== null) {
            if (stack.length > 0) {
                out.push({
                    L: PITag[1],
                    B: PITag[2],
                })
            }
            remainder = PITag[3]
        }

        else if (textTag !== null) {
            if (stack.length > 0) {
                out.push({
                    T: unEscapeHtml(textTag[1]),
                })
            }
            remainder = textTag[2]
        }

        else if (blankTag !== null) {
            if (stack.length > 0) {
                out.push({
                    T: '',
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
                    if (!A['@']) {
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
                if (!A[S]) {
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

export default render
