import React, { useContext, useState } from 'react'
import { SNACPINode, SwitchStates, XMLRWType, XMLTagOpenCloseType } from "../snac/types"
import { Prefix } from './prefix'
import { Button, DropDownList, TextArea, EditTextBox } from './widgets'
import { escapePIBody, trimBody } from '../snac/textutils'
import { snacOpts } from '../snac/opts'
import { ShowHideSwitch } from './showhide'
import { XMLRWContext } from '../snac/contexts'
import { XmlShow } from './xmlshow'

export const PI = (props: {
    node: SNACPINode,
    path: number[],
}): JSX.Element | null => {

    const xmlRWContext = useContext(XMLRWContext) as XMLRWType
    
    const [isSelected, setSelected] = useState(false)
    const [isChildrenOpen, setChildrenOpen] = useState(false)
    const [isEditable, setIsEditable] = useState(false)

    const [newPILang, setNewPILang] = useState(props.node.L)
    const [newPIBody, setNewPIBody] = useState(props.node.B)
    const [prevPILang, setPrevPILang] = useState(props.node.L)
    const [prevPIBody, setPrevPIBody] = useState(props.node.B)

    let selectState = SwitchStates.HIDDEN
    let selectedClassName = 'pi'

    if (xmlRWContext.treeMode) {
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
    if (xmlRWContext.treeMode) {
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
            <XmlShow
                path={props.path}
                className='comment'>
                <PIOpenBracket />
                <span className='pi-lang'>
                    {props.node.L}
                </span>
                {" "}
                {props.node.B.trim()}<br />
                <PICloseBracket />
            </XmlShow>
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

