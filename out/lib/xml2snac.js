"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getValueString = exports.getAttributeValue = exports.addAttribute = exports.getAttributes = exports._xml2snac = exports.xml2snac = void 0;
const text_1 = require("./text");
const xml2snac = (xml) => {
    const stack = [];
    return (0, exports._xml2snac)(xml, stack)['out'];
};
exports.xml2snac = xml2snac;
const _xml2snac = (xml, stack) => {
    const out = [];
    while (xml.length > 0) {
        const openTagData = xml.match(/^<([\w]*:?[\w]+)(.*)$/s);
        const closeTagData = xml.match(/^<\/([\w]*:?[\w]+)>(.*)$/s);
        const CDATATagData = xml.match(/^<!\[CDATA\[(.*?)\]\]>(.*)$/s);
        const commentTagData = xml.match(/^<!--(.*?)-->(.*)$/s);
        const PITagData = xml.match(/^<\?(\w+=?)\s+(.*?)\?>(.*)$/s);
        const textTagData = xml.match(/^([^<>]+)(.*)$/s);
        const blankTagData = xml.match(/^$/s);
        if (openTagData !== null) {
            const tagName = openTagData[1];
            const attributeData = (0, exports.getAttributes)(openTagData[2]);
            xml = attributeData['xml'];
            const snac = {
                S: '@',
                N: tagName,
                A: attributeData['attributes'],
                C: [],
                a: true,
                o: true,
                q: false
            };
            const index = tagName.indexOf(':');
            if (index > -1) {
                snac['S'] = tagName.substring(0, index);
                snac['N'] = tagName.substring(index + 1);
            }
            stack.push({
                S: snac['S'],
                N: snac['N']
            });
            if (attributeData['hasChildren']) {
                const kids = (0, exports._xml2snac)(xml, stack);
                snac['C'] = kids['out'];
                xml = kids['xml'];
                out.push(snac);
            }
            else {
                out.push(snac);
                const prev = stack.pop();
            }
        }
        else if (closeTagData !== null) {
            const tagName = closeTagData[1];
            const snac = {
                S: '@',
                N: tagName
            };
            const index = tagName.indexOf(':');
            if (index > -1) {
                snac['S'] = tagName.substring(0, index);
                snac['N'] = tagName.substring(index + 1);
            }
            const prev = stack.pop();
            if (prev && (prev['S'] !== snac['S'] || prev['N'] !== snac['N'])) {
                throw Error(`\n\nUNMATCHED TAG <${prev['S']}:${prev['N']}></${snac['S']}:${snac['N']}>\n`);
            }
            return {
                xml: closeTagData[2],
                out: out
            };
        }
        else if (CDATATagData !== null) {
            const data = {
                D: CDATATagData[1],
                a: true,
                o: true,
                q: false
            };
            out.push(data);
            xml = CDATATagData[2];
        }
        else if (commentTagData !== null) {
            const data = {
                M: commentTagData[1],
                a: true,
                o: true,
                q: false
            };
            out.push(data);
            xml = commentTagData[2];
        }
        else if (PITagData !== null) {
            const data = {
                L: PITagData[1],
                B: PITagData[2],
                a: true,
                o: true,
                q: false
            };
            out.push(data);
            xml = PITagData[3];
        }
        else if (textTagData !== null) {
            const data = {
                T: textTagData[1],
                a: true,
                o: true,
                q: false
            };
            out.push(data);
            xml = textTagData[2];
        }
        else if (blankTagData !== null) {
            const data = {
                T: "",
                a: true,
                o: true,
                q: false
            };
            out.push(data);
            xml = "";
        }
    }
    return {
        xml: "",
        out: out
    };
};
exports._xml2snac = _xml2snac;
const getAttributes = (xml) => {
    let attributes = {};
    while (xml.length > 0) {
        const closingTag = xml.match(/^\s*(\/?>)(.*)$/);
        const nextAttribute = xml.match(/^\s*([\w]+:?[\w]+)=(['"])(.*)$/s);
        if (closingTag) {
            let hasChildren = false;
            if (closingTag[1] === '>') {
                hasChildren = true;
            }
            return {
                xml: closingTag[2],
                hasChildren: hasChildren,
                attributes: attributes
            };
        }
        else if (nextAttribute) {
            const quoteChar = nextAttribute[2];
            const att = (0, exports.addAttribute)(attributes, nextAttribute[1], quoteChar, nextAttribute[3]);
            attributes = att['attributes'];
            xml = att['xml'];
        }
        else {
            throw Error(`INVALID ATTRIBUTE ${xml}\n`);
        }
    }
    return {
        xml: xml,
        hasChildren: false,
        attributes: {}
    };
};
exports.getAttributes = getAttributes;
const addAttribute = (attributes, nameStr, quoteChar, xml) => {
    const attVal = (0, exports.getAttributeValue)(xml, quoteChar);
    const colonIndex = nameStr.indexOf(":");
    if (colonIndex === -1) {
        if (!attributes.hasOwnProperty('@')) {
            attributes['@'] = {};
        }
        attributes['@'][nameStr] = attVal['value'];
    }
    else {
        const ns = nameStr.substring(0, colonIndex);
        const name = nameStr.substring(colonIndex + 1);
        if (!attributes.hasOwnProperty(ns)) {
            attributes[ns] = {};
        }
        attributes[ns][name] = attVal['value'];
    }
    return {
        attributes: attributes,
        xml: attVal['xml']
    };
};
exports.addAttribute = addAttribute;
const getAttributeValue = (text, quoteChar) => {
    const values = (0, exports.getValueString)(text, quoteChar);
    if (values === null) {
        throw Error(`Bad xml ${text}`);
    }
    const re = new RegExp(`\\${quoteChar}`, 'g');
    const value = (0, text_1.unEscapeHtml)(values['value'].replace(re, quoteChar));
    const xml = values['xml'];
    return {
        value,
        xml
    };
};
exports.getAttributeValue = getAttributeValue;
const getValueString = (text, quoteChar) => {
    for (let i = 0; i < text.length; i++) {
        if (text.charAt(i) === quoteChar && text.charAt(i - 1) !== '\\') {
            const value = text.substring(0, i);
            const xml = text.substring(i + 1);
            return {
                value,
                xml
            };
        }
    }
    return null;
};
exports.getValueString = getValueString;
