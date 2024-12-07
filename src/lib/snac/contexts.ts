import React from "react";
import {
    XMLAttributesEditType,
    XMLAttributeRowType,
    XMLModesType,
    XMLRWType,
    XMLTagOpenCloseType,
} from "./types";
import { addPath } from "./paths";

export const XMLRWContext =
    React.createContext<XMLRWType>({
        treeMode: false,
    })

export const XMLModesContext =
    React.createContext<XMLModesType>({
        node: undefined,
        setNode: (f: any) => f,
        path: [],
        setPath: (f: any) => f,
        paths: [],
        setPaths: (f: any) => f,
        mode: 'VIEW_MODE',
        setMode: (f: any) => f,
    })

export const XMLTagOpenCloseContext =
    React.createContext<XMLTagOpenCloseType>({
        isEmpty: false,
        isSelected: false,
        isAttributesOpen: false,
        setAttributesOpen: (f: any) => f,
        isChildrenOpen: false,
        setChildrenOpen: (f: any) => f,
    })

export const XMLAttributeRowContext =
    React.createContext<XMLAttributeRowType>({
        attMode: '',
        setAttMode: (f: any) => f,
        numRows: 0, 
        setNumRows: (f: any) => f,
    })

export const XMLAttributesEditContext =
    React.createContext<XMLAttributesEditType>({
        editAttributes: {},
        setEditAttributes: (f: any) => f,
    })

export const insertPath = (
    xmlModesContext: XMLModesType,
    path: number[],
) => {
    const newPaths = addPath(
        xmlModesContext.paths,
        path,
    )
    xmlModesContext.setPaths(newPaths)

    if (newPaths.length > 0) {
        xmlModesContext.setMode('SELECT_MODE')
    }
    else {
        clearPaths(xmlModesContext)
    }
}

export const clearPaths = (
    xmlModesContext: XMLModesType,
) => {
    xmlModesContext.setPaths([])
    xmlModesContext.setMode('VIEW_MODE')
}
