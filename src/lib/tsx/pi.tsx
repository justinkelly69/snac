import React, { useState } from 'react'

import { SNACItem, SNACPINode, SNACOpts, SwitchStates } from "../snac/types"
import { Prefix, ShowHideSwitch } from './prefix'
import { Button, TextArea } from './widgets'
import { escapePIBody } from '../snac/textutils'

export const PI = (props: {
    root: SNACItem[],
    node: SNACPINode,
    path: number[],
    showSelected: boolean,
    showOpen: boolean,
    opts: SNACOpts,
}): JSX.Element | null => {

    const [isSelected, setSelected] = useState(false)
    const [isChildrenOpen, setChildrenOpen] = useState(false)
    const [isEditable, setIsEditable] = useState(false)

    const [valuePILang, setValuePILang] = useState(props.node.L)
    const [valuePIBody, setValuePIBody] = useState(props.node.B)
    const [tmpValuePIBody, setTmpValuePIBody] = useState(props.node.B)

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

    if (props.showOpen) {
        openState = isChildrenOpen ?
            SwitchStates.ON :
            SwitchStates.OFF
    }

    let body = valuePIBody
    if (!isChildrenOpen && body.length > props.opts.xml_trimTextLength) {
        body = `${props.opts.xml_ellipsis}`
    }

    const prefix = <Prefix
        path={props.path}
        opts={props.opts}
    />

    return (
        <div className={selectedClassName}>
            <ShowHideSwitch
                root={props.root}
                path={props.path}
                selected={selectState}
                chars={props.opts.switch_selectChars}
                className='selected-show-hide'
                openClose={e => setSelected(!isSelected)}
            />
            {prefix}

            {openState === SwitchStates.ON ?
                <>
                    <br /> {prefix}
                    <span className='pi-body'>
                        {isEditable ?
                            <>
                                <span className='text-editor-controls'>
                                    <Button
                                        className='text-button text-save'
                                        onClick={e => {
                                            setIsEditable(false)
                                            setChildrenOpen(false)
                                            setValuePIBody(tmpValuePIBody)
                                            console.log(`<?${valuePILang} ${tmpValuePIBody} ?>`)
                                        }}
                                        label='Save'
                                    />
                                    <Button
                                        className='text-button text-cancel'
                                        onClick={e => {
                                            setIsEditable(false)
                                            setChildrenOpen(false)
                                            setTmpValuePIBody('')
                                        }}
                                        label='Cancel'
                                    />
                                </span>
                                <TextArea
                                    readOnly={false}
                                    className='text-editor-text'
                                    value={tmpValuePIBody}
                                    onChange={e => setTmpValuePIBody(e.target.value)}
                                />
                            </> :
                            <>
                                <span className='text-editor-controls'>
                                    <Button
                                        className='text-button text-edit'
                                        onClick={e => {
                                            setIsEditable(true)
                                            setTmpValuePIBody(valuePIBody)
                                        }}
                                        label='Edit'
                                    />
                                    <Button
                                        className='text-button text-remove'
                                        onClick={e => {
                                            setIsEditable(false)
                                            setChildrenOpen(false)
                                        }}
                                        label='Remove'
                                    />
                                </span>
                                <span className='text-editor-text' >
                                    {escapePIBody(body.trim())}
                                </span>
                            </>
                        }
                    </span>
                    <br /> {prefix}
                </> :
                <span className='pi-body' onClick={e => {
                    setChildrenOpen(true)
                }}>
                    {escapePIBody(body)}
                </span>
            }

        </div>
    )
}

export const PI_OPEN_BRACKET = (props) =>
    <span className='pi-bracket'>
        &lt;?
        <span className='pi-lang'>{props.node.L}</span>
        {" "}
    </span>

export const PI_CLOSE_BRACKET = () =>
    <span className='pi-bracket'>
        {" "}?&gt;
    </span>

