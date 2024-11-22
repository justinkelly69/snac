import {
    EditAttributesType,
    AttributesType,
    EditAttributesPayloadType,
    EditAttributesActionType,
    EditAttributesNSNameType
} from "./types"

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
                if (!editAttributes[ns][name]['d']) {
                    attributes[ns][name] = editAttributes[ns][name]['V']
                }
            }
        }
    }

    return attributes
}

export const attributesEditReducer = (
    state: EditAttributesType,
    action: EditAttributesActionType
): EditAttributesType => {

    switch (action.type) {
        case "selectAttribute":
            return selectAttribute(state, action.payload)

        case "saveAttribute":
            return saveAttribute(state, action.payload)

        case "cancelAttribute":
            return cancelAttribute(state)

        case "deleteAttribute":
            return deleteAttribute(state, action.payload)

        case "newAttribute":
            return newAttribute(state, action.payload)

        default:
            return state
    }
}

export const attributeGetNumRows = (state: EditAttributesType): number => {

    let numRows = 0
    for (const key of Object.keys(state)) {
        numRows += Object.keys(state[key]).length
    }
    return numRows
}

export const attributeGetValue = (
    state: EditAttributesType,
    ns: string,
    name: string,
): string => {
    
    return state[ns][name]['V']
}

export const setSelectedAttribute = (
    setMode: Function,
    setSelected: Function,
    isSelected: boolean,
    isDeleted: boolean,
    dispatch: Function,
    ns: string,
    name: string,
) => {

    if (!isDeleted) {
        if (isSelected) {
            setSelected({
                ns: '#',
                name: '#',
            })
            setMode('LIST_MODE')
        }
        else {
            setSelected({
                ns: ns,
                name: name,
            })
            setMode('EDIT_MODE')
        }
        dispatch({
            type: "selectAttribute",
            payload: {
                newNS: ns,
                newName: name,
            }
        })
    }
}

export const attributeIsSelected = (
    selected: EditAttributesNSNameType,
    ns: string,
    name: string,
): boolean => {
    return selected.ns === ns && selected.name === name
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

export const saveAttributes = (newAttrbutes: EditAttributesType) => {
}

export const setSaveAttribute = (
    setMode: Function,
    setSelected: Function,
    dispatch: Function,
    ns: string,
    name: string,
    value: string,
) => {
    dispatch({
        type: "saveAttribute",
        payload: {
            newNS: ns,
            newName: name,
            newValue: value,
        }
    })
    setSelected({
        ns: '#',
        name: '#',
    })
    setMode('LIST_MODE')
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

export const setCancelAttribute = (
    setMode: Function,
    setSelected: Function,
    dispatch: Function,
    ns: string,
    name: string,
    oldValue: string,
) => {
    dispatch({
        type: "cancelAttribute",
        payload: {
            newNS: ns,
            newName: name,
            value: oldValue,
        }
    })
    setSelected({
        ns: '#',
        name: '#',
    })
    setMode('LIST_MODE')
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

export const attributeIsDeleted = (
    state: EditAttributesType,
    ns: string,
    name: string,
): boolean => {

    return state[ns][name]['d']
}

export const setDeletedAttribute = (
    dispatch: Function,
    ns: string,
    name: string,
) => {
    dispatch({
        type: "deleteAttribute",
        payload: {
            newNS: ns,
            newName: name,
        }
    })
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

export const setNewAttribute = (
    dispatch: Function,
    ns: string,
    name: string,
    value: string,
) => {
    dispatch({
        type: "newAttribute",
        payload: {
            newNS: ns,
            newName: name,
            newValue: value,
        }
    })
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