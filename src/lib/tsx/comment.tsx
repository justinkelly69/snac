import React, { useContext, useState } from 'react'
import { SNACComment, SwitchStates, XMLModesType, XMLRWType } from '../snac/types'
import { Prefix } from './prefix'
import { escapeComment, trimBody } from '../snac/textutils'
import { snacOpts } from '../snac/opts'
import { ShowHideSwitch } from './showhide'
import { insertPath, XMLModesContext, XMLRWContext } from '../snac/contexts'
import { XmlShow } from './xmlshow'
import { hasPath } from '../snac/paths'
import { CommentCloseBracket, CommentOpenBracket } from './brackets'

export const Comment = (props: {
    node: SNACComment,
    path: number[],
    isSelected: boolean,
}): JSX.Element | null => {

    const xmlRWContext = useContext(XMLRWContext) as XMLRWType
    const xmlModesContext = useContext(XMLModesContext) as XMLModesType

    const [isChildrenOpen, setChildrenOpen] = useState(false)

    const isSelected = hasPath(xmlModesContext.paths, props.path) || props.isSelected
    let selectState = SwitchStates.HIDDEN
    let selectedClassName = 'comment'

    if (xmlRWContext.treeMode) {
        selectState = isSelected ?
            SwitchStates.ON :
            SwitchStates.OFF

        selectedClassName = isSelected && xmlModesContext.paths.length > 0 ?
            'comment selected' :
            'comment'
    }

    const [body, showHide] = trimBody(
        isChildrenOpen,
        props.node.M,
        snacOpts.xml_trimCommentLength,
        snacOpts.xml_ellipsis
    )

    if (xmlRWContext.treeMode) {
        return (
            <div className={selectedClassName}>
                <span>
                    <ShowHideSwitch
                        path={props.path}
                        selected={selectState}
                        chars={snacOpts.switch_selectChars}
                        openClose={() => insertPath(
                            xmlModesContext,
                            props.path,
                        )}
                    />
                    <Prefix path={props.path} />
                    {showHide &&
                        <ShowHideSwitch
                            path={props.path}
                            selected={selectState}
                            chars={snacOpts.switch_elementChars}
                            openClose={() => {
                                if (isChildrenOpen) {
                                    setChildrenOpen(false)
                                }
                                else {
                                    setChildrenOpen(true)

                                }
                            }}
                        />
                    }
                    {' '}
                    <CommentOpenBracket />
                    {' '}
                    <span
                        className='text-show comment'
                        onClick={() => {
                            xmlModesContext.setPath(props.path)
                            xmlModesContext.setNode(props.node)
                            xmlModesContext.setMode('COMMENT_EDIT_MODE')
                        }}>
                        {escapeComment(body)}
                    </span>
                    {' '}
                    <CommentCloseBracket />
                </span>
            </div>
        )
    }
    else {
        return (
            <>
                {isSelected ?
                    <XmlShow
                        path={props.path}
                        className={selectedClassName}
                    >
                        <CommentOpenBracket /><br />
                        {props.node.M.trim()}<br />
                        <CommentCloseBracket />
                    </XmlShow> :
                    null
                }
            </>
        )
    }
}
