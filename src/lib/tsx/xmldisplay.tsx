import React from "react"
import { XMLOut } from "./xmlout"
import {
    SNACItem,
    SwitchModes
} from "../snac/types"
import { useState } from "react"
import { XMLModesContext } from "../snac/contexts"

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

    //console.log(paths)
    console.log(xmlModes.mode)

    return (
        <XMLModesContext.Provider value={xmlModes}>
            <div className="xml-display">
                <div className="xml-display-top-bar"></div>
                <XMLOut
                    snac={props.snac}
                    treeMode={true}
                    isSelected={false}
                    side='left'
                />
                {xmlModes.mode === 'VIEW_MODE' &&
                    <XMLOut
                        snac={props.snac}
                        treeMode={false}
                        isSelected={true}
                        side='right'
                    />
                }
                {xmlModes.mode === 'SELECT_MODE' &&
                    <XMLOut
                        snac={props.snac}
                        treeMode={false}
                        isSelected={false}
                        side='right'
                    />
                }
            </div>
        </XMLModesContext.Provider>
    )
}