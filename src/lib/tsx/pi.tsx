import React, { useContext, useState } from 'react'
import { SNACPINode, SwitchStates } from "../snac/types"
import { Prefix } from './prefix'
import { Button, DropDownList, TextArea, EditTextBox } from './widgets'
import { escapePIBody, trimBody } from '../snac/textutils'
import { snacOpts } from '../snac/opts'
import { ShowHideSwitch } from './showhide'
import { XMLContext } from './xmlout'
import { EditBoxGridStyle } from '../snac/styles'

export const PI = (props: {
    node: SNACPINode,
    path: number[],
    showSelected: boolean,
}): JSX.Element | null => {

    const xmlContext = useContext(XMLContext)

    const [isSelected, setSelected] = useState(false)
    const [isChildrenOpen, setChildrenOpen] = useState(false)
    const [isEditable, setIsEditable] = useState(false)

    const [newPILang, setNewPILang] = useState(props.node.L)
    const [newPIBody, setNewPIBody] = useState(props.node.B)
    const [prevPILang, setPrevPILang] = useState(props.node.L)
    const [prevPIBody, setPrevPIBody] = useState(props.node.B)

    let selectState = SwitchStates.HIDDEN
    let selectedClassName = 'pi'

    if (props.showSelected) {
        selectState = isSelected ?
            SwitchStates.ON :
            SwitchStates.OFF

        selectedClassName = isSelected ?
            'pi selected' :
            'pi'
    }

    const body = trimBody(
        isChildrenOpen,
        newPIBody,
        snacOpts.xml_trimPIBodyLength,
        snacOpts.xml_ellipsis
    )

    const widthMultiplier = 1
    if (xmlContext.treeMode) {
        return (
            <div className={selectedClassName}>
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
                                        onChange={(e: {
                                            target: {
                                                value: React.SetStateAction<string>
                                            }
                                        }) => setNewPIBody(e.target.value)}
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
                                            {newPILang}
                                        </span>
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
                                            }}
                                            label='Remove'
                                        />
                                    </>
                                }
                                editTextArea={() =>
                                    <span
                                        className='edit-text-show pi-disabled'
                                        onClick={() => {
                                            setIsEditable(true)
                                            setPrevPIBody(newPIBody)
                                        }}
                                    >
                                        {escapePIBody(body)}
                                    </span>
                                }
                                editBottomBar={() => <PICloseBracket />}
                            />
                        }
                    </> :
                    <span>
                        <ShowHideSwitch
                            path={props.path}
                            selected={selectState}
                            visible={!isChildrenOpen}
                            chars={snacOpts.switch_selectChars}
                            openClose={() => setSelected(!isSelected)}
                        />
                        <Prefix path={props.path} />
                        <PIOpenBracket />
                        <span className='pi-lang'>{newPILang}</span>
                        {" "}
                        <span
                            className='edit-text-show pi'
                            onClick={() => {
                                setChildrenOpen(true)
                            }}>
                            {escapePIBody(body)}
                        </span>
                        {" "}
                        <PICloseBracket />
                    </span>

                }
            </div>
        )
    }
    else {
        return (
            <>
                {props.node.B.trim().length > 0 ?
                    <div className='show-body-code pi'
                        style={EditBoxGridStyle({
                            pathWidth: props.path.length
                        })}
                    >
                        <span className='show-body-code-prefix'></span>
                        <span className='show-body-code-text'>
                            <PIOpenBracket />
                            <span className='pi-lang'>
                                {props.node.L}
                            </span>
                            <br />
                            {props.node.B.trim()}<br />
                            <PICloseBracket />
                        </span>
                    </div> :
                    null
                }
            </>
        )
    }
}

export const PIOpenBracket = () =>
    <span className='pi-brackets'>
        &lt;?
    </span>

export const PICloseBracket = () =>
    <span className='pi-brackets'>
        ?&gt;
    </span>

