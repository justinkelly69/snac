import React, { useState } from 'react'
import { SNACCDATA, SNACItem, SNACOpts, SwitchStates } from '../snac/types'
import { Prefix, ShowHideSwitch } from './prefix'
import { Button, TextArea } from './widgets'
import { escapeCDATA } from '../snac/textutils'
import {
    snacOpts
} from '../snac/opts'

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
    let selectedClassName = 'cdata'

    if (props.showSelected) {
        selectState = isSelected ?
            SwitchStates.ON :
            SwitchStates.OFF

        selectedClassName = isSelected ?
            'cdata selected' :
            'cdata'
    }

    let cdata = valueCDATA
    if (!isChildrenOpen && cdata.length > snacOpts.xml_trimTextLength) {
        cdata = `${cdata.substring(0, snacOpts.xml_trimCDATALength)} ${snacOpts.xml_ellipsis}`
    }

    const prefix = <Prefix
        path={props.path}
    />

    return (
        <div className={selectedClassName}>
            <ShowHideSwitch
                root={props.root}
                path={props.path}
                selected={selectState}
                visible={!isChildrenOpen}
                chars={snacOpts.switch_selectChars}
                className='selected-show-hide'
                openClose={e => setSelected(!isSelected)}
            />

            <Prefix
                path={props.path}
            />

            <CDATAOpenBracket />
            {isChildrenOpen ?
                <>
                    <br /> {prefix}
                    <span className='cdata-body'>
                        {isEditable ?
                            <>
                                <span className='text-editor-controls'>
                                    <Button
                                        className='button text-button'
                                        onClick={e => {
                                            setIsEditable(false)
                                            setChildrenOpen(false)
                                            setValueCDATA(tmpValueCDATA)
                                            console.log(`[${props.path}]:<![CDATA[ ${tmpValueCDATA} ]]>`)
                                        }}
                                        label='Save'
                                    />
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
                                <TextArea
                                    readOnly={false}
                                    className='text-editor-text'
                                    value={tmpValueCDATA}
                                    onChange={e => setTmpValueCDATA(e.target.value)}
                                />
                            </> :
                            <>
                                <span className='text-editor-controls'>
                                    <Button
                                        className='button text-button'
                                        onClick={e => {
                                            setIsEditable(true)
                                            setTmpValueCDATA(valueCDATA)
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
                                <span className='text-editor-text' >
                                    {cdata.trim()}
                                </span>
                            </>
                        }
                    </span>
                    <br /> {prefix}
                </> :
                <span className='cdata-body' onClick={e => {
                    setChildrenOpen(true)
                }}>
                    {escapeCDATA(cdata)}
                </span>
            }
            <CDATACloseBracket />
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
