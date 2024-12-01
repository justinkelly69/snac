import React from "react";
import {
    XMLAttributesOpenCloseType,
    XMLAttributesTableType,
    XMLModesType,
    XMLRWType,
    XMLTagOpenCloseType
} from "./types";

export const XMLRWContext =
    React.createContext<XMLRWType>({
        treeMode: false,
    })


export const XMLModesContext =
    React.createContext<XMLModesType>({
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
        //setSelected: (f: any) => f,
        isAttributesOpen: false,
        setAttributesOpen: (f: any) => f,
        isChildrenOpen: false,
        setChildrenOpen: (f: any) => f,
    })

export const XMLAttributesTableContext =
    React.createContext<XMLAttributesTableType>({
        ns: '',
        name: '',
        value: '',
        dispatch: (f: any) => f,
        isDeleted: false,
        isSelected: false,
        setSelected: (f: any) => f,
    })

export const XMLAttributesOpenCloseContext =
    React.createContext<XMLAttributesOpenCloseType>({
        setAttributes: (f: any) => f,
        editAttributes: false,
        numRows: 0,
        setNumRows: (f: any) => f,
    })
