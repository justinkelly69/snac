import React from "react"
import {
    SNACItem,
    SNACElement,
    SNACText,
    SNACCDATA,
    SNACComment,
    SNACPINode,
    XMLOutOpts,
} from '../snac/types'
import { Tag } from './element'
import { Text } from './text'
import { CDATA } from './cdata'
import { Comment } from './comment'
import { PI } from './pi'
import { Fragment } from 'react'

export const XMLContext = React.createContext<XMLOutOpts>({
    treeMode: false,
})

export const XMLOut = (props: {
    snac: SNACItem[],
    treeMode: boolean,
}): JSX.Element => {

    const providerValue  = {
        treeMode: props.treeMode
    }

    return (
        <XMLContext.Provider value={providerValue}>
            <Children
                snac={props.snac}
                path={[]}
                treeMode={props.treeMode}
            />
        </XMLContext.Provider>
    )
}
const Children = (props: {
    snac: SNACItem[],
    path: number[],
    treeMode: boolean,
}): JSX.Element => {

    return (
        <span className='xml-out'>
            {props.snac.map((s, i) => {
                const newPath = [...props.path, i]

                return (
                    <Fragment key={i}>
                        {s.hasOwnProperty("N") &&
                            <Tag
                                node={props.snac[i] as SNACElement}
                                path={newPath}
                                getChildren={() => Children({
                                    ...props,
                                    path: newPath,
                                    snac: (props.snac[i] as SNACElement).C,
                                })}
                            />
                        }
                        {s.hasOwnProperty("T") &&
                            <Text
                                node={props.snac[i] as SNACText}
                                path={newPath}
                            />
                        }
                        {s.hasOwnProperty("D") &&
                            <CDATA
                                node={props.snac[i] as SNACCDATA}
                                path={newPath}
                            />
                        }
                        {s.hasOwnProperty("M") &&
                            <Comment
                                node={props.snac[i] as SNACComment}
                                path={newPath}
                            />
                        }
                        {s.hasOwnProperty("L") &&
                            <PI
                                node={props.snac[i] as SNACPINode}
                                path={newPath}
                            />
                        }
                    </Fragment>
                )
            })}
        </span>
    )
}

export default XMLOut
