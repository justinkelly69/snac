import {
    EditAttributesType, AttributesType, SelectedAttributeType
} from "./types"

export const snac2EditAttributes = (
    attributes: AttributesType
): EditAttributesType => {
    const editAttributes: EditAttributesType = {}
    for (const ns of Object.keys(attributes)) {
        editAttributes[ns] = {}
        for (const name of Object.keys(attributes[ns])) {
            editAttributes[ns][name] = {
                V: attributes[ns][name],
                d: false,
                q: false,
            }
        }
    }
    return editAttributes
}

export const editAttributes2snac = (
    editAttributes: EditAttributesType
): AttributesType => {
    const attributes1: AttributesType = {}
    for (const ns of Object.keys(editAttributes)) {
        attributes1[ns] = {}
        for (const name of Object.keys(editAttributes[ns])) {
            if (!editAttributes[ns][name]['d']) {
                attributes1[ns][name] = editAttributes[ns][name]['V']
            }
        }
    }
    const attributes2 = {}
    for(const ns of Object.keys(attributes1)) {
        if(Object.keys(attributes1[ns]).length === 0){
            continue
        }
        attributes2[ns] = attributes1[ns]
    }
    return attributes2
}

export const attributeKeys = (editAttributes: EditAttributesType): string[][] => {
    const out: string[][] = []
    Object.keys(editAttributes).map((ns, i) => {
        return Object.keys(editAttributes[ns]).map((name, j) => {
            return out.push([ns, name])
        })
    })
    return out
}

export const attributeGetNumRows = (state: EditAttributesType): number => {
    let numRows = 0
    for (const key of Object.keys(state)) {
        numRows += Object.keys(state[key]).length
    }
    return numRows
}

export const rowValue = (
    editAttributes: EditAttributesType,
    ns: string,
    name: string,
): string => {
    return editAttributes[ns][name]['V']
}

export const selectAttribute = (
    editAttributes: EditAttributesType,
    selectedAttribute: SelectedAttributeType,
): EditAttributesType => {

    const newAttrbutes: EditAttributesType = {}

    for (const ns of Object.keys(editAttributes)) {
        if (!newAttrbutes[ns]) {
            newAttrbutes[ns] = {}
        }
        for (const name of Object.keys(editAttributes[ns])) {
            if (
                selectedAttribute.ns === ns &&
                selectedAttribute.name === name &&
                !editAttributes[ns][name].d
            ) {
                newAttrbutes[ns][name] = {
                    ...editAttributes[ns][name],
                    q: !editAttributes[ns][name].q,
                }
            }
            else {
                newAttrbutes[ns][name] = {
                    ...editAttributes[ns][name],
                    q: false,
                }
            }
        }
    }
    return newAttrbutes
}

export const rowSelected = (
    editAttributes: EditAttributesType,
    ns: string,
    name: string,
) => {
    return editAttributes[ns][name].q
}

export const deleteAttribute = (
    editAttributes: EditAttributesType,
    selectedAttribute: SelectedAttributeType,
): EditAttributesType => {

    const newAttributes: EditAttributesType = {}

    for (const ns of Object.keys(editAttributes)) {
        if (!newAttributes[ns]) {
            newAttributes[ns] = {}
        }
        for (const name of Object.keys(editAttributes[ns])) {
            if (selectedAttribute['ns'] === ns && selectedAttribute['name'] === name) {
                newAttributes[ns][name] = {
                    ...editAttributes[ns][name],
                    d: !editAttributes[ns][name].d,
                }
            }
            else {
                newAttributes[ns][name] = editAttributes[ns][name]
            }
        }
    }
    return newAttributes
}

export const rowDeleted = (
    editAttributes: EditAttributesType,
    ns: string,
    name: string,
) => {
    return editAttributes[ns][name].d
}

export const saveAttribute = (
    editAttributes: EditAttributesType,
    selectedAttribute: SelectedAttributeType,
): EditAttributesType => {

    const newAttributes: EditAttributesType = {}

    for (const ns of Object.keys(editAttributes)) {
        if (!newAttributes[ns]) {
            newAttributes[ns] = {}
        }
        for (const name of Object.keys(editAttributes[ns])) {
            if (selectedAttribute['ns'] === ns && selectedAttribute['name'] === name && selectedAttribute['value']) {
                newAttributes[ns][name] = {
                    V: selectedAttribute['value'],
                    d: false,
                    q: false,
                }
            }
            else {
                newAttributes[ns][name] = editAttributes[ns][name]
            }
        }
    }
    return newAttributes
}

export const cancelAttribute = (
    editAttributes: EditAttributesType,
): EditAttributesType => {

    const newAttributes: EditAttributesType = {}

    for (const ns of Object.keys(editAttributes)) {
        if (!newAttributes[ns]) {
            newAttributes[ns] = {}
        }
        for (const name of Object.keys(editAttributes[ns])) {
            newAttributes[ns][name] = {
                ...editAttributes[ns][name],
                q: false,
            }
        }
    }
    return newAttributes
}

export const newAttribute = (
    editAttributes: EditAttributesType,
    selectedAttribute: SelectedAttributeType,
): EditAttributesType => {

    const newAttributes: EditAttributesType = {}

    for (const ns of Object.keys(editAttributes)) {
        if (!newAttributes[ns]) {
            newAttributes[ns] = {}
        }
        for (const name of Object.keys(editAttributes[ns])) {
            if (selectedAttribute['ns'] === ns && selectedAttribute['name'] === name) {
                continue
            }
            else {
                newAttributes[ns][name] = editAttributes[ns][name]
            }
        }
    }

    if (selectedAttribute['ns'] && selectedAttribute['name'] && selectedAttribute['value']) {
        if (!newAttributes[selectedAttribute['ns']]) {
            newAttributes[selectedAttribute['ns']] = {}
        }
        newAttributes[selectedAttribute['ns']][selectedAttribute['name']] = {
            V: selectedAttribute['value'],
            d: false,
            q: false,
        }
    }
    return newAttributes
}
