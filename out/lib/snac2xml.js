"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrefix = exports.attributesToXML = exports.tagName = exports._snac2xml = exports.snac2xml = void 0;
const text_1 = require("./text");
const text_2 = require("./text");
const text_3 = require("./text");
const text_4 = require("./text");
const snac2xml = (snac, options) => {
    return (0, exports._snac2xml)(snac, options, 0);
};
exports.snac2xml = snac2xml;
const _snac2xml = (snac, options, depth) => {
    let out = "";
    const prefix = (0, exports.getPrefix)(depth, options, false);
    for (const snacNode of snac) {
        if (snacNode.hasOwnProperty("N")) {
            const snacElementNode = snacNode;
            const elementName = (0, exports.tagName)(snacElementNode);
            const attrs = (0, exports.attributesToXML)(snacElementNode["A"], options, depth);
            const children = (0, exports._snac2xml)(snacElementNode["C"], options, depth + 1);
            if (children.length === 0 && options["selfCloseTags"]) {
                out = `${out}${prefix}<${elementName}${attrs} />`;
            }
            else {
                out = `${out}${prefix}<${elementName}${attrs}>`;
                out = `${out}${children}`;
                out = `${out}${prefix}</${elementName}>`;
            }
        }
        else if (snacNode.hasOwnProperty("T")) {
            const snacTextNode = snacNode;
            let snacText = (0, text_4.escapeHtml)(snacTextNode["T"]);
            if (options.trimText) {
                snacText = snacText.trim();
            }
            out = `${out}${prefix}[${snacText}]`;
        }
        else if (snacNode.hasOwnProperty("D")) {
            const snacCDATANode = snacNode;
            const snacCDATA = (0, text_1.escapeCDATA)(snacCDATANode["D"]);
            out = `${out}${prefix}<![CDATA[${snacCDATA}]]>`;
        }
        else if (snacNode.hasOwnProperty("M")) {
            const snacCommentNode = snacNode;
            const snacComment = (0, text_3.escapeComment)(snacCommentNode["M"]);
            out = `${out}${prefix}<!--${snacComment}-->`;
        }
        else if (snacNode.hasOwnProperty("L")) {
            const snacPINode = snacNode;
            const snacPILang = snacPINode["L"];
            const snacPIBody = (0, text_2.escapePIBody)(snacPINode["B"]);
            out = `${out}${prefix}<?${snacPILang} ${snacPIBody}?>`;
        }
    }
    return out;
};
exports._snac2xml = _snac2xml;
const tagName = (tag) => {
    let out = "";
    if (tag["S"] !== "@") {
        out = `${out}${tag["S"]}:`;
    }
    out = `${out}${tag["N"]}`;
    return out;
};
exports.tagName = tagName;
const attributesToXML = (atts, options, depth) => {
    let out = "";
    const prefix = (0, exports.getPrefix)(depth, options, true);
    for (const snacNS of Object.keys(atts)) {
        for (const snacName of Object.keys(atts[snacNS])) {
            if (snacNS === "@") {
                out = `${out}${prefix}${snacName}="${atts["@"][snacName]}"`;
            }
            else {
                out = `${out}${prefix}${snacNS}:${snacName}="${atts[snacNS][snacName]}"`;
            }
        }
    }
    return out;
};
exports.attributesToXML = attributesToXML;
const getPrefix = (depth, options, isAttribute) => {
    let out = "";
    if (!options["minify"]) {
        out = `\n`;
        if (options["usePrefix"]) {
            out = `${out}${options["prefixStart"]}`;
            for (let i of Array.from({ length: depth }, (value, index) => index)) {
                out = `${out}${options["prefixCharacter"]}`;
            }
        }
        if (isAttribute) {
            out = `${out}${options["attributePrefix"]}`;
        }
    }
    return out;
};
exports.getPrefix = getPrefix;
