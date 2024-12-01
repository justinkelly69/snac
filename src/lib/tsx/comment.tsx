import React, { useContext, useState } from 'react'
import { SNACComment, SwitchStates, XMLModesType, XMLRWType } from '../snac/types'
import { Button, EditTextBox, TextArea } from './widgets'
import { Prefix } from './prefix'
import { escapeComment, trimBody } from '../snac/textutils'
import { snacOpts } from '../snac/opts'
import { ShowHideSwitch } from './showhide'
import { XMLModesContext, XMLRWContext } from '../snac/contexts'
import { XmlShow } from './xmlshow'
import { addPath, hasPath } from '../snac/paths'

export const Comment = (props: {
    node: SNACComment,
    path: number[],
    isSelected: boolean,
}): JSX.Element | null => {

    const xmlRWContext = useContext(XMLRWContext) as XMLRWType
    const xmlModesContext = useContext(XMLModesContext) as XMLModesType

    const [isChildrenOpen, setChildrenOpen] = useState(false)
    const [isEditable, setIsEditable] = useState(false)

    const [newComment, setNewComment] = useState(props.node.M)
    const [prevComment, setPrevComment] = useState(props.node.M)

    const isSelected = hasPath(xmlModesContext.paths, props.path) || props.isSelected
    let selectState = SwitchStates.HIDDEN
    let selectedClassName = 'comment'

    if (xmlRWContext.treeMode) {
        selectState = isSelected ?
            SwitchStates.ON :
            SwitchStates.OFF

        selectedClassName = isSelected ?
            'comment selected' :
            'comment'
    }

    const comment = trimBody(
        isChildrenOpen,
        newComment,
        snacOpts.xml_trimCommentLength,
        snacOpts.xml_ellipsis
    )

    const widthMultiplier = .9
    if (xmlRWContext.treeMode) {
        return (
            <div className={selectedClassName}>
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
                                                setIsEditable(false)
                                                setChildrenOpen(false)
                                            }}
                                            label='Remove'
                                        />
                                    </>
                                }
                                editTextArea={() =>
                                    <span
                                        className='edit-text-show comment-disabled'
                                        onClick={() => {
                                            setIsEditable(true)
                                            setPrevComment(newComment)
                                        }}
                                    >
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
                            chars={snacOpts.switch_selectChars}
                            openClose={() => {
                                const newPaths = addPath(
                                    xmlModesContext.paths,
                                    props.path,
                                )
                                xmlModesContext.setPaths(newPaths)
                            }}
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

export const CommentOpenBracket = () =>
    <span className='comment-brackets'>
        &lt;!--
    </span>

export const CommentCloseBracket = () =>
    <span className='comment-brackets'>
        --&gt;
    </span>

