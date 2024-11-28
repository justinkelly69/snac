import { XMLOut } from "./xmlout"
import { SNACItem } from "../snac/types"
import { useState } from "react"

export const XMLDisplay = (props: {
    snac: SNACItem[],
}) => {

    const [paths, setPaths] = useState<number[][]>([])

    return (
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
    )
}