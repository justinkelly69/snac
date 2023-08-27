import {
    SNACItem, SNACElement, AttributesType,
    SNACText, SNACCDATA, SNACComment, SNACPINode
} from './types'

import {
    escapeHtml, escapeCDATA, escapeComment,
    escapePIBody,
} from './utils'

class SNAC2XML {

    private PREFIX_SHOW_PREFIX: boolean
    private PREFIX_NEWLINE: string
    private PREFIX_USE_PREFIX: boolean
    private PREFIX_START_CHAR: string
    private PREFIX_CHAR_ON: string
    private PREFIX_ATTRIBUTE_PREFIX: string

    private XML_SELF_CLOSE_TAGS: boolean
    private XML_TRIM_TEXT: boolean
    private XML_ALLOW_COMMENTS: boolean
    private XML_ALLOW_PI: boolean

    constructor({
        PREFIX_SHOW_PREFIX,
        PREFIX_NEWLINE,
        PREFIX_USE_PREFIX,
        PREFIX_START_CHAR,
        PREFIX_CHAR_ON,
        PREFIX_ATTRIBUTE_PREFIX,

        XML_SELF_CLOSE_TAGS,
        XML_TRIM_TEXT,
        XML_ALLOW_COMMENTS,
        XML_ALLOW_PI,
    }) {
        const a = arguments[0]
        this.PREFIX_SHOW_PREFIX = a.PREFIX_SHOW_PREFIX
        this.PREFIX_NEWLINE = a.PREFIX_NEWLINE
        this.PREFIX_USE_PREFIX = a.PREFIX_USE_PREFIX
        this.PREFIX_START_CHAR = a.PREFIX_START_CHAR
        this.PREFIX_CHAR_ON = a.PREFIX_CHAR_ON
        this.PREFIX_ATTRIBUTE_PREFIX = a.PREFIX_ATTRIBUTE_PREFIX

        this.XML_SELF_CLOSE_TAGS = a.XML_SELF_CLOSE_TAGS
        this.XML_TRIM_TEXT = a.XML_TRIM_TEXT
        this.XML_ALLOW_COMMENTS = a.XML_ALLOW_COMMENTS
        this.XML_ALLOW_PI = a.XML_ALLOW_PI
    }

    openTag(path: number[], elementName: string, attrs: AttributesType) {
        return `${this.getPrefix(path, false)}<${elementName}${this.attributes(path, attrs)}>`
    }

    children(children: string) {
        return `${children}`
    }

    closeTag(path: number[], elementName: string) {
        return `${this.getPrefix(path, false)}</${elementName}>`
    }

    emptyTag(path: number[], elementName: string, attrs: AttributesType) {
        return `${this.getPrefix(path, false)}<${elementName}${this.attributes(path, attrs)} />`
    }

    text(path: number[], text: string) {
        return `${this.getPrefix(path, false)}${text}`
    }

    cdata(path: number[], cdata: string) {
        return `${this.getPrefix(path, false)}<![CDATA[${cdata}]]>`
    }

    comment(path: number[], comment: string) {
        return `${this.getPrefix(path, false)}<!--${comment}-->`
    }

    pi(path: number[], lang: string, body: string) {
        return `${this.getPrefix(path, false)}<?${lang} ${body}?>`
    }

    attributes(path: number[], atts: AttributesType) {
        let attStr = ""
        for (const a in atts) {
            attStr += this.attribute(path, a, atts[a])
        }
        return attStr
    }

    attribute(path: number[], name: string, value: string) {
        return `${this.getPrefix(path, true)}${name}="${value}"`
    }

    getPrefix(path: number[], isAttribute: boolean) {
        let out: string = ""
        const depth = path.length

        if (!this.PREFIX_SHOW_PREFIX) {
            out = `${out}${this.PREFIX_NEWLINE}`

            if (this.PREFIX_USE_PREFIX) {
                out = `${out}${this.PREFIX_START_CHAR}`

                for (let _ of Array.from({ length: depth }, (value, index) => index)) {
                    out = `${out}${this.PREFIX_CHAR_ON}`
                }
            }

            if (isAttribute) {
                out = `${out}${this.PREFIX_ATTRIBUTE_PREFIX}`
            }
        }

        return out;
    }

    render(snac: SNACItem[]) {
        return this._render(snac, [])
    }

    private _render(snac: SNACItem[], path: number[]) {
        let out: string = "";

        for (let i in Object.keys(snac)) {
            const newPath = [...path, parseInt(i)]

            if (snac[i].hasOwnProperty("N")) {
                const snacElementNode: SNACElement = snac[i] as SNACElement;

                const elementName = snacElementNode["N"]
                const children = this._render(snacElementNode["C"], newPath)

                if (children.length === 0 && this.XML_SELF_CLOSE_TAGS) {
                    out += this.emptyTag(path, elementName, snacElementNode["A"])
                }
                else {
                    out += this.openTag(path, elementName, snacElementNode["A"])
                    out += this.children(children)
                    out += this.closeTag(path, elementName)
                }
            }

            else if (snac[i].hasOwnProperty("T")) {
                const snacTextNode: SNACText = snac[i] as SNACText
                let text = escapeHtml(snacTextNode["T"])
                if (this.XML_TRIM_TEXT) {
                    text = text.trim()
                }
                out += this.text(path, text)
            }

            else if (snac[i].hasOwnProperty("D")) {
                const snacCDATANode: SNACCDATA = snac[i] as SNACCDATA
                out += this.cdata(path, escapeCDATA(snacCDATANode["D"]))
            }

            else if (snac[i].hasOwnProperty("M")) {
                if (this.XML_ALLOW_COMMENTS) {
                    const snacCommentNode: SNACComment = snac[i] as SNACComment
                    out += this.comment(path, escapeComment(snacCommentNode["M"]))
                }
            }

            else if (snac[i].hasOwnProperty("L")) {
                if (this.XML_ALLOW_PI) {
                    const snacPINode: SNACPINode = snac[i] as SNACPINode
                    out += this.pi(path, snacPINode["L"], escapePIBody(snacPINode["B"]))
                }
            }
        }

        return out
    }
}

export default SNAC2XML
