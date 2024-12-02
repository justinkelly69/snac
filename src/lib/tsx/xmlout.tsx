import React from "react"
import {
    SNACItem,
    SNACElement,
    SNACText,
    SNACCDATA,
    SNACComment,
    SNACPINode,
} from '../snac/types'
import { Element } from './element'
import { Text } from './text'
import { CDATA } from './cdata'
import { Comment } from './comment'
import { PI } from './pi'
import { Fragment } from 'react'
import { XMLRWContext } from "../snac/contexts"

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

export const Children = (props: {
    snac: SNACItem[],
    path: number[],
    isSelected: boolean,
}): JSX.Element => {

    return (
        <span className='xml-out'>
            {props.snac.map((s, i) => {
                const newPath = [...props.path, i]

                return (
                    <Fragment key={i}>
                        {s.hasOwnProperty("N") &&
                            <Element
                                node={props.snac[i] as SNACElement}
                                path={newPath}
                                isSelected={props.isSelected}
                            />
                        }
                        {s.hasOwnProperty("T") &&
                            <Text
                                node={props.snac[i] as SNACText}
                                path={newPath}
                                isSelected={props.isSelected}
                            />
                        }
                        {s.hasOwnProperty("D") &&
                            <CDATA
                                node={props.snac[i] as SNACCDATA}
                                path={newPath}
                                isSelected={props.isSelected}
                            />
                        }
                        {s.hasOwnProperty("M") &&
                            <Comment
                                node={props.snac[i] as SNACComment}
                                path={newPath}
                                isSelected={props.isSelected}
                            />
                        }
                        {s.hasOwnProperty("L") &&
                            <PI
                                node={props.snac[i] as SNACPINode}
                                path={newPath}
                                isSelected={props.isSelected}
                            />
                        }
                    </Fragment>
                )
            })}
        </span>
    )
}

export default XMLOut
