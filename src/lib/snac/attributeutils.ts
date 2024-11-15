import { EditAttributesType, AttributesType } from "./types"

export const snac2EditAttributes = (
    attributes: AttributesType
): EditAttributesType => {
    const editAttributes: EditAttributesType = {}

    for (const ns of Object.keys(attributes)) {
        if (!editAttributes[ns]) {
            editAttributes[ns] = {}
        }
        for (const name of Object.keys(attributes[ns])) {
            if (!editAttributes[ns][name]) {
                editAttributes[ns][name] = {
                    V: attributes[ns][name],
                    d: false
                }
            }
        }
    }

    return editAttributes
}

export const editAttributes2snac = (
    editAttributes: EditAttributesType
): AttributesType => {
    const attributes: AttributesType = {}

    for (const ns of Object.keys(editAttributes)) {
        if (!attributes[ns]) {
            attributes[ns] = {}
        }
        for (const name of Object.keys(editAttributes[ns])) {
            if (!attributes[ns][name]) {
                attributes[ns][name] = editAttributes[ns][name]['V']
            }
        }
    }

    return attributes
}

export const selectAttribute = (
    editAttributes: EditAttributesType,
    ns: string,
    name: string
): EditAttributesType => {
    const newAttrbutes: EditAttributesType = {}

    return newAttrbutes
}

export const updateAttribute = (
    editAttributes: EditAttributesType,
    ns: string,
    name: string
): EditAttributesType => {
    const newAttrbutes: EditAttributesType = {}

    return newAttrbutes
}

export const deleteAttribute = (
    editAttributes: EditAttributesType,
    ns: string,
    name: string
): EditAttributesType => {
    const newAttrbutes: EditAttributesType = {}

    return newAttrbutes
}

export const newAttribute = (
    editAttributes: EditAttributesType,
    ns: string,
    name: string
): EditAttributesType => {
    const newAttrbutes: EditAttributesType = {}

    return newAttrbutes
}