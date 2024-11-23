import React, { useState } from 'react'
import { SNACComment, SNACItem, SwitchStates } from '../snac/types'
import { Button, TextArea } from './widgets'
import { Prefix, ShowHideSwitch } from './prefix'
import { escapeComment } from '../snac/textutils'
import { snacOpts } from '../snac/opts'
import { commentsGridStyle } from '../snac/styles'

export const Comment = (props: {
    root: SNACItem[],
    node: SNACComment,
    path: number[],
    showSelected: boolean,
}): JSX.Element | null => {

    const [isSelected, setSelected] = useState(false)
    const [isChildrenOpen, setChildrenOpen] = useState(false)
    const [isEditable, setIsEditable] = useState(false)

    const [valueComment, setValueComment] = useState(props.node.M)
    const [tmpValueComment, setTmpValueComment] = useState(props.node.M)

    let selectState = SwitchStates.HIDDEN

    if (props.showSelected) {
        selectState = isSelected ?
            SwitchStates.ON :
            SwitchStates.OFF
    }

    let comment = valueComment
    if (!isChildrenOpen && comment.length > snacOpts.xml_trimTextLength) {
        comment = `${comment.substring(0, snacOpts.xml_trimCommentLength)} ${snacOpts.xml_ellipsis}`
    }

    console.log('props.path', props.path)

    return (
        <div className='comment'>

            {isChildrenOpen ?
                <span className='comment-table'
                    style={commentsGridStyle({
                        pathWidth: props.path.length * 0.76,
                        xButtonWidth: 1,
                        buttonWidth: 6,
                    })}
                >
                    <span className='comment-prefix'></span>
                    <span className='comment-open-bracket'>
                        <CommentOpenBracket />
                    </span>
                    {isEditable ?
                        <>
                            <span className='comment-x-button'>
                                <Button
                                    className='button x-button'
                                    onClick={e => {
                                        setChildrenOpen(false)
                                    }}
                                    label='X'
                                />
                            </span>
                            <span className='comment-button-1'>
                                <Button
                                    className='button text-button'
                                    onClick={e => {
                                        setIsEditable(false)
                                        setChildrenOpen(false)
                                        setValueComment(tmpValueComment)
                                        console.log(`[${props.path}]:<!-- ${tmpValueComment} -->`)
                                    }}
                                    label='Save'
                                />
                            </span>
                            <span className='comment-button-2'>
                                <Button
                                    className='button text-button'
                                    onClick={e => {
                                        setIsEditable(false)
                                        setChildrenOpen(false)
                                        setTmpValueComment('')
                                    }}
                                    label='Cancel'
                                />
                            </span>
                            <span className='comment-button-3'></span>
                            <span className='comment-text'>
                                <TextArea
                                    readOnly={false}
                                    className='comment-text-editor'
                                    value={tmpValueComment}
                                    onChange={e => setTmpValueComment(e.target.value)}
                                />
                            </span>
                        </> :
                        <>
                            <span className='comment-x-button'>
                                <Button
                                    className='button x-button'
                                    onClick={e => {
                                        setChildrenOpen(false)
                                    }}
                                    label='X'
                                />
                            </span>
                            <span className='comment-button-1'>
                                <Button
                                    className='button text-button'
                                    onClick={e => {
                                        setIsEditable(true)
                                        setTmpValueComment(valueComment)
                                    }}
                                    label='Edit'
                                />
                            </span>
                            <span className='comment-button-2'>
                                <Button
                                    className='button text-button'
                                    onClick={e => {
                                        setIsEditable(false)
                                        setChildrenOpen(false)
                                    }}
                                    label='Remove'
                                />
                            </span>
                            <span className='comment-button-3'></span>
                            <span className='comment-text' >
                                {escapeComment(comment.trim())}
                            </span>
                        </>
                    }
                    <span className='comment-close-bracket'>
                        <CommentCloseBracket />
                    </span>
                </span>
                :
                <span>
                    <ShowHideSwitch
                        root={props.root}
                        path={props.path}
                        selected={selectState}
                        visible={!isChildrenOpen}
                        chars={snacOpts.switch_selectChars}
                        className='selected-show-hide'
                        openClose={e => setSelected(!isSelected)}
                    />
                    <Prefix path={props.path} />
                    <CommentOpenBracket />
                    <span className='comment-body' onClick={e => {
                        setChildrenOpen(true)
                    }}>
                        {escapeComment(comment)}
                    </span>
                    <CommentCloseBracket />
                </span>
            }
        </div>
    )
}

export const CommentOpenBracket = () =>
    <span className='comment-brackets'>
        &lt;!--
    </span>

export const CommentCloseBracket = () =>
    <span className='comment-brackets'>
        --&gt;
    </span>

