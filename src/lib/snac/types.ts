//import React from 'react'

export enum SwitchStates { 'ON', 'OFF', 'HIDDEN' }
export type SwitchModes = 'VIEW_MODE' | 'EDIT_MODE' | 'INSERT_MODE'

export type XMLOpts = {
    prefix_showPrefix: boolean,
    prefix_newLine: string,
    prefix_char: string,
    prefix_spaceBefore: string,
    prefix_spaceAfter: string,
    prefix_attributePrefix: string,

    xml_selfCloseTags: boolean,
    xml_trimText: boolean,
    xml_allowComments: boolean,
    xml_allowPIs: boolean,
}

export type OnOffHiddenChars = {
    on: string,
    off: string,
    hidden: string,
}

export type SNACOpts = {
    prefix_showPrefix: boolean,
    prefix_newLine: string,
    prefix_startChar: string,
    prefix_charOn: string,
    prefix_charOff: string,
    prefix_spaceBefore: string,
    prefix_spaceAfter: string,
    prefix_attributePrefix: string,

    switch_selectOn: string,
    switch_selectOff: string,
    switch_selectHide: string,
    switch_attributesOpen: string,
    switch_attributesClose: string,
    switch_attributesHide: string,
    switch_elementOpen: string,
    switch_elementClose: string,
    switch_elementHide: string,
    switch_selectChars: OnOffHiddenChars,
    switch_attributeChars: OnOffHiddenChars,
    switch_elementChars: OnOffHiddenChars,

    xml_showSelected: boolean,
    xml_showAttributesOpen: boolean,
    xml_showChildrenOpen: boolean,
    xml_selfCloseTags: boolean,
    xml_trimText: boolean,
    xml_trimTextLength: number,
    xml_trimCDATA: boolean,
    xml_trimCDATALength: number,
    xml_trimComment: boolean,
    xml_trimCommentLength: number,
    xml_trimPIBody: boolean,
    xml_trimPIBodyLength: number,
    xml_showCloseTags: boolean,
    xml_allowComments: boolean,
    xml_allowPIs: boolean,
    xml_ellipsis: string,

    styles_attributeGridRowWidth: string,
    styles_attributeGridButtonWidth: string,

    pi_languages: string[][],
}

export interface SNAC2XMLFuncs {
    openTag: (
        path: number[],
        elementName: string,
        attrs: string
    ) => string,

    children: (
        children: string
    ) => string,

    closeTag: (
        path: number[],
        elementName: string
    ) => string,

    emptyTag: (
        path: number[],
        elementName: string,
        attrs: string
    ) => string,

    text: (
        path: number[],
        text: string
    ) => string,

    cdata: (
        path: number[],
        cdata: string
    ) => string,

    comment: (
        path: number[],
        comment: string
    ) => string,

    pi: (
        path: number[],
        lang: string,
        body: string
    ) => string,

    attribute: (
        path: number[],
        name: string,
        value: string
    ) => string,

    getPrefix: (
        path: number[],
        isAttribute: boolean,
        snacOpts: SNACOpts
    ) => string,
}

export interface SNAC2XMLJSXFuncs {
    Tag: TagJSXType,
    OpenTag: OpenTagJSXType,
    CloseTag: CloseTagJSXType,
    Text: TextJSXType,
    CDATA: CDATAJSXType,
    Comment: CommentJSXType,
    PI: PIJSXType,
    Attributes: AttributesJSXType,
    Prefix: PrefixJSXType,
}

export type ChildrenJSXType = TagJSXType | TextJSXType | CDATAJSXType | CommentJSXType | PIJSXType

export type TagJSXType = {
    (props: {
        root: SNACItem[],
        node: SNACElement,
        path: number[],
        snacOpts: SNACOpts,
        getChildren: Function,
        funcs: { [name: string]: any }
    })//: JSX.Element
}

export type OpenTagJSXType = {
    (props: {
        root: SNACItem[],
        node: SNACElement
        path: number[],
        isEmpty: boolean,
        snacOpts: SNACOpts,
        isSelected: boolean,
        setSelected: Function,
        isAttributesOpen: boolean,
        setAttributesOpen: Function
        isChildrenOpen: boolean,
        setChildrenOpen: Function
    }): JSX.Element
}

export type CloseTagJSXType = {
    (props: {
        root: SNACItem[],
        node: SNACElement,
        path: number[],
        isEmpty: boolean,
        isSelected: boolean,
        setSelected: Function
        isChildrenOpen: boolean,
        setChildrenOpen: Function
        snacOpts: SNACOpts,
    }): JSX.Element | null
}

export type TextJSXType = {
    (props: {
        root: SNACItem[],
        node: SNACText,
        path: number[],
        showSelected: boolean,
        showOpen: boolean,
        snacOpts: SNACOpts,
    })//: JSX.Element
}
export type CDATAJSXType = {
    (props: {
        root: SNACItem[],
        node: SNACCDATA,
        path: number[],
        showSelected: boolean,
        showOpen: boolean,
        snacOpts: SNACOpts,
    })//: JSX.Element
}
export type CommentJSXType = {
    (props: {
        root: SNACItem[],
        node: SNACComment,
        path: number[],
        showSelected: boolean,
        showOpen: boolean,
        snacOpts: SNACOpts,
    })//: JSX.Element
}
export type PIJSXType = {
    (props: {
        root: SNACItem[],
        node: SNACPINode,
        path: number[],
        showSelected: boolean,
        showOpen: boolean,
        snacOpts: SNACOpts,
    })//: JSX.Element
}
export type AttributesJSXType = {
    (props: {
        path: number[],
        attributes: AttributesType,
        snacOpts: SNACOpts
    }): JSX.Element | null
}

export type AttributeJSXType = {
    (props: {
        path: number[],
        name: string,
        value: string,
        snacOpts: SNACOpts
    }): JSX.Element | null
}

export type PrefixJSXType = {
    (props: {
        path: number[],
        snacOpts: SNACOpts
    }): JSX.Element | null
}

export interface NamespaceAttributesType {
    X: NamespaceType,
    A: AttributesType,
}

export interface NamespaceType {
    [name: string]: string
}

export interface AttributesType {
    [name: string]: AttributeType
}

export interface AttributeType {
    [name: string]: string
}

export interface EditAttributesType {
    [name: string]: EditAttributeType
}

export interface EditAttributeType {
    [name: string]: {
        V: string,
        d: boolean,
        q: boolean,
    }
}

export interface EditAttributesActionType {
    type: string,
    payload: EditAttributesPayloadType,
}

export interface EditAttributesPayloadType {
    newNS?: string,
    newName?: string,
    newValue?: string,
}

export interface EditAttributesNSNameType {
    ns: string,
    name: string,
}

export type SNACNamesNode = {
    S: string,
    N: string,
}

export interface SNACElement {
    X?: NamespaceType,
    S: string,
    N: string,
    A: AttributesType,
    C: SNACItem[],
}

export interface SNACText {
    T: string
}

export interface SNACCDATA {
    D: string
}

export interface SNACComment {
    M: string
}

export interface SNACPINode {
    L: string,
    B: string
}

export type SNACItem =
    SNACElement |
    SNACText |
    SNACCDATA |
    SNACComment |
    SNACPINode

export interface AttributesXMLhasChildrenType {
    attributes: AttributesType,
    hasChildren: boolean,
    remainder: string
}

export interface AttributeXMLType {
    attributes: AttributesType,
    remainder: string
}

export interface AttributeValueType {
    value: string,
    remainder: string
}

export type QuoteChar = '"' | "'"

