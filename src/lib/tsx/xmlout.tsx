import {
    SNACItem,
    SNACElement,
    SNACText,
    SNACCDATA,
    SNACComment,
    SNACPINode,
    SNACOpts,
} from '../snac/types'

import { Tag } from './element';
import { Text } from './text';
import { CDATA } from './cdata';
import { Comment } from './comment';
import { PI } from './pi';
import { Fragment } from 'react';

const XMLOut = (props: {
    root: SNACItem[],
    snac: SNACItem[],
    snacOpts: SNACOpts
}) =>
    <Children
        root={props.root}
        snac={props.snac}
        path={[]}
        snacOpts={props.snacOpts}
    />

const Children = (props: {
    root: SNACItem[],
    snac: SNACItem[],
    path: number[],
    snacOpts: SNACOpts
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
                                snacOpts={props.snacOpts}
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
                                showOpen={true}
                                snacOpts={props.snacOpts}
                            />
                        }
                        {s.hasOwnProperty("D") &&
                            <CDATA
                                key={i}
                                root={props.root}
                                node={props.snac[i] as SNACCDATA}
                                path={newPath}
                                showSelected={true}
                                showOpen={true}
                                snacOpts={props.snacOpts}
                            />
                        }
                        {s.hasOwnProperty("M") &&
                            <Comment
                                key={i}
                                root={props.root}
                                node={props.snac[i] as SNACComment}
                                path={newPath}
                                showSelected={true}
                                showOpen={true}
                                snacOpts={props.snacOpts}
                            />
                        }
                        {s.hasOwnProperty("L") &&
                            <PI
                                key={i}
                                root={props.root}
                                node={props.snac[i] as SNACPINode}
                                path={newPath}
                                showSelected={true}
                                showOpen={true}
                                snacOpts={props.snacOpts}
                            />
                        }
                    </Fragment>
                )
            })}
        </>
    )
}

export default XMLOut
