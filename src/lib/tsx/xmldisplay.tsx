import React from "react"
import { XMLOut } from "./xmlout"
import {
    SNACCDATA,
    SNACComment,
    SNACItem,
    SNACPINode,
    SNACText,
    SwitchModes
} from "../snac/types"
import { useState } from "react"
import { XMLModesContext } from "../snac/contexts"
import { TextEdit } from "./textedit"
import { CDATAEdit } from "./cdataedit"
import { CommentEdit } from "./commentedit"
import { PIEdit } from "./piedit"
import { Selection } from "./selection"

export const XMLDisplay = (props: {
    snac: SNACItem[],
    node?: SNACItem,
    path?: number[],
}) => {

    const [path, setPath] = useState<number[]>([])
    const [paths, setPaths] = useState<number[][]>([])
    const [mode, setMode] = useState<SwitchModes>('VIEW_MODE')
    const [node, setNode] = useState<SNACItem | undefined>(props.node)

    const xmlModes = {
        node: node,
        setNode: setNode,
        path: path,
        setPath: setPath,
        paths: paths,
        setPaths: setPaths,
        mode: mode,
        setMode: setMode,
    }

    //console.log(paths)
    //console.log(xmlModes.mode)

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
                    <Selection
                        snac={props.snac}
                        treeMode={false}
                        isSelected={false}
                        side='right'
                    />
                }
                {xmlModes.mode === 'TEXT_EDIT_MODE' &&
                    <TextEdit
                        node={node as SNACText}
                        path={path || []}
                        isSelected={false}
                    />
                }
                {xmlModes.mode === 'CDATA_EDIT_MODE' &&
                    <CDATAEdit
                        node={node as SNACCDATA}
                        path={path || []}
                        isSelected={false}
                    />
                }
                {xmlModes.mode === 'COMMENT_EDIT_MODE' &&
                    <CommentEdit
                        node={node as SNACComment}
                        path={path || []}
                        isSelected={false}
                    />
                }
                {xmlModes.mode === 'PI_EDIT_MODE' &&
                    <PIEdit
                        node={node as SNACPINode}
                        path={path || []}
                        isSelected={false}
                    />
                }
            </div>
        </XMLModesContext.Provider>
    )
}