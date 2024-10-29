import React, { useState } from 'react'
import { SNACItem, SNACOpts, SNACText, SwitchStates } from '../snac/types'
import { Prefix, ShowHideSwitch } from './prefix'
import { Button, TextArea, TextInput } from './widgets'

export const Text = (props: {
    root: SNACItem[],
    node: SNACText,
    path: number[],
    showSelected: boolean,
    showOpen: boolean,
    opts: SNACOpts,
}): JSX.Element => {

    const [isSelected, setSelected] = useState(false)
    const [isChildrenOpen, setChildrenOpen] = useState(false)
    const [isEditMode, setEditMode] = useState(false)
    const [insertMode, setInsertMode] = useState(false)

    const [nsText, setNSText] = useState('')
    const [nameText, setNameText] = useState('')
    const [valueText, setValueText] = useState(props.node.T)
    const [text, setText] = useState(props.node.T)
    const [beforeText, setBeforeText] = useState('')
    const [duringText, setDuringText] = useState('')
    const [afterText, setAfterText] = useState('')

    let selectState = SwitchStates.HIDDEN
    let openState = SwitchStates.OFF
    let selectedClassName = 'text'

    if (props.showSelected) {
        selectState = isSelected ? SwitchStates.ON : SwitchStates.OFF
        selectedClassName = isSelected ? 'text selected' : 'text'
    }
    if (props.showOpen) {
        openState = isChildrenOpen ? SwitchStates.ON : SwitchStates.OFF
    }

    let tmpText = props.node.T
    if (!isChildrenOpen && text.length > props.opts.xml_trimTextLength) {
        tmpText = `${text.trim().substring(0, props.opts.xml_trimTextLength)} ${props.opts.xml_ellipsis}`
    }

    const prefix = <Prefix path={props.path} opts={props.opts} />

    return (
        <div className={selectedClassName}>
            <span className='text-head'>
                <ShowHideSwitch
                    root={props.root}
                    path={props.path}
                    selected={selectState}
                    chars={props.opts.switch_selectChars}
                    className='selected-show-hide'
                    openClose={e => setSelected(!isSelected)}
                />
                {prefix}
            </span>
            {openState === SwitchStates.ON ?
                <>
                    <span className='text-editor'>
                        {isEditMode ?
                            <>
                                <span className='text-editor-controls'>
                                    <Button
                                        className='text-button text-cancel'
                                        onClick={e => {
                                            setEditMode(false)
                                            setChildrenOpen(false)
                                        }}
                                        label='X'
                                    />
                                    <Button
                                        className='text-button text-save'
                                        onClick={e => {
                                            setEditMode(false)
                                            setChildrenOpen(false)
                                            console.log(valueText)
                                        }}
                                        label='Save'
                                    />
                                </span>
                                <TextArea
                                    readOnly={false}
                                    className='text-editor-text'
                                    value={valueText}
                                    onChange={e => setValueText(e.target.value)}
                                />
                            </> :
                            <>
                                {insertMode ?
                                    <>
                                        <span className='text-editor-controls'>
                                            <Button
                                                className='text-button text-cancel'
                                                onClick={e => {
                                                    setEditMode(false)
                                                    setInsertMode(false)
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
                                                className='text-button text-insert'
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
                                                    setInsertMode(false)
                                                    setNSText('')
                                                    setNameText('')
                                                    setBeforeText('')
                                                    setDuringText('')
                                                    setAfterText('')
                                                }}
                                                label='Insert Here'
                                            />
                                        </span>
                                        <TextArea
                                            readOnly={true}
                                            className='text-editor-text'
                                            value={valueText}
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
                                                className='text-button text-cancel'
                                                onClick={e => {
                                                    setEditMode(false)
                                                    setInsertMode(false)
                                                    setChildrenOpen(false)
                                                }}
                                                label='X'
                                            />
                                            <Button
                                                className='text-button text-edit'
                                                onClick={e => setEditMode(true)}
                                                label='Edit'
                                            />
                                            <Button
                                                className='text-button text-insert'
                                                onClick={e => setInsertMode(true)}
                                                label='Insert Mode'
                                            />
                                        </span>
                                        <span className='text-editor-text' >
                                            {text.trim()}
                                        </span>
                                    </>
                                }

                            </>
                        }
                    </span>
                    <br />
                </> :
                <span className='text-body' onClick={e => {
                    setChildrenOpen(true)
                }}>
                    <span className='text-bracket'>[</span>
                    {text}
                    <span className='text-bracket'>]</span>
                </span>
            }
        </div>
    )
}