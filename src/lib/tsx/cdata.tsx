import React, { useContext, useState } from 'react'
import { SNACCDATA, SwitchStates, XMLRWType, XMLTagOpenCloseType } from '../snac/types'
import { Prefix } from './prefix'
import { Button, EditTextBox, TextArea } from './widgets'
import { escapeCDATA, trimBody } from '../snac/textutils'
import { snacOpts } from '../snac/opts'
import { ShowHideSwitch } from './showhide'
import { XMLRWContext } from './xmlout'
import { XmlShow } from './xmlshow'
import { XMLTagOpenCloseContext } from './element'

export const CDATA = (props: {
    node: SNACCDATA,
    path: number[],
}): JSX.Element => {

    const xmlRWContext = useContext(XMLRWContext) as XMLRWType
    const openCloseContext = useContext(XMLTagOpenCloseContext) as XMLTagOpenCloseType
    
    const [isSelected, setSelected] = useState(false)
    const [isChildrenOpen, setChildrenOpen] = useState(false)
    const [isEditable, setIsEditable] = useState(false)

    const [newCDATA, setNewCDATA] = useState(props.node.D)
    const [prevCDATA, setPrevCDATA] = useState(props.node.D)

    let selectState = SwitchStates.HIDDEN
    let selectedClassName = 'cdata'

    if (xmlRWContext.treeMode) {
        selectState = isSelected ?
            SwitchStates.ON :
            SwitchStates.OFF

        selectedClassName = isSelected ?
            'cdata selected' :
            'cdata'
    }

    const cdata = trimBody(
        isChildrenOpen,
        newCDATA,
        snacOpts.xml_trimCDATALength,
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
                                editTopBar={() => <CDATAOpenBracket />}
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
                                                setNewCDATA(prevCDATA)
                                                console.log(`[${props.path}]:<!-- ${prevCDATA} -->`)
                                            }}
                                            label='Save'
                                        />
                                        <Button
                                            className='button text-button'
                                            onClick={() => {
                                                setIsEditable(false)
                                                setChildrenOpen(false)
                                                setPrevCDATA('')
                                            }}
                                            label='Cancel'
                                        />
                                    </>
                                }
                                editTextArea={() =>
                                    <TextArea
                                        readOnly={false}
                                        className='edit-text-editor cdata-editor'
                                        value={prevCDATA}
                                        onChange={(e: {
                                            target: {
                                                value: React.SetStateAction<string>
                                            }
                                        }) => setPrevCDATA(e.target.value)}
                                    />
                                }
                                editBottomBar={() => <CDATACloseBracket />}
                            /> :
                            <EditTextBox
                                path={props.path}
                                widthMultiplier={widthMultiplier}
                                editTopBar={() => <CDATAOpenBracket />}
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
                                        className='edit-text-show cdata-disabled'
                                        onClick={() => {
                                            setIsEditable(true)
                                            setPrevCDATA(newCDATA)
                                        }}
                                    >
                                        {escapeCDATA(cdata.trim())}
                                    </span>
                                }
                                editBottomBar={() => <CDATACloseBracket />}
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
                        {' '}
                        <CDATAOpenBracket />
                        <span
                            className='edit-text-show cdata'
                            onClick={() => {
                                setChildrenOpen(true)
                            }}>
                            {escapeCDATA(cdata)}
                        </span>
                        {" "}
                        <CDATACloseBracket />
                    </span>
                }
            </div>
        )
    }
    else {
        return (
            <XmlShow
                path={props.path}
                className='cdata'>
                <CDATAOpenBracket /><br />
                {props.node.D.trim()}<br />
                <CDATACloseBracket />
            </XmlShow>
        )
    }
}

export const CDATAOpenBracket = () =>
    <span className='cdata-brackets'>
        &lt;![
        <span className='cdata-label'>
            CDATA
        </span>
        [
    </span>

export const CDATACloseBracket = () =>
    <span className='cdata-brackets'>
        ]]&gt;
    </span>

