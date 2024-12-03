import React from "react"
import { SNACItem } from '../snac/types'
import { XMLRWContext } from "../snac/contexts"
import { Children } from './children'

export const XMLOut = (props: {
    snac: SNACItem[],
    treeMode: boolean,
    isSelected: boolean,
    side: string,
}): JSX.Element => {

    const xmlRWValue = {
        treeMode: props.treeMode
    }

    return (
        <XMLRWContext.Provider value={xmlRWValue}>
            <div className={`xml-display-controls-${props.side} xml-controls-area`}>
            <h1>XML Out</h1>
            </div>
            <div className={`xml-display-body-${props.side} xml-body-area`}>
                <Children
                    snac={props.snac}
                    path={[]}
                    isSelected={props.isSelected}
                />
            </div>
        </XMLRWContext.Provider>
    )
}
