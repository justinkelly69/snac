import React, { useState } from 'react'

import { SNACItem, SNACPINode, SwitchStates } from "../snac/types"
import { Prefix, ShowHideSwitch } from './prefix'
import { Button, DropDownList, TextArea, EditTextBox } from './widgets'
import { escapePIBody } from '../snac/textutils'
import { snacOpts } from '../snac/opts'
import { trimBody } from '../snac/helpers'

export const PI = (props: {
    root: SNACItem[],
    node: SNACPINode,
    path: number[],
    showSelected: boolean,
}): JSX.Element | null => {

    const [isSelected, setSelected] = useState(false)
    const [isChildrenOpen, setChildrenOpen] = useState(false)
    const [isEditable, setIsEditable] = useState(false)

    const [newPILang, setNewPILang] = useState(props.node.L)
    const [newPIBody, setNewPIBody] = useState(props.node.B)
    const [prevPILang, setPrevPILang] = useState(props.node.L)
    const [prevPIBody, setPrevPIBody] = useState(props.node.B)

    let selectState = SwitchStates.HIDDEN

    if (props.showSelected) {
        selectState = isSelected ?
            SwitchStates.ON :
            SwitchStates.OFF
    }

    const body = trimBody (
        isChildrenOpen,
        newPIBody,
        snacOpts.xml_trimPIBodyLength,
        snacOpts.xml_ellipsis
    )

    const widthMultiplier = 1

    return (
        <>
            {isChildrenOpen ?
                <>
                    {isEditable ?
                        <EditTextBox
                            path={props.path}
                            widthMultiplier={widthMultiplier}
                            editTopBar={() =>
                                <>
                                    <PIOpenBracket />
                                    <DropDownList
                                        className='pi-drop-down'
                                        value={newPILang}
                                        onChange={e => {
                                            setNewPILang(e.target.value)
                                        }}
                                        onSelect={f => f}
                                        opts={snacOpts.pi_languages}
                                    />
                                </>
                            }
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
                                            setPrevPILang(newPILang)
                                            setPrevPIBody(newPIBody)
                                            console.log(`[${props.path}]:<?${newPILang} ${prevPIBody} ?>`)
                                        }}
                                        label='Save'
                                    />
                                    <Button
                                        className='button text-button'
                                        onClick={() => {
                                            setIsEditable(false)
                                            setChildrenOpen(false)
                                            setNewPILang(prevPILang)
                                            setNewPIBody(prevPIBody)
                                        }}
                                        label='Cancel'
                                    />
                                </>
                            }
                            editTextArea={() =>
                                <TextArea
                                    readOnly={false}
                                    className='edit-text-editor pi-editor'
                                    value={newPIBody}
                                    onChange={(e: { target: { value: React.SetStateAction<string> } }) => setNewPIBody(e.target.value)}
                                />
                            }
                            editBottomBar={() => <PICloseBracket />}
                        /> :
                        <EditTextBox
                            path={props.path}
                            widthMultiplier={widthMultiplier}
                            editTopBar={() =>
                                <>
                                    <PIOpenBracket />
                                    <span className='pi-lang'>
                                        {` ${newPILang} `}
                                    </span>
                                </>
                            }
                            editButtonBar={() =>
                                <>
                                    <Button
                                        className='button x-button'
                                        onClick={e => {
                                            setChildrenOpen(false)
                                        }}
                                        label='X'
                                    />
                                    <Button
                                        className='button text-button'
                                        onClick={e => {
                                            setIsEditable(true)
                                            setPrevPIBody(newPIBody)
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
                                </>
                            }
                            editTextArea={() =>
                                <span className='edit-text-show pi-disabled'>
                                    {escapePIBody(body)}
                                </span>
                            }
                            editBottomBar={() => <PICloseBracket />}
                        />
                    }
                </> :
                <span>
                    <ShowHideSwitch
                        root={props.root}
                        path={props.path}
                        selected={selectState}
                        visible={!isChildrenOpen}
                        chars={snacOpts.switch_selectChars}
                        className='selected-show-hide'
                        openClose={() => setSelected(!isSelected)}
                    />
                    <Prefix path={props.path} />
                    {' '}
                    <PIOpenBracket />
                    <span className='pi-lang'>{`${newPILang} `}</span>
                    <span
                        className='edit-text-show pi'
                        onClick={e => {
                            setChildrenOpen(true)
                        }}>
                        {`${escapePIBody(body)}`}
                    </span>
                    {" "}
                    <PICloseBracket />
                </span>

            }
        </>
    )
}

export const PIOpenBracket = () =>
    <span className='pi-brackets'>
        &lt;?
    </span>

export const PICloseBracket = () =>
    <span className='pi-brackets'>
        ?&gt;
    </span>

