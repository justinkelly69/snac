import React, { useContext, useState } from 'react'
import { SNACCDATA, SwitchStates } from '../snac/types'
import { Prefix } from './prefix'
import { Button, EditTextBox, TextArea } from './widgets'
import { escapeCDATA, trimBody } from '../snac/textutils'
import { snacOpts } from '../snac/opts'
import { ShowHideSwitch } from './showhide'
import { XMLContext } from './xmlout'
import { EditBoxGridStyle } from '../snac/styles'

export const CDATA = (props: {
    node: SNACCDATA,
    path: number[],
    showSelected: boolean,
}): JSX.Element => {

    const xmlContext = useContext(XMLContext)

    const [isSelected, setSelected] = useState(false)
    const [isChildrenOpen, setChildrenOpen] = useState(false)
    const [isEditable, setIsEditable] = useState(false)

    const [newCDATA, setNewCDATA] = useState(props.node.D)
    const [prevCDATA, setPrevCDATA] = useState(props.node.D)

    let selectState = SwitchStates.HIDDEN
    let selectedClassName = 'cdata'

    if (props.showSelected) {
        selectState = isSelected ?
            SwitchStates.ON :
            SwitchStates.OFF
    }

    if (props.showSelected) {
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

    if (xmlContext.treeMode) {
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
                            visible={!isChildrenOpen}
                            chars={snacOpts.switch_selectChars}
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
            </div>
        )
    }
    else {
        return (
            <>
                {props.node.D.trim().length > 0 ?
                    <div className='show-body-code cdata'
                        style={EditBoxGridStyle({
                            pathWidth: props.path.length
                        })}
                    >
                        <span className='show-body-code-prefix'></span>
                        <span className='show-body-code-text'>
                            <CDATAOpenBracket /><br/>
                            {props.node.D.trim()}<br/>
                            <CDATACloseBracket />
                        </span>
                    </div> :
                    null
                }
            </>
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

