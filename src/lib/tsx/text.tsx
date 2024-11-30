import React, { useContext, useState } from 'react'
import { SNACText, SwitchModes, SwitchStates, XMLRWType, XMLTagOpenCloseType } from '../snac/types'
import { Prefix } from './prefix'
import { Button, TextArea, TextEditTextBox, TextInput } from './widgets'
import { snacOpts } from '../snac/opts'
import { escapeHtml, trimBody } from '../snac/textutils'
import { ShowHideSwitch } from './showhide'
import { XMLRWContext } from './xmlout'
import { XmlShow } from './xmlshow'
import { XMLTagOpenCloseContext } from './element'

export const Text = (props: {
    node: SNACText,
    path: number[],
}): JSX.Element => {

    const xmlRWContext = useContext(XMLRWContext) as XMLRWType
    const openCloseContext = useContext(XMLTagOpenCloseContext) as XMLTagOpenCloseType
    
    const [isSelected, setSelected] = useState(false)
    const [isChildrenOpen, setChildrenOpen] = useState(false)

    const [mode, setMode] = useState<SwitchModes>('VIEW_MODE') // VIEW_MODE, EDIT_MODE, INSERT_MODE

    const [nsText, setNSText] = useState('')
    const [nameText, setNameText] = useState('')

    const [oldText, setOldText] = useState(props.node.T)
    const [newText, setNewText] = useState(props.node.T)

    const [beforeText, setBeforeText] = useState('')
    const [duringText, setDuringText] = useState('')
    const [afterText, setAfterText] = useState('')

    let selectState = SwitchStates.HIDDEN
    let selectedClassName = 'text'

    if (xmlRWContext.treeMode) {
        selectState = isSelected ?
            SwitchStates.ON :
            SwitchStates.OFF

        selectedClassName = isSelected ?
            'text selected' :
            'text'
    }

    const body = trimBody(
        isChildrenOpen,
        newText,
        snacOpts.xml_trimTextLength,
        snacOpts.xml_ellipsis
    )

    const widthMultiplier = .9

    if (xmlRWContext.treeMode) {
        return (
            <div className={selectedClassName}>
                {isChildrenOpen ?
                    <>
                        {mode === 'EDIT_MODE' &&
                            <TextEditTextBox
                                path={props.path}
                                widthMultiplier={widthMultiplier}
                                editButtonBar={() =>
                                    <>
                                        <Button
                                            className='button x-button'
                                            onClick={e => {
                                                setMode('VIEW_MODE')
                                                setChildrenOpen(false)
                                            }}
                                            label='X'
                                        />
                                        <Button
                                            className='button text-button'
                                            onClick={e => {
                                                setMode('VIEW_MODE')
                                                setChildrenOpen(true)
                                                setOldText(newText)
                                                console.log(`[${props.path}]:${newText}`)
                                            }}
                                            label='Save'
                                        />
                                        <Button
                                            className='button text-button'
                                            onClick={e => {
                                                setMode('VIEW_MODE')
                                                setChildrenOpen(true)
                                                setNewText(oldText)
                                            }}
                                            label='Cancel'
                                        />
                                    </>
                                }
                                editTextArea={() =>
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
                                }
                            />
                        }
                        {mode === 'INSERT_MODE' &&
                            <TextEditTextBox
                                path={props.path}
                                widthMultiplier={widthMultiplier}
                                editButtonBar={() =>
                                    <>
                                        <Button
                                            className='button x-button'
                                            onClick={e => {
                                                setMode('VIEW_MODE')
                                                setChildrenOpen(true)
                                            }}
                                            label='X'
                                        />
                                        <TextInput
                                            name="ns"
                                            className='text-input ns-input'
                                            size={4}
                                            placeholder='ns'
                                            onChange={e => setNSText(e.target.value)}
                                        />
                                        <TextInput
                                            name="name"
                                            className='text-input name-input'
                                            size={10}
                                            placeholder='name'
                                            onChange={e => setNameText(e.target.value)}
                                        />
                                        <Button
                                            className='button text-button'
                                            onClick={e => {
                                                if (nsText.length > 0 && nameText.length > 0) {
                                                    const tag = `${nsText}:${nameText}`
                                                    console.log(`${props.path}:${beforeText}<${tag}>${duringText}</${tag}>${afterText}`)
                                                }
                                                else if (nameText.length > 0) {
                                                    const tag = `${nameText}`
                                                    console.log(`${props.path}:${beforeText}<${tag}>${duringText}</${tag}>${afterText}`)
                                                }
                                                setChildrenOpen(false)
                                                setMode('VIEW_MODE')
                                                setNSText('')
                                                setNameText('')
                                                setBeforeText('')
                                                setDuringText('')
                                                setAfterText('')
                                            }}
                                            label='Insert Here'
                                        />
                                        <Button
                                            className='button text-button'
                                            onClick={f => f}
                                            label='CDATA'
                                        />
                                        <Button
                                            className='button text-button'
                                            onClick={f => f}
                                            label='Comment'
                                        />
                                        <Button
                                            className='button text-button'
                                            onClick={f => f}
                                            label='PI'
                                        />
                                    </>
                                }
                                editTextArea={() =>
                                    <TextArea
                                        readOnly={true}
                                        className='edit-text-editor text-insert'
                                        value={newText}
                                        onSelect={e => {
                                            const value = e.target.value
                                            const start = e.target.selectionStart
                                            const end = e.target.selectionEnd

                                            setBeforeText(value.substr(0, start))
                                            setDuringText(value.substr(start, end - start))
                                            setAfterText(value.substr(end))
                                        }}
                                    />
                                }
                            />
                        }
                        {mode === 'VIEW_MODE' &&
                            <TextEditTextBox
                                path={props.path}
                                widthMultiplier={widthMultiplier}
                                editButtonBar={() =>
                                    <>
                                        <Button
                                            className='button x-button'
                                            onClick={e => {
                                                setMode('VIEW_MODE')
                                                setChildrenOpen(false)
                                            }}
                                            label='X'
                                        />
                                        <Button
                                            className='button text-button'
                                            onClick={e => {
                                                setMode('INSERT_MODE')
                                            }}
                                            label='Insert Mode'
                                        />
                                    </>
                                }
                                editTextArea={() =>
                                    <span
                                        className='edit-text-show'
                                        onClick={e => {
                                            setMode('EDIT_MODE')
                                        }}
                                    >
                                        {escapeHtml(newText)}
                                    </span>
                                }
                            />
                        }
                    </> :
                    <>
                        <ShowHideSwitch
                            path={props.path}
                            selected={selectState}
                            chars={snacOpts.switch_selectChars}
                            openClose={() => setSelected(!isSelected)}
                        />
                        <Prefix path={props.path} />
                        <span
                            className='text-body'
                            onClick={e => {
                                setChildrenOpen(true)
                            }}>
                            {escapeHtml(body)}
                        </span>
                    </>
                }
            </div>
        )
    }
    else {
        return (
            <XmlShow
                path={props.path}
                className='text'>
                {props.node.T.trim().length > 0 ?
                    <>
                        {escapeHtml(props.node.T.trim())}
                    </> :
                    null
                }
            </XmlShow>
        )
    }
}