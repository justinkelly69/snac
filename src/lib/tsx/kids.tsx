import { Fragment } from "react"
import {
    SNACItem, SNACElement, SNACText,
    SNACCDATA, SNACComment, SNACPINode,
} from '../snac/types'
import { Element } from './element'
import { Text } from './text'
import { CDATA } from './cdata'
import { Comment } from './comment'
import { PI } from './pi'

export const Kids = (props: {
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
