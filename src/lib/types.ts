export type QuoteChar = '"' | "'"

export type AttributesType = {
    [name: string]: {
        [name: string]: string
    }
}

export type AttributesXMLhasChildrenType = {
    attributes: AttributesType,
    hasChildren: boolean,
    xml: string
}

export type AttributeXMLType = {
    attributes: AttributesType,
    xml: string
}

export type AttributeValueType = {
    value: string,
    xml: string
}
export type SNACNSNode = {
    S: string,
    N: string,
}

export interface SNACNode {
    a: boolean,
    o: boolean,
    q: boolean
}

export interface SNACElement extends SNACNode {
    S: string,
    N: string,
    A: AttributesType,
    C: SNACItem[]
}

export interface SNACText extends SNACNode {
    T: string
}

export interface SNACCDATA extends SNACNode {
    D: string
}

export interface SNACComment extends SNACNode {
    M: string
}

export interface SNACPINode extends SNACNode {
    L: string,
    B: string
}

export type SNACItem = SNACElement | SNACText | SNACCDATA | SNACComment | SNACPINode

