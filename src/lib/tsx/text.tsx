import React, { useState } from 'react'
import { SNACItem, SNACText, SwitchModes, SwitchStates } from '../snac/types'
import { Prefix, ShowHideSwitch } from './prefix'
import { Button, TextArea, TextInput } from './widgets'
import {
    snacOpts
} from '../snac/opts'

export const Text = (props: {
    root: SNACItem[],
    node: SNACText,
    path: number[],
    showSelected: boolean,
}): JSX.Element => {

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

    if (props.showSelected) {
        selectState = isSelected ? SwitchStates.ON : SwitchStates.OFF
        selectedClassName = isSelected ? 'text selected' : 'text'
    }

    const prefix = <Prefix path={props.path} />

    return (
        <div className={selectedClassName}>
            <span className='text-head'>
                <ShowHideSwitch
                    root={props.root}
                    path={props.path}
                    selected={selectState}
                    visible={!isChildrenOpen}
                    chars={snacOpts.switch_selectChars}
                    className='selected-show-hide'
                    openClose={e => setSelected(!isSelected)}
                />
                {prefix}
            </span>
            {isChildrenOpen ?
                <>
                    <span className='text-editor'>
                        {mode === 'EDIT_MODE' ?
                            <>
                                <span className='text-editor-controls'>
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
                                </span>
                                <TextArea
                                    readOnly={false}
                                    className='text-editor-rw'
                                    value={newText}
                                    onChange={e => setNewText(e.target.value)}
                                />
                            </> :
                            <>
                                {mode === 'INSERT_MODE' ?
                                    <>
                                        <span className='text-editor-controls'>
                                            <Button
                                                className='button x-button'
                                                onClick={e => {
                                                    setMode('VIEW_MODE')
                                                    setChildrenOpen(false)
                                                }}
                                                label='X'
                                            />
                                            <TextInput
                                                name="ns"
                                                size={4}
                                                placeholder='ns'
                                                onChange={e => setNSText(e.target.value)}
                                            />
                                            <TextInput
                                                name="name"
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
                                                onClick={e => {
                                                    setMode('VIEW_MODE')
                                                    setChildrenOpen(true)
                                                }}
                                                label='Cancel'
                                            />
                                        </span>
                                        <TextArea
                                            readOnly={true}
                                            className='text-editor-ro'
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
                                    </> :
                                    <>
                                        <span className='text-editor-controls'>
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
                                                    setMode('EDIT_MODE')
                                                }}
                                                label='Edit'
                                            />
                                            <Button
                                                className='button text-button'
                                                onClick={e => {
                                                    setMode('INSERT_MODE')
                                                }}
                                                label='Insert Mode'
                                            />
                                        </span>
                                        <span className='text-editor-text' >
                                            {newText.trim()}
                                        </span>
                                    </>
                                }

                            </>
                        }
                    </span>
                </> :
                <span className='text-body' onClick={e => {
                    setChildrenOpen(true)
                }}>
                    <span className='text-bracket'>[</span>
                    {newText}
                    <span className='text-bracket'>]</span>
                </span>
            }
        </div>
    )
}