import React, { useState } from 'react'
import { SNACCDATA, SNACItem, SwitchStates } from '../snac/types'
import { Prefix, ShowHideSwitch } from './prefix'
import { Button, EditTextBox, TextArea } from './widgets'
import { escapeCDATA } from '../snac/textutils'
import { snacOpts } from '../snac/opts'
import { CDATAGridStyle } from '../snac/styles'
import { trimBody } from '../snac/helpers'

export const CDATA = (props: {
    root: SNACItem[],
    node: SNACCDATA,
    path: number[],
    showSelected: boolean,
}): JSX.Element => {

    const [isSelected, setSelected] = useState(false)
    const [isChildrenOpen, setChildrenOpen] = useState(false)
    const [isEditable, setIsEditable] = useState(false)

    const [newCDATA, setNewCDATA] = useState(props.node.D)
    const [prevCDATA, setPrevCDATA] = useState(props.node.D)

    let selectState = SwitchStates.HIDDEN

    if (props.showSelected) {
        selectState = isSelected ?
            SwitchStates.ON :
            SwitchStates.OFF
    }

    const cdata = trimBody(
        isChildrenOpen,
        newCDATA,
        snacOpts.xml_trimCDATALength,
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
                                            setIsEditable(true)
                                            setPrevCDATA(newCDATA)
                                        }}
                                        label='Edit'
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
                                <span className='edit-text-show cdata-disabled'>
                                    {escapeCDATA(cdata.trim())}
                                </span>
                            }
                            editBottomBar={() => <CDATACloseBracket />}
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
                        openClose={e => setSelected(!isSelected)}
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
        </>
    )
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

