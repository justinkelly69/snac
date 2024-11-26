import React, { useState } from 'react'
import { SNACComment, SNACItem, SwitchStates } from '../snac/types'
import { Button, EditTextBox, TextArea } from './widgets'
import { Prefix, ShowHideSwitch } from './prefix'
import { escapeComment } from '../snac/textutils'
import { snacOpts } from '../snac/opts'
import { trimBody } from '../snac/helpers'

export const Comment = (props: {
    node: SNACComment,
    path: number[],
    showSelected: boolean,
}): JSX.Element | null => {

    const [isSelected, setSelected] = useState(false)
    const [isChildrenOpen, setChildrenOpen] = useState(false)
    const [isEditable, setIsEditable] = useState(false)

    const [newComment, setNewComment] = useState(props.node.M)
    const [prevComment, setPrevComment] = useState(props.node.M)

    let selectState = SwitchStates.HIDDEN

    if (props.showSelected) {
        selectState = isSelected ?
            SwitchStates.ON :
            SwitchStates.OFF
    }

    const comment = trimBody (
        isChildrenOpen,
        newComment,
        snacOpts.xml_trimCommentLength,
        snacOpts.xml_ellipsis
    )

    const widthMultiplier = .9

    return (
        <>
            {isChildrenOpen ?
                <>
                    {isEditable ?
                        <EditTextBox
                            path={props.path}
                            widthMultiplier={widthMultiplier}
                            editTopBar={() => <CommentOpenBracket />}
                            editButtonBar={() =>
                                <>
                                    <Button
                                        className='button text-button'
                                        onClick={() => {
                                            setIsEditable(false)
                                            setChildrenOpen(false)
                                            setNewComment(prevComment)
                                            console.log(`[${props.path}]:<!-- ${prevComment} -->`)
                                        }}
                                        label='Save'
                                    />
                                    <Button
                                        className='button text-button'
                                        onClick={() => {
                                            setIsEditable(false)
                                            setChildrenOpen(false)
                                            setPrevComment('')
                                        }}
                                        label='Cancel'
                                    />
                                </>
                            }
                            editTextArea={() =>
                                <TextArea
                                    readOnly={false}
                                    className='edit-text-editor comment-editor'
                                    value={prevComment}
                                    onChange={(e: {
                                        target: {
                                            value: React.SetStateAction<string>
                                        }
                                    }) => setPrevComment(e.target.value)}
                                />
                            }
                            editBottomBar={() => <CommentCloseBracket />}
                        /> :
                        <EditTextBox
                            path={props.path}
                            widthMultiplier={widthMultiplier}
                            editTopBar={() => <CommentOpenBracket />}
                            editButtonBar={() =>
                                <>
                                    <Button
                                        className='button x-button'
                                        onClick={() => {
                                            setChildrenOpen(false)
                                        }}
                                        label='X'
                                    />
                                    <Button
                                        className='button text-button'
                                        onClick={() => {
                                            setIsEditable(true)
                                            setPrevComment(newComment)
                                        }}
                                        label='Edit'
                                    />
                                    <Button
                                        className='button text-button'
                                        onClick={() => {
                                            setIsEditable(false)
                                            setChildrenOpen(false)
                                        }}
                                        label='Remove'
                                    />
                                </>
                            }
                            editTextArea={() => 
                                <span className='edit-text-show comment-disabled'>
                                    {escapeComment(newComment.trim())}
                                </span>
                            }
                            editBottomBar={() => <CommentCloseBracket />}
                        />
                    }
                </> :
                <span>
                    <ShowHideSwitch
                        path={props.path}
                        selected={selectState}
                        visible={!isChildrenOpen}
                        chars={snacOpts.switch_selectChars}
                        className='selected-show-hide'
                        openClose={() => setSelected(!isSelected)}
                    />
                    <Prefix path={props.path} />
                    {' '}
                    <CommentOpenBracket />
                    {' '}
                    <span
                        className='edit-text-show comment'
                        onClick={() => {
                            setChildrenOpen(true)
                        }}>
                        {escapeComment(comment)}
                    </span>
                    {' '}
                    <CommentCloseBracket />
                </span>

            }
        </>
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

