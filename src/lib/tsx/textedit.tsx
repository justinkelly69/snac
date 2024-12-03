import React, { useContext, useState } from 'react'
import { SNACText, XMLModesType } from '../snac/types'
import { Button, DropDownList, TextArea, TextInput } from './widgets'
import { snacOpts } from '../snac/opts'
import { escapeHtml } from '../snac/textutils'
import { XMLModesContext } from '../snac/contexts'
import {
    CDATACloseBracket, CDATAOpenBracket, CommentCloseBracket,
    CommentOpenBracket, PICloseBracket, PIOpenBracket
} from './brackets'

export const TextEdit = (props: {
    node: SNACText,
    path: number[],
    isSelected: boolean,
}): JSX.Element => {

    const xmlModesContext = useContext(XMLModesContext) as XMLModesType

    const [textMode, setTextMode] = useState('VIEW_MODE')

    const [nsText, setNSText] = useState('')
    const [nameText, setNameText] = useState('')

    const [oldText, setOldText] = useState(props.node.T)
    const [newText, setNewText] = useState(props.node.T)

    const [beforeText, setBeforeText] = useState('')
    const [duringText, setDuringText] = useState('')
    const [afterText, setAfterText] = useState('')

    const [newPILang, setNewPILang] = useState(snacOpts.pi_languages[0])

    const saveInsert = () => {
        if (nsText.length > 0 && nameText.length > 0) {
            const tag = `${nsText}:${nameText}`
            console.log(`${props.path}:${beforeText}<${tag}>${duringText}</${tag}>${afterText}`)
        }
        else if (nameText.length > 0) {
            const tag = `${nameText}`
            console.log(`${props.path}:${beforeText}<${tag}>${duringText}</${tag}>${afterText}`)
        }
        setTextMode('VIEW_MODE')
        setNSText('')
        setNameText('')
        setBeforeText('')
        setDuringText('')
        setAfterText('')
    }

    return (
        <>
            {textMode === 'VIEW_MODE' &&
                <>
                    <div className={`xml-display-controls-right xml-controls-area`}>
                        <Button
                            className='button x-button'
                            onClick={() => {
                                xmlModesContext.setMode('VIEW_MODE')
                            }}
                            label='X'
                        />
                        <Button
                            className='button text-button'
                            onClick={() => {
                                setTextMode('INSERT_MODE')
                            }}
                            label='Insert Mode'
                        />
                    </div>
                    <div className={`xml-display-body-right xml-body-area`}>
                        <span
                            className='text-show text-body'
                            onClick={() => {
                                setTextMode('EDIT_MODE')
                            }}
                        >
                            {escapeHtml(newText)}
                        </span>
                    </div>
                </>
            }
            {textMode === 'EDIT_MODE' &&
                <>
                    <div className={`xml-display-controls-right xml-controls-area`}>
                        <Button
                            className='button x-button'
                            onClick={() => {
                                xmlModesContext.setMode('VIEW_MODE')
                            }}
                            label='X'
                        />
                        <Button
                            className='button text-button'
                            onClick={() => {
                                setTextMode('VIEW_MODE')
                                setOldText(newText)
                                console.log(`[${props.path}]:${newText}`)
                            }}
                            label='Save'
                        />
                        <Button
                            className='button text-button'
                            onClick={() => {
                                setTextMode('VIEW_MODE')
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
                            onChange={(e: {
                                target: {
                                    value: React.SetStateAction<string>
                                }
                            }) => setNewText(e.target.value)}
                        />
                    </div>
                </>
            }
            {textMode === 'INSERT_MODE' &&
                <>
                    <div className={`xml-display-controls-right xml-controls-area`}>
                        <Button
                            className='button x-button'
                            onClick={() => {
                                xmlModesContext.setMode('VIEW_MODE')
                            }}
                            label='X'
                        />
                        <Button
                            className='button text-button'
                            onClick={() => {
                                setTextMode('VIEW_MODE')
                                setOldText(newText)
                                console.log(`[${props.path}]:${newText}`)
                            }}
                            label='Save'
                        />
                        <Button
                            className='button text-button'
                            onClick={() => {
                                setTextMode('VIEW_MODE')
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
                            onChange={(e: {
                                target: {
                                    value: React.SetStateAction<string>
                                }
                            }) => setNewText(e.target.value)}
                        />
                    </div>
                </>
            }
            {(textMode === 'INSERT_MODE' || textMode === 'INSERT_TAG_MODE' || textMode === 'INSERT_CDATA_MODE' ||
                textMode === 'INSERT_COMMENT_MODE' || textMode === 'INSERT_PI_MODE'
            ) &&
                <>
                    <div className={`xml-display-controls-right xml-controls-area`}>
                        {textMode === 'INSERT_TAG_MODE' &&
                            <>
                                <Button
                                    className='button x-button'
                                    onClick={() => {
                                        xmlModesContext.setMode('VIEW_MODE')
                                    }}
                                    label='X'
                                />
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
                                    onClick={() => saveInsert()}
                                    label='Insert Here'
                                />
                                <Button
                                    className='button text-button'
                                    onClick={() => {
                                        setTextMode('INSERT_MODE')
                                    }}
                                    label='Back'
                                />
                            </>
                        }
                        {textMode === 'INSERT_MODE' &&
                            <>
                                <Button
                                    className='button x-button'
                                    onClick={() => {
                                        xmlModesContext.setMode('VIEW_MODE')
                                    }}
                                    label='X'
                                />
                                <Button
                                    className='button text-button'
                                    onClick={() => {
                                        setTextMode('INSERT_TAG_MODE')
                                    }}
                                    label='Element'
                                />
                                <Button
                                    className='button text-button'
                                    onClick={() => {
                                        setTextMode('INSERT_CDATA_MODE')
                                    }}
                                    label='CDATA'
                                />
                                <Button
                                    className='button text-button'
                                    onClick={() => {
                                        setTextMode('INSERT_COMMENT_MODE')
                                    }}
                                    label='Comment'
                                />
                                <Button
                                    className='button text-button'
                                    onClick={() => {
                                        setTextMode('INSERT_PI_MODE')
                                    }}
                                    label='PI'
                                />
                                <Button
                                    className='button text-button'
                                    onClick={() => {
                                        setTextMode('VIEW_MODE')
                                    }}
                                    label='Back'
                                />
                            </>
                        }
                        {textMode === 'INSERT_CDATA_MODE' &&
                            <>
                                <Button
                                    className='button x-button'
                                    onClick={() => {
                                        xmlModesContext.setMode('VIEW_MODE')
                                    }}
                                    label='X'
                                />
                                <CDATAOpenBracket />
                                <Button
                                    className='button text-button'
                                    onClick={() => {
                                        setTextMode('INSERT_MODE')
                                    }}
                                    label='Save'
                                />
                                <Button
                                    className='button text-button'
                                    onClick={() => {
                                        setTextMode('INSERT_MODE')
                                    }}
                                    label='Back'
                                />
                                <CDATACloseBracket />
                            </>
                        }
                        {textMode === 'INSERT_COMMENT_MODE' &&
                            <>
                                <Button
                                    className='button x-button'
                                    onClick={() => {
                                        xmlModesContext.setMode('VIEW_MODE')
                                    }}
                                    label='X'
                                />
                                <CommentOpenBracket />
                                <Button
                                    className='button text-button'
                                    onClick={() => {
                                        setTextMode('INSERT_MODE')
                                    }}
                                    label='Save'
                                />
                                <Button
                                    className='button text-button'
                                    onClick={() => {
                                        setTextMode('INSERT_MODE')
                                    }}
                                    label='Back'
                                />
                                <CommentCloseBracket />
                            </>
                        }
                        {textMode === 'INSERT_PI_MODE' &&
                            <>
                                <Button
                                    className='button x-button'
                                    onClick={() => {
                                        xmlModesContext.setMode('VIEW_MODE')
                                    }}
                                    label='X'
                                />
                                <PIOpenBracket />
                                <DropDownList
                                    className='pi-drop-down'
                                    value={newPILang}
                                    onChange={e => {
                                        setNewPILang(e.target.value)
                                    }}
                                    opts={snacOpts.pi_languages}
                                />
                                <Button
                                    className='button text-button'
                                    onClick={() => {
                                        setTextMode('INSERT_MODE')
                                    }}
                                    label='Save'
                                />
                                <Button
                                    className='button text-button'
                                    onClick={() => {
                                        setTextMode('INSERT_MODE')
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
        </>
    )
}