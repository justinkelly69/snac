import React, { useContext, useState } from 'react'
import { SNACComment, XMLModesType } from '../snac/types'
import { Button, TextArea, XButton } from './widgets'
import { escapeComment } from '../snac/textutils'
import { XMLModesContext } from '../snac/contexts'
import { CommentCloseBracket, CommentOpenBracket } from './brackets'

export const CommentEdit = (props: {
    node: SNACComment,
    path: number[],
    isSelected: boolean,
}): JSX.Element | null => {

    const xmlModesContext = useContext(XMLModesContext) as XMLModesType

    const [isEditable, setIsEditable] = useState(false)

    const [newComment, setNewComment] = useState(props.node.M)
    const [prevComment, setPrevComment] = useState(props.node.M)

    if (isEditable) {
        return (
            <>
                <div className={`xml-display-controls-right xml-controls-area`}>
                    <XButton xmlModesContext={xmlModesContext} />
                    <CommentOpenBracket />
                    <>
                        <Button
                            className='button text-button'
                            onClick={() => {
                                setIsEditable(false)
                                setNewComment(prevComment)
                                console.log(`[${props.path}]:<!-- ${prevComment} -->`)
                            }}
                            label='Save'
                        />
                        <Button
                            className='button text-button'
                            onClick={() => {
                                setIsEditable(false)
                                setPrevComment('')
                            }}
                            label='Cancel'
                        />
                    </>
                    <CommentCloseBracket />
                </div>
                <div className={`xml-display-body-right xml-body-area`}>
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
                </div>
            </>
        )
    }
    else {
        return (
            <>
                <div className={`xml-display-controls-right xml-controls-area`}>
                    <XButton xmlModesContext={xmlModesContext} />
                    <CommentOpenBracket />
                    <CommentCloseBracket />
                </div>
                <div className={`xml-display-body-right xml-body-area`}>
                    <span
                        className='text-show comment'
                        onClick={() => {
                            setIsEditable(true)
                            setPrevComment(newComment)
                        }}>
                        {escapeComment(newComment)}
                    </span>
                </div>
            </>
        )
    }
}

