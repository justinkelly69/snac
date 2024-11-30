import { XMLOut } from "./xmlout"
import { XMLModesType, SNACItem, SwitchModes } from "../snac/types"
import { useState } from "react"
import React from "react"

export const XMLModesContext = React.createContext<XMLModesType>({
    path: [],
    setPath: (f: any)=>f,
    paths: [],
    setPaths: (f: any)=>f,
    mode: 'VIEW_MODE',
    setMode: (f: any)=>f,
})

export const XMLDisplay = (props: {
    snac: SNACItem[],
}) => {

    const [path, setPath] = useState<number[]>([])
    const [paths, setPaths] = useState<number[][]>([])
    const [mode, setMode] = useState<SwitchModes>('VIEW_MODE')

    const xmlModes = {
        path: path,
        setPath: setPath,
        paths: paths,
        setPaths: setPaths,
        mode: mode,
        setMode: setMode,
    }

    console.log(paths)

    return (
        <XMLModesContext.Provider value={xmlModes}>
            <div className="xml-display">
                <div className="xml-display-top-bar"></div>
                <div className="xml-display-controls"></div>
                <div className="xml-display-tree">
                    <XMLOut
                        snac={props.snac}
                        treeMode={true}
                    />
                </div>
                <div className="xml-display-xml">
                    <XMLOut
                        snac={props.snac}
                        treeMode={false}
                    />
                </div>
            </div>
        </XMLModesContext.Provider>

    )
}