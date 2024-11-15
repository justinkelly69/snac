import { EditAttributesType, AttributesType, EditAttributesPayloadType } from "./types"

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
                    d: false,
                    q: false,
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
    state: EditAttributesType,
    payload: EditAttributesPayloadType,
): EditAttributesType => {
    const newAttrbutes: EditAttributesType = {}

    for (const ns of Object.keys(state)) {
        if (!newAttrbutes[ns]) {
            newAttrbutes[ns] = {}
        }
        for (const name of Object.keys(state[ns])) {
            if (
                payload.newNS === ns &&
                payload.newName === name &&
                !state[ns][name].d
            ) {
                newAttrbutes[ns][name] = {
                    ...state[ns][name],
                    q: !state[ns][name].q,
                }
            }
            else {
                newAttrbutes[ns][name] = {
                    ...state[ns][name],
                    q: false,
                }
            }
        }
    }

    return newAttrbutes
}

export const saveAttribute = (
    state: EditAttributesType,
    payload: EditAttributesPayloadType,
): EditAttributesType => {

    const newAttrbutes: EditAttributesType = {}

    for (const ns of Object.keys(state)) {
        if (!newAttrbutes[ns]) {
            newAttrbutes[ns] = {}
        }
        for (const name of Object.keys(state[ns])) {
            if (payload.newNS === ns && payload.newName === name && payload.newValue) {
                newAttrbutes[ns][name] = {
                    V: payload.newValue,
                    d: false,
                    q: false,
                }
            }
            else {
                newAttrbutes[ns][name] = state[ns][name]
            }
        }
    }

    return newAttrbutes
}

export const cancelAttribute = (
    state: EditAttributesType,
): EditAttributesType => {

    const newAttrbutes: EditAttributesType = {}

    for (const ns of Object.keys(state)) {
        if (!newAttrbutes[ns]) {
            newAttrbutes[ns] = {}
        }
        for (const name of Object.keys(state[ns])) {
            newAttrbutes[ns][name] = {
                ...state[ns][name],
                q: false,
            }
        }
    }

    return newAttrbutes
}

export const deleteAttribute = (
    state: EditAttributesType,
    payload: EditAttributesPayloadType,
): EditAttributesType => {
    const newAttrbutes: EditAttributesType = {}

    for (const ns of Object.keys(state)) {
        if (!newAttrbutes[ns]) {
            newAttrbutes[ns] = {}
        }
        for (const name of Object.keys(state[ns])) {
            if (payload.newNS === ns && payload.newName === name) {
                newAttrbutes[ns][name] = {
                    ...state[ns][name],
                    d: !state[ns][name].d,
                }
            }
            else {
                newAttrbutes[ns][name] = state[ns][name]
            }
        }
    }

    return newAttrbutes
}

export const newAttribute = (
    state: EditAttributesType,
    payload: EditAttributesPayloadType,
): EditAttributesType => {

    const newAttrbutes: EditAttributesType = {}

    for (const ns of Object.keys(state)) {
        if (!newAttrbutes[ns]) {
            newAttrbutes[ns] = {}
        }
        for (const name of Object.keys(state[ns])) {
            if (payload.newNS === ns && payload.newName === name) {
                continue
            }
            else {
                newAttrbutes[ns][name] = state[ns][name]
            }
        }
    }

    if (payload.newNS && payload.newName && payload.newValue) {
        if (!newAttrbutes[payload.newNS]) {
            newAttrbutes[payload.newNS] = {}
        }

        newAttrbutes[payload.newNS][payload.newName] = {
            V: payload.newValue,
            d: false,
            q: false,
        }
    }

    return newAttrbutes
}