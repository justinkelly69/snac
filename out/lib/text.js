"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unEscapePIBody = exports.escapePIBody = exports.testPILang = exports.unEscapeComment = exports.escapeComment = exports.unEscapeCDATA = exports.escapeCDATA = exports.unEscapeHtml = exports.escapeHtml = void 0;
const escapeHtml = (text) => {
    text = text.replace(/&/g, '&amp;');
    text = text.replace(/</g, '&lt;');
    text = text.replace(/>/g, '&gt;');
    text = text.replace(/'/g, '&apos;');
    text = text.replace(/"/g, '&quot;');
    return text;
};
exports.escapeHtml = escapeHtml;
const unEscapeHtml = (text) => {
    text = text.replace(/&amp;/g, '&');
    text = text.replace(/&lt;/g, '<');
    text = text.replace(/&gt;/g, '>');
    text = text.replace(/&apos;/g, '\'');
    text = text.replace(/&quot;/g, '"');
    return text;
};
exports.unEscapeHtml = unEscapeHtml;
const escapeCDATA = (text) => {
    return text.replace(/]]>/g, ']]&gt;');
};
exports.escapeCDATA = escapeCDATA;
const unEscapeCDATA = (text) => {
    return text.replace(/]]&gt;/g, ']]>');
};
exports.unEscapeCDATA = unEscapeCDATA;
const escapeComment = (text) => {
    return text.replace(/--/g, ' - - ');
};
exports.escapeComment = escapeComment;
const unEscapeComment = (text) => {
    return text.replace(/ - - /g, '--');
};
exports.unEscapeComment = unEscapeComment;
const testPILang = (text) => {
    return text.match(/^[a-z]+[0-9]?=?/) ? true : false;
};
exports.testPILang = testPILang;
const escapePIBody = (text) => {
    return text.replace(/\?>/g, '?&gt;');
};
exports.escapePIBody = escapePIBody;
const unEscapePIBody = (text) => {
    return text.replace(/\?&gt;/g, '?>');
};
exports.unEscapePIBody = unEscapePIBody;
