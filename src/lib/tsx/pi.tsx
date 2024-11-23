import React, { useState } from 'react'

import { SNACItem, SNACPINode, SwitchStates } from "../snac/types"
import { Prefix, ShowHideSwitch } from './prefix'
import { Button, DropDownList, TextArea, TextInput } from './widgets'
import { escapePIBody } from '../snac/textutils'
import { snacOpts } from '../snac/opts'
import { PIGridStyle } from '../snac/styles'

export const PI = (props: {
    root: SNACItem[],
    node: SNACPINode,
    path: number[],
    showSelected: boolean,
}): JSX.Element | null => {

    const [isSelected, setSelected] = useState(false)
    const [isChildrenOpen, setChildrenOpen] = useState(false)
    const [isEditable, setIsEditable] = useState(false)

    const [piLang, setPiLang] = useState(props.node.L)
    const [piBody, setPiBody] = useState(props.node.B)
    const [oldPiLang, setOldPiLang] = useState(props.node.L)
    const [oldPiBody, setOldPiBody] = useState(props.node.B)

    let selectState = SwitchStates.HIDDEN

    if (props.showSelected) {
        selectState = isSelected ?
            SwitchStates.ON :
            SwitchStates.OFF
    }

    let body = piBody
    if (!isChildrenOpen && body.length > snacOpts.xml_trimTextLength) {
        body = `${snacOpts.xml_ellipsis}`
    }

    return (
        <div className='cdata'>

            {isChildrenOpen ?
                <span className='pi-table'
                    style={PIGridStyle({
                        pathWidth: props.path.length * 0.76,
                        xButtonWidth: 1,
                        buttonWidth: 6,
                    })}
                >
                    <span className='pi-prefix'></span>
                    <span className='pi-open-bracket'>
                        <PIOpenBracket />
                    </span>
                    {isEditable ?
                        <>
                            <span className='pi-lang-text'>
                                <DropDownList
                                    className='pi-lang-input'
                                    value={piLang}
                                    onChange={f => f}
                                    onSelect={f => f}
                                    opts={snacOpts.pi_languages}
                                />
                            </span>
                            <span className='pi-x-button'>
                                <Button
                                    className='button x-button'
                                    onClick={e => {
                                        setChildrenOpen(false)
                                    }}
                                    label='X'
                                />
                            </span>
                            <span className='pi-button-1'>
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
                            </span>
                            <span className='pi-button-2'>
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
                            <span className='pi-button-3'></span>
                            <span className='pi-text'>
                                <TextArea
                                    readOnly={false}
                                    className='pi-text-editor'
                                    value={piBody}
                                    onChange={e => setPiBody(e.target.value)}
                                />
                            </span>
                        </> :
                        <>
                            <span className='pi-lang-text'>
                                {`${piLang} `}
                            </span>
                            <span className='pi-x-button'>
                                <Button
                                    className='button x-button'
                                    onClick={e => {
                                        setChildrenOpen(false)
                                    }}
                                    label='X'
                                />
                            </span>
                            <span className='pi-button-1'>
                                <Button
                                    className='button text-button'
                                    onClick={e => {
                                        setIsEditable(true)
                                        setOldPiBody(piBody)
                                    }}
                                    label='Edit'
                                />
                            </span>
                            <span className='pi-button-2'>
                                <Button
                                    className='button text-button'
                                    onClick={e => {
                                        setIsEditable(false)
                                        setChildrenOpen(false)
                                    }}
                                    label='Remove'
                                />
                            </span>
                            <span className='pi-button-3'></span>
                            <span className='pi-text' >
                                {escapePIBody(piBody.trim())}
                            </span>
                        </>
                    }
                    <span className='pi-close-bracket'>
                        <PICloseBracket />
                    </span>
                </span>
                :
                <span>
                    <ShowHideSwitch
                        root={props.root}
                        path={props.path}
                        selected={selectState}
                        visible={!isChildrenOpen}
                        chars={snacOpts.switch_selectChars}
                        className='selected-show-hide'
                        openClose={e => setSelected(!isSelected)}
                    />
                    <Prefix path={props.path} />
                    <PIOpenBracket />
                    <span className='pi-label'>{piLang}</span>
                    <span className='pi-body' onClick={e => {
                        setChildrenOpen(true)
                    }}>
                        {escapePIBody(body)}
                    </span>
                    <PICloseBracket />
                </span>
            }
        </div>
    )
}

export const PIOpenBracket = () =>
    <span className='pi-brackets'>
        &lt;?
    </span>

export const PICloseBracket = () =>
    <span className='pi-brackets'>
        {" "}?&gt;
    </span>

