import React, { useState } from 'react'

import { SNACItem, SNACPINode, SNACOpts, SwitchStates, SwitchModes } from "../snac/types"
import { Prefix, ShowHideSwitch } from './prefix'
import { Button, TextArea, TextInput } from './widgets'
import { escapePIBody } from '../snac/textutils'

export const PI = (props: {
    root: SNACItem[],
    node: SNACPINode,
    path: number[],
    showSelected: boolean,
    snacOpts: SNACOpts,
}): JSX.Element | null => {

    const [isSelected, setSelected] = useState(false)
    const [isChildrenOpen, setChildrenOpen] = useState(false)
    const [isEditable, setIsEditable] = useState(false)

    const [piLang, setPiLang] = useState(props.node.L)
    const [piBody, setPiBody] = useState(props.node.B)
    const [oldPiLang, setOldPiLang] = useState(props.node.L)
    const [oldPiBody, setOldPiBody] = useState(props.node.B)

    let selectState = SwitchStates.HIDDEN
    let openState = SwitchStates.HIDDEN
    let selectedClassName = 'pi'

    if (props.showSelected) {
        selectState = isSelected ?
            SwitchStates.ON :
            SwitchStates.OFF

        selectedClassName = isSelected ?
            'pi selected' :
            'pi'
    }

    let body = piBody
    if (!isChildrenOpen && body.length > props.snacOpts.xml_trimTextLength) {
        body = `${props.snacOpts.xml_ellipsis}`
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
            {isChildrenOpen ?
                <>
                    <span className='pi-body'>
                        {isEditable ?
                            <>
                                <span className='text-editor-controls'>
                                    <PiOpenBracket />
                                    <TextInput
                                        name="value"
                                        className='pi-lang-input'
                                        value={piLang}
                                        size={2}
                                        placeholder='value'
                                        onChange={e => setPiLang(e.target.value)}
                                    />
                                    <Button
                                        className='button text-button'
                                        onClick={e => {
                                            setIsEditable(false)
                                            setChildrenOpen(false)
                                            setOldPiLang(piLang)
                                            setOldPiBody(piBody)
                                            console.log(`[${props.path}]:<?${piLang} ${oldPiBody} ?>`)
                                        }}
                                        label='Save'
                                    />
                                    <Button
                                        className='button text-button'
                                        onClick={e => {
                                            setIsEditable(false)
                                            setChildrenOpen(false)
                                            setPiLang(oldPiLang)
                                            setPiBody(oldPiBody)
                                        }}
                                        label='Cancel'
                                    />
                                </span>
                                <TextArea
                                    readOnly={false}
                                    className='pi-body-input'
                                    value={piBody}
                                    onChange={e => setPiBody(e.target.value)}
                                />
                            </> :
                            <>
                                <span className='text-editor-controls'>
                                    <PiOpenBracket />{`${piLang} `}
                                    <Button
                                        className='button text-button'
                                        onClick={e => {
                                            setIsEditable(true)
                                            setOldPiBody(piBody)
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
                                <span className='pi-body-input' >
                                    {escapePIBody(piBody.trim())}
                                </span>

                            </>
                        }
                    </span>
                    <br />
                    {prefix}
                    <PiCloseBracket />
                </> :
                <>
                    <PiOpenBracket />
                    <span className='pi-lang'>{piLang}</span>
                    <span className='pi-body'
                        onClick={e => {
                            setChildrenOpen(true)
                        }}>
                        {escapePIBody(body)}
                    </span>
                    <PiCloseBracket />
                </>
            }
        </div>
    )
}

export const PiOpenBracket = () =>
    <span className='pi-bracket'>
        &lt;?
    </span>

export const PiCloseBracket = () =>
    <span className='pi-bracket'>
        {" "}?&gt;
    </span>

