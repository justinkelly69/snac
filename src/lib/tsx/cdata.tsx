import React, { useState } from 'react'
import { SNACCDATA, SNACItem, SNACOpts, SwitchStates } from '../snac/types'
import { Prefix, ShowHideSwitch } from './prefix'
import { Button, TextArea } from './widgets'

export const CDATA = (props: {
    root: SNACItem[],
    node: SNACCDATA,
    path: number[],
    showSelected: boolean,
    showOpen: boolean,
    opts: SNACOpts,
}): JSX.Element => {

    const [isSelected, setSelected] = useState(false)
    const [isChildrenOpen, setChildrenOpen] = useState(false)
    const [isEditable, setIsEditable] = useState(false)

    const [valueCDATA, setValueCDATA] = useState(props.node.D)
    const [tmpValueCDATA, setTmpValueCDATA] = useState(props.node.D)

    let selectState = SwitchStates.HIDDEN
    let openState = SwitchStates.OFF
    let selectedClassName = 'cdata'

    if (props.showSelected) {
        selectState = isSelected ? SwitchStates.ON : SwitchStates.OFF
        selectedClassName = isSelected ? 'cdata selected' : 'cdata'
    }

    if (props.showOpen) {
        openState = isChildrenOpen ? SwitchStates.ON : SwitchStates.OFF
    }

    let cdata = valueCDATA
    if (!isChildrenOpen && cdata.length > props.opts.xml_trimTextLength) {
        cdata = `${cdata.substring(0, props.opts.xml_trimCDATALength)} ${props.opts.xml_ellipsis}`
    }

    const prefix = <Prefix path={props.path} opts={props.opts} />

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
            <Prefix path={props.path} opts={props.opts} />
            <CDATA_OPEN_BRACKET />
            {openState === SwitchStates.ON ?
                <>
                    <br /> {prefix}
                    <span className='cdata-body'>
                        {isEditable ?
                            <>
                                <span className='text-editor-controls'>
                                    <Button
                                        className='text-button text-save'
                                        onClick={e => {
                                            setIsEditable(false)
                                            setChildrenOpen(false)
                                            setValueCDATA(tmpValueCDATA)
                                            console.log(`<![CDATA[ ${tmpValueCDATA} ]]>`)
                                        }}
                                        label='Save'
                                    />
                                    <Button
                                        className='text-button text-cancel'
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
                                        className='text-button text-edit'
                                        onClick={e => {
                                            setIsEditable(true)
                                            setTmpValueCDATA(valueCDATA)
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
            <CDATA_CLOSE_BRACKET />
        </div>
    )
}

export const CDATA_OPEN_BRACKET = () =>
    <>
        &lt;!
        <span className='cdata-brackets'>
            [
            <span className='cdata-label'>
                CDATA
            </span>
            [
        </span>
    </>

export const CDATA_CLOSE_BRACKET = () =>
    <>
        <span className='cdata-brackets'>
            ]]
        </span>
        &gt;
    </>

export const escapeCDATA = (text: string): string => {
    return text.replace(/]]>/g, ']]&gt;')
}

export const unEscapeCDATA = (text: string): string => {
    return text.replace(/]]&gt;/g, ']]>')
}
