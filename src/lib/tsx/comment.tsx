import React, { useState } from 'react'
import { SNACComment, SNACItem, SNACOpts, SwitchModes, SwitchStates } from '../snac/types'
import { Button, TextArea } from './widgets'
import { Prefix, ShowHideSwitch } from './prefix'
import { escapeComment } from '../snac/textutils'

export const Comment = (props: {
    root: SNACItem[],
    node: SNACComment,
    path: number[],
    showSelected: boolean,
    snacOpts: SNACOpts,
}): JSX.Element | null => {

    const [isSelected, setSelected] = useState(false)
    const [isChildrenOpen, setChildrenOpen] = useState(false)
    const [isEditable, setIsEditable] = useState(false)

    const [valueComment, setValueComment] = useState(props.node.M)
    const [tmpValueComment, setTmpValueComment] = useState(props.node.M)

    let selectState = SwitchStates.HIDDEN
    let selectedClassName = 'comment'

    if (props.showSelected) {
        selectState = isSelected ?
            SwitchStates.ON :
            SwitchStates.OFF

        selectedClassName = isSelected ?
            'comment selected' :
            'comment'
    }

    let comment = valueComment
    if (!isChildrenOpen && comment.length > props.snacOpts.xml_trimTextLength) {
        comment = `${comment.substring(0, props.snacOpts.xml_trimCommentLength)} ${props.snacOpts.xml_ellipsis}`
    }

    const prefix = <Prefix
        path={props.path}
        snacOpts={props.snacOpts}
    />

    return (
        <div className={selectedClassName}>
            <ShowHideSwitch
                root={props.root}
                path={props.path}
                selected={selectState}
                visible={!isChildrenOpen}
                chars={props.snacOpts.switch_selectChars}
                className='selected-show-hide'
                openClose={e => setSelected(!isSelected)}
            />
            {prefix}

            <CommentOpenBracket />
            {isChildrenOpen ?
                <>
                    <br /> {prefix}
                    <span className='comment-body'>
                        {isEditable ?
                            <>
                                <span className='text-editor-controls'>
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
                                <TextArea
                                    readOnly={false}
                                    className='text-editor-text'
                                    value={tmpValueComment}
                                    onChange={e => setTmpValueComment(e.target.value)}
                                />
                            </> :
                            <>
                                <span className='text-editor-controls'>
                                    <Button
                                        className='button text-button'
                                        onClick={e => {
                                            setIsEditable(true)
                                            setTmpValueComment(valueComment)
                                        }}
                                        label='Edit'
                                    />
                                    <Button
                                        className='button text-button'
                                        onClick={e => {
                                            setIsEditable(false)
                                            setChildrenOpen(false)
                                        }}
                                        label='Remove'
                                    />
                                </span>
                                <span className='text-editor-text' >
                                    {escapeComment(comment.trim())}
                                </span>
                            </>
                        }
                    </span>
                    <br /> {prefix}
                </> :
                <span className='comment-body' onClick={e => {
                    setChildrenOpen(true)
                }}>
                    {escapeComment(comment)}
                </span>
            }
            <CommentCloseBracket />
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

