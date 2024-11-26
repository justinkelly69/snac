import {
    SNACItem,
    SNACElement,
    SNACText,
    SNACCDATA,
    SNACComment,
    SNACPINode,
    SwitchModes,
} from '../snac/types'

import { Tag } from './element';
import { Text } from './text';
import { CDATA } from './cdata';
import { Comment } from './comment';
import { PI } from './pi';
import { Fragment, useState } from 'react';

const XMLOut = (props: {
    snac: SNACItem[],
}): JSX.Element => {

    const [mode, setMode] = useState<SwitchModes>('VIEW_MODE') // 'VIEW_MODE' | 'EDIT_MODE' | 'INSERT_MODE'
    const [editPath, setEditPath] = useState<number[] | null>(null)

    return (
        <Children
            snac={props.snac}
            path={[]}
        />
    )
}
const Children = (props: {
    snac: SNACItem[],
    path: number[],
}): JSX.Element => {

    return (
        <span className='xml-out'>
            {props.snac.map((s, i) => {
                const newPath = [...props.path, i]

                return (
                    <Fragment key={i}>
                        {s.hasOwnProperty("N") &&
                            <Tag
                                key={i}
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
                                key={i}
                                node={props.snac[i] as SNACText}
                                path={newPath}
                                showSelected={true}
                            />
                        }
                        {s.hasOwnProperty("D") &&
                            <CDATA
                                key={i}
                                node={props.snac[i] as SNACCDATA}
                                path={newPath}
                                showSelected={true}
                            />
                        }
                        {s.hasOwnProperty("M") &&
                            <Comment
                                key={i}
                                node={props.snac[i] as SNACComment}
                                path={newPath}
                                showSelected={true}
                            />
                        }
                        {s.hasOwnProperty("L") &&
                            <PI
                                key={i}
                                node={props.snac[i] as SNACPINode}
                                path={newPath}
                                showSelected={true}
                            />
                        }
                    </Fragment>
                )
            })}
        </span>
    )
}

export default XMLOut
