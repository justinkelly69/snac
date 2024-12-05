//import React from 'react'

export enum SwitchStates { 'ON', 'OFF', 'HIDDEN' }
export type SwitchModes = 'VIEW_MODE' | 'EDIT_MODE' | 'SELECT_MODE' | 'INSERT_MODE' | 'LIST_MODE' |
    'ELEMENT_EDIT_MODE' | 'TEXT_EDIT_MODE' | 'CDATA_EDIT_MODE' | 'COMMENT_EDIT_MODE' | 'PI_EDIT_MODE'

export type XMLRWType = {
    treeMode: boolean
}

export type XMLModesType = {
    node?: SNACItem,
    setNode: Function,
    path: number[],
    setPath: Function,
    paths: number[][],
    setPaths: Function,
    mode: SwitchModes,
    setMode: Function,
}

export type XMLTagOpenCloseType = {
    isEmpty: boolean,
    isSelected: boolean,
    isAttributesOpen: boolean,
    setAttributesOpen: Function,
    isChildrenOpen: boolean,
    setChildrenOpen: Function,
}

export type XMLAttributesOpenCloseType = {
    setAttributes: Function,
    editAttributes: boolean,
    numRows: number,
    setNumRows: Function,
}

export type XMLAttributesTableType = {
    ns: string
    name: string
    value: string
    dispatch: Function
    isDeleted: boolean
    isSelected: boolean
    setSelected: Function
}

export type XMLAttributesStoreType = {
    store: EditAttributesType
    dispatch: React.Dispatch<EditAttributesActionType>
}


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

export type SNACElement = {
    X?: NamespaceType,
    S: string,
    N: string,
    A: AttributesType,
    C: SNACItem[],
}

export type SNACText = {
    T: string,
}

export type SNACCDATA = {
    D: string,
}

export type SNACComment = {
    M: string,
}

export type SNACPINode = {
    L: string,
    B: string,
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

