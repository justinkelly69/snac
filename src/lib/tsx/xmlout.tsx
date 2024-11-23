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
    root: SNACItem[],
    snac: SNACItem[],
}) => {

    const [mode, setMode] = useState<SwitchModes>('VIEW_MODE') // 'VIEW_MODE' | 'EDIT_MODE' | 'INSERT_MODE'
    const [editPath, setEditPath] = useState<number[] | null>(null)

    return (
        <Children
            root={props.root}
            snac={props.snac}
            path={[]}
        />
    )
}
const Children = (props: {
    root: SNACItem[],
    snac: SNACItem[],
    path: number[],
}): JSX.Element => {

    return (
        <>
            {props.snac.map((s, i) => {
                const newPath = [...props.path, i]

                return (
                    <Fragment key={i}>
                        {s.hasOwnProperty("N") &&
                            <Tag
                                key={i}
                                root={props.root}
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
                                root={props.root}
                                node={props.snac[i] as SNACText}
                                path={newPath}
                                showSelected={true}
                            />
                        }
                        {s.hasOwnProperty("D") &&
                            <CDATA
                                key={i}
                                root={props.root}
                                node={props.snac[i] as SNACCDATA}
                                path={newPath}
                                showSelected={true}
                            />
                        }
                        {s.hasOwnProperty("M") &&
                            <Comment
                                key={i}
                                root={props.root}
                                node={props.snac[i] as SNACComment}
                                path={newPath}
                                showSelected={true}
                            />
                        }
                        {s.hasOwnProperty("L") &&
                            <PI
                                key={i}
                                root={props.root}
                                node={props.snac[i] as SNACPINode}
                                path={newPath}
                                showSelected={true}
                            />
                        }
                    </Fragment>
                )
            })}
        </>
    )
}

export default XMLOut
