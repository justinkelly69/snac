import React, { useContext, useEffect, useState } from 'react'
import { SNACItem, SNACText, XMLModesType, XMLTextModesType } from '../snac/types'
import { Button, DropDownList, TextArea, TextInput, XButton } from './widgets'
import { snacOpts } from '../snac/opts'
import { escapeHtml } from '../snac/textutils'
import { XMLModesContext, XMLTextModesContext } from '../snac/contexts'
import {
    CDATACloseBracket, CDATAOpenBracket, CommentCloseBracket,
    CommentOpenBracket, PICloseBracket, PIOpenBracket
} from './brackets'
import { insertCDATAInText, insertCommentInText, insertPIInText, insertTagInText, piLanguages } from '../snac/snac'

export const TextEdit = (props: {
    node: SNACText,
    path: number[],
    isSelected: boolean,
}): JSX.Element => {

    const xmlModesContext = useContext(XMLModesContext) as XMLModesType

    const [textMode, setTextMode] = useState('TEXT_VIEW_MODE')

    const [nsText, setNSText] = useState('')
    const [nameText, setNameText] = useState('')

    const [oldText, setOldText] = useState('')
    const [newText, setNewText] = useState('')

    const [beforeText, setBeforeText] = useState('')
    const [duringText, setDuringText] = useState('')
    const [afterText, setAfterText] = useState('')

    const [newPILang, setNewPILang] = useState(piLanguages()[0])
    console.log('newPILang', newPILang)

    useEffect(() => {
        setNewText(props.node.T)
    }, [props.node.T])



    const value = {
        setTextMode,
        setNSText,
        setNameText,
        setBeforeText,
        setDuringText,
        setAfterText,
    }

    return (
        <XMLTextModesContext.Provider value={value} >
            {textMode === 'TEXT_VIEW_MODE' &&
                <>
                    <div className={`xml-display-controls-right xml-controls-area`}>
                        <XButton xmlModesContext={xmlModesContext} />
                        <Button
                            className='button text-button'
                            onClick={() => {
                                setTextMode('TEXT_INSERT_MODE')
                            }}
                            label='Insert Mode'
                        />
                    </div>
                    <div className={`xml-display-body-right xml-body-area`}>
                        <span
                            className='text-show text-body'
                            onClick={() => {
                                setTextMode('TEXT_EDIT_MODE')
                            }}
                        >
                            {escapeHtml(newText)}
                        </span>
                    </div>
                </>
            }
            {textMode === 'TEXT_EDIT_MODE' &&
                <>
                    <div className={`xml-display-controls-right xml-controls-area`}>
                        <XButton xmlModesContext={xmlModesContext} />
                        <Button
                            className='button text-button'
                            onClick={() => {
                                setTextMode('TEXT_VIEW_MODE')
                                setOldText(newText)
                                console.log(`[${props.path}]:${newText}`)
                            }}
                            label='Save'
                        />
                        <Button
                            className='button text-button'
                            onClick={() => {
                                setTextMode('TEXT_VIEW_MODE')
                                setNewText(oldText)
                            }}
                            label='Back'
                        />
                    </div>
                    <div className={`xml-display-body-right xml-body-area`}>
                        <TextArea
                            readOnly={false}
                            className='edit-text-editor text-editor'
                            value={newText}
                            onChange={(e) => setNewText(e.target.value)}
                        />
                    </div>
                </>
            }
            {textMode === 'TEXT_INSERT_MODE' &&
                <>
                    <div className={`xml-display-controls-right xml-controls-area`}>
                        <XButton xmlModesContext={xmlModesContext} />
                        <Button
                            className='button text-button'
                            onClick={() => {
                                setTextMode('TEXT_VIEW_MODE')
                                setOldText(newText)
                                console.log(`[${props.path}]:${newText}`)
                            }}
                            label='Save'
                        />
                        <Button
                            className='button text-button'
                            onClick={() => {
                                setTextMode('TEXT_TEXT_VIEW_MODE')
                                setNewText(oldText)
                            }}
                            label='Back'
                        />
                    </div>
                    <div className={`xml-display-body-right xml-body-area`}>
                        <TextArea
                            readOnly={false}
                            className='edit-text-editor text-editor'
                            value={props.node.T}
                            onChange={(e: {
                                target: {
                                    value: React.SetStateAction<string>
                                }
                            }) => setNewText(e.target.value)}
                        />
                    </div>
                </>
            }
            {(
                textMode === 'TEXT_INSERT_MODE' ||
                textMode === 'TEXT_INSERT_TAG_MODE' ||
                textMode === 'TEXT_INSERT_CDATA_MODE' ||
                textMode === 'TEXT_INSERT_COMMENT_MODE' ||
                textMode === 'TEXT_INSERT_PI_MODE'
            ) &&
                <>
                    <div className={`xml-display-controls-right xml-controls-area`}>
                        {textMode === 'TEXT_INSERT_TAG_MODE' &&
                            <>
                                <XButton xmlModesContext={xmlModesContext} />
                                <TextInput
                                    name="ns"
                                    className='text-input ns-input'
                                    size={4}
                                    placeholder='ns'
                                    onChange={(e: {
                                        target: {
                                            value: React.SetStateAction<string>
                                        }
                                    }) => setNSText(e.target.value)}
                                />
                                <TextInput
                                    name="name"
                                    className='text-input name-input'
                                    size={10}
                                    placeholder='name'
                                    onChange={(e: {
                                        target: {
                                            value: React.SetStateAction<string>
                                        }
                                    }) => setNameText(e.target.value)}
                                />
                                <Button
                                    className='button text-button'
                                    onClick={() => {
                                        insertTagInText(
                                            value,
                                            props.path,
                                            nsText,
                                            nameText,
                                            beforeText,
                                            duringText,
                                            afterText,
                                        )
                                        setTextMode('TEXT_INSERT_MODE')
                                    }}
                                    label='Insert Here'
                                />
                                <Button
                                    className='button text-button'
                                    onClick={() => {
                                        setTextMode('TEXT_INSERT_MODE')
                                    }}
                                    label='Back'
                                />
                            </>
                        }
                        {textMode === 'TEXT_INSERT_MODE' &&
                            <>
                                <XButton xmlModesContext={xmlModesContext} />
                                <Button
                                    className='button text-button'
                                    onClick={() => {
                                        setTextMode('TEXT_INSERT_TAG_MODE')
                                    }}
                                    label='Element'
                                />
                                <Button
                                    className='button text-button'
                                    onClick={() => {
                                        setTextMode('TEXT_INSERT_CDATA_MODE')
                                    }}
                                    label='CDATA'
                                />
                                <Button
                                    className='button text-button'
                                    onClick={() => {
                                        setTextMode('TEXT_INSERT_COMMENT_MODE')
                                    }}
                                    label='Comment'
                                />
                                <Button
                                    className='button text-button'
                                    onClick={() => {
                                        setTextMode('TEXT_INSERT_PI_MODE')
                                    }}
                                    label='PI'
                                />
                                <Button
                                    className='button text-button'
                                    onClick={() => {
                                        setTextMode('TEXT_VIEW_MODE')
                                    }}
                                    label='Back'
                                />
                            </>
                        }
                        {textMode === 'TEXT_INSERT_CDATA_MODE' &&
                            <>
                                <XButton xmlModesContext={xmlModesContext} />
                                <CDATAOpenBracket />
                                <Button
                                    className='button text-button'
                                    onClick={() => {
                                        insertCDATAInText(
                                            value,
                                            props.path,
                                            beforeText,
                                            duringText,
                                            afterText,
                                        )
                                        setTextMode('TEXT_INSERT_MODE')
                                    }}
                                    label='Insert'
                                />
                                <Button
                                    className='button text-button'
                                    onClick={() => {
                                        setTextMode('TEXT_INSERT_MODE')
                                    }}
                                    label='Back'
                                />
                                <CDATACloseBracket />
                            </>
                        }
                        {textMode === 'TEXT_INSERT_COMMENT_MODE' &&
                            <>
                                <XButton xmlModesContext={xmlModesContext} />
                                <CommentOpenBracket />
                                <Button
                                    className='button text-button'
                                    onClick={() => {
                                        insertCommentInText(
                                            value,
                                            props.path,
                                            beforeText,
                                            duringText,
                                            afterText,
                                        )
                                        setTextMode('TEXT_INSERT_MODE')
                                    }}
                                    label='Insert'
                                />
                                <Button
                                    className='button text-button'
                                    onClick={() => {
                                        setTextMode('TEXT_INSERT_MODE')
                                    }}
                                    label='Back'
                                />
                                <CommentCloseBracket />
                            </>
                        }
                        {textMode === 'TEXT_INSERT_PI_MODE' &&
                            <>
                                <XButton xmlModesContext={xmlModesContext} />
                                <PIOpenBracket />
                                <DropDownList
                                    className='pi-drop-down'
                                    value={newPILang}
                                    onChange={(e: { target: { value: React.SetStateAction<string> } }) => {
                                        setNewPILang(e.target.value)
                                    }}
                                    opts={snacOpts.pi_languages}
                                />
                                <Button
                                    className='button text-button'
                                    onClick={() => {
                                        insertPIInText(
                                            value,
                                            props.path,
                                            newPILang,
                                            beforeText,
                                            duringText,
                                            afterText,
                                        )
                                        setTextMode('TEXT_INSERT_MODE')
                                    }}
                                    label='Save'
                                />
                                <Button
                                    className='button text-button'
                                    onClick={() => {
                                        setTextMode('TEXT_INSERT_MODE')
                                    }}
                                    label='Back'
                                />
                                <PICloseBracket />
                            </>
                        }
                    </div>
                    <div className={`xml-display-body-right xml-body-area`}>
                        <TextArea
                            readOnly={true}
                            className='edit-text-editor text-insert'
                            value={newText}
                            onSelect={(e: {
                                target: {
                                    value: any;
                                    selectionStart: any;
                                    selectionEnd: any
                                }
                            }) => {
                                const value = e.target.value
                                const start = e.target.selectionStart
                                const end = e.target.selectionEnd

                                setBeforeText(value.substr(0, start))
                                setDuringText(value.substr(start, end - start))
                                setAfterText(value.substr(end))
                            }}
                        />
                    </div>
                </>
            }
        </XMLTextModesContext.Provider>
    )
}