import React, { useState } from 'react'
import { SNACCDATA, SNACItem, SwitchStates } from '../snac/types'
import { Prefix, ShowHideSwitch } from './prefix'
import { Button, TextArea } from './widgets'
import { escapeCDATA } from '../snac/textutils'
import { snacOpts } from '../snac/opts'
import { CDATAGridStyle } from '../snac/styles'

export const CDATA = (props: {
    root: SNACItem[],
    node: SNACCDATA,
    path: number[],
    showSelected: boolean,
}): JSX.Element => {

    const [isSelected, setSelected] = useState(false)
    const [isChildrenOpen, setChildrenOpen] = useState(false)
    const [isEditable, setIsEditable] = useState(false)

    const [valueCDATA, setValueCDATA] = useState(props.node.D)
    const [tmpValueCDATA, setTmpValueCDATA] = useState(props.node.D)

    let selectState = SwitchStates.HIDDEN

    if (props.showSelected) {
        selectState = isSelected ?
            SwitchStates.ON :
            SwitchStates.OFF
    }

    let cdata = valueCDATA
    if (!isChildrenOpen && cdata.length > snacOpts.xml_trimTextLength) {
        cdata = `${cdata.substring(0, snacOpts.xml_trimCDATALength)} ${snacOpts.xml_ellipsis}`
    }

    return (
        <div className='cdata'>

            {isChildrenOpen ?
                <span className='cdata-table'
                    style={CDATAGridStyle({
                        pathWidth: props.path.length * 0.76,
                        xButtonWidth: 1,
                        buttonWidth: 6,
                    })}
                >
                    <span className='cdata-prefix'></span>
                    <span className='cdata-open-bracket'>
                        <CDATAOpenBracket />
                    </span>
                    {isEditable ?
                        <>
                            <span className='cdata-x-button'>
                                <Button
                                    className='button x-button'
                                    onClick={e => {
                                        setChildrenOpen(false)
                                    }}
                                    label='X'
                                />
                            </span>
                            <span className='cdata-button-1'>
                                <Button
                                    className='button text-button'
                                    onClick={e => {
                                        setIsEditable(false)
                                        setChildrenOpen(false)
                                        setValueCDATA(tmpValueCDATA)
                                        console.log(`[${props.path}]:<!-- ${tmpValueCDATA} -->`)
                                    }}
                                    label='Save'
                                />
                            </span>
                            <span className='cdata-button-2'>
                                <Button
                                    className='button text-button'
                                    onClick={e => {
                                        setIsEditable(false)
                                        setChildrenOpen(false)
                                        setTmpValueCDATA('')
                                    }}
                                    label='Cancel'
                                />
                            </span>
                            <span className='cdata-button-3'></span>
                            <span className='cdata-text'>
                                <TextArea
                                    readOnly={false}
                                    className='cdata-text-editor'
                                    value={tmpValueCDATA}
                                    onChange={e => setTmpValueCDATA(e.target.value)}
                                />
                            </span>
                        </> :
                        <>
                            <span className='cdata-x-button'>
                                <Button
                                    className='button x-button'
                                    onClick={e => {
                                        setChildrenOpen(false)
                                    }}
                                    label='X'
                                />
                            </span>
                            <span className='cdata-button-1'>
                                <Button
                                    className='button text-button'
                                    onClick={e => {
                                        setIsEditable(true)
                                        setTmpValueCDATA(valueCDATA)
                                    }}
                                    label='Edit'
                                />
                            </span>
                            <span className='cdata-button-2'>
                                <Button
                                    className='button text-button'
                                    onClick={e => {
                                        setIsEditable(false)
                                        setChildrenOpen(false)
                                    }}
                                    label='Remove'
                                />
                            </span>
                            <span className='cdata-button-3'></span>
                            <span className='cdata-text' >
                                {escapeCDATA(cdata.trim())}
                            </span>
                        </>
                    }
                    <span className='cdata-close-bracket'>
                        <CDATACloseBracket />
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
                    <CDATAOpenBracket />
                    <span className='cdata-body' onClick={e => {
                        setChildrenOpen(true)
                    }}>
                        {escapeCDATA(cdata)}
                    </span>
                    <CDATACloseBracket />
                </span>
            }
        </div>
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

