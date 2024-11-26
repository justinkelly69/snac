import React, { useState } from 'react'

import {
    Button,
    TextInput,
} from './widgets'

import {
    SNACItem,
    SNACElement,
    SwitchStates,
    SwitchModes
} from '../snac/types'

import {
    snacOpts
} from '../snac/opts'

import {
    Prefix,
    ShowHideSwitch
} from './prefix'

import { Attributes, AttributesTable } from './attributes'
import { attributeKeys } from '../snac/textutils'
import { attributesGridStyle } from '../snac/styles'

export const Tag = (props: {
    node: SNACElement,
    path: number[],
    getChildren: Function,
}): JSX.Element => {

    const [isSelected, setSelected] = useState(false)
    const [isAttributesOpen, setAttributesOpen] = useState(false)
    const [isChildrenOpen, setChildrenOpen] = useState(true)

    let selectedClassName = 'element'

    if (snacOpts.xml_showSelected) {
        selectedClassName = isSelected ? 'element selected' : 'element'
    }

    let isEmpty = false
    if (props.node.C.length === 0) {
        isEmpty = true
    }

    return (
        <div className={selectedClassName}>
            <OpenTag
                node={props.node}
                path={props.path}
                isEmpty={isEmpty}
                isSelected={isSelected}
                setSelected={setSelected}
                isAttributesOpen={isAttributesOpen}
                setAttributesOpen={setAttributesOpen}
                isChildrenOpen={isChildrenOpen}
                setChildrenOpen={setChildrenOpen}
            />

            {isChildrenOpen ?
                props.getChildren(
                    props.node.C,
                    props.path,
                ) :
                snacOpts.xml_ellipsis
            }

            {!isEmpty && snacOpts.xml_showCloseTags ? (
                <CloseTag
                    node={props.node}
                    path={props.path}
                    isEmpty={isEmpty}
                    isSelected={isSelected}
                    setSelected={setSelected}
                    isChildrenOpen={isChildrenOpen}
                    setChildrenOpen={setChildrenOpen}
                />
            ) :
                null
            }
        </div>
    )
}

export const OpenTag = (props: {
    node: SNACElement,
    path: number[],
    isEmpty: boolean,
    isSelected: boolean,
    setSelected: Function
    isAttributesOpen: boolean,
    setAttributesOpen: Function
    isChildrenOpen: boolean,
    setChildrenOpen: Function
}): JSX.Element => {

    const [isEditable, setIsEditable] = useState(false)
    const [mode, setMode] = useState<SwitchModes>('VIEW_MODE') // VIEW_MODE, EDIT_MODE, INSERT_MODE


    let selectState = SwitchStates.HIDDEN
    let attributesOpenState = SwitchStates.HIDDEN
    let childrenOpenState = SwitchStates.HIDDEN
    let closeSlash = "/"

    if (snacOpts.xml_showSelected) {
        selectState = props.isSelected ?
            SwitchStates.ON :
            SwitchStates.OFF
    }

    if (snacOpts.xml_showAttributesOpen && attributeKeys(props.node.A).length) {
        attributesOpenState = props.isAttributesOpen ?
            SwitchStates.ON :
            SwitchStates.OFF
    }

    if (!props.isEmpty) {
        if (snacOpts.xml_showChildrenOpen) {
            childrenOpenState = props.isChildrenOpen ?
                SwitchStates.ON :
                SwitchStates.OFF
        }
        closeSlash = ""
    }

    return (
        <>
            {isEditable ?
                <>
                    <NSNodeEdit
                        node={props.node}
                        type='element'
                        path={props.path}
                        openClose={e => { setIsEditable(false) }}
                    />
                </> :
                <>
                    <ShowHideSwitch
                        path={props.path}
                        selected={selectState}
                        visible={mode === 'VIEW_MODE'}
                        chars={snacOpts.switch_selectChars}
                        className='selected-show-hide'
                        openClose={e => props.setSelected(!props.isSelected)}
                    />

                    <Prefix
                        path={props.path}
                    />

                    <ShowHideSwitch
                        path={props.path}
                        selected={childrenOpenState}
                        visible={mode === 'VIEW_MODE'}
                        chars={snacOpts.switch_elementChars}
                        className='element-show-hide'
                        openClose={e => props.setChildrenOpen(!props.isChildrenOpen)}
                    />
                    &lt;
                    <NSName
                        node={props.node}
                        openClose={e => setIsEditable(true)}
                    />
                    <>
                        {props.isAttributesOpen ?
                            <Attributes
                                attributes={props.node.A}
                                path={props.path}
                            /> :
                            null
                        }
                    </>
                    {closeSlash}&gt;
                    <ShowHideSwitch
                        path={props.path}
                        selected={attributesOpenState}
                        visible={mode === 'VIEW_MODE'}
                        chars={snacOpts.switch_attributeChars}
                        className='attributes-show-hide'
                        openClose={e => props.setAttributesOpen(!props.isAttributesOpen)}
                    />
                </>
            }

        </>
    )
}

export const CloseTag = (props: {
    node: SNACElement,
    path: number[],
    isEmpty: boolean,
    isSelected: boolean,
    setSelected: Function
    isChildrenOpen: boolean,
    setChildrenOpen: Function
}): JSX.Element | null => {

    const [mode, setMode] = useState<SwitchModes>('VIEW_MODE') // VIEW_MODE, EDIT_MODE, INSERT_MODE


    let selectState = SwitchStates.HIDDEN
    let childrenOpenState = SwitchStates.HIDDEN

    if (snacOpts.xml_showSelected) {
        selectState = props.isSelected ? SwitchStates.ON : SwitchStates.OFF
    }

    if (props.isEmpty) {
        if (snacOpts.xml_showChildrenOpen) {
            childrenOpenState = props.isChildrenOpen ? SwitchStates.ON : SwitchStates.OFF
        }
    }

    return (
        <>
            {props.isChildrenOpen ? (
                <>
                    <ShowHideSwitch
                        path={props.path}
                        selected={selectState}
                        visible={mode === 'VIEW_MODE'}
                        chars={snacOpts.switch_selectChars}
                        className='selected-show-hide'
                        openClose={e => props.setSelected(!props.isSelected)}
                    />
                    <Prefix path={props.path} />
                    <ShowHideSwitch
                        path={props.path}
                        selected={childrenOpenState}
                        visible={mode === 'VIEW_MODE'}
                        chars={snacOpts.switch_elementChars}
                        className='element-show-hide'
                        openClose={e => props.setChildrenOpen(!props.isChildrenOpen)}
                    />
                </>
            ) :
                null
            }
            &lt;/
            <NSName node={props.node} />
            &gt;
        </>
    )
}

const NSName = (props: {
    node: SNACElement,
    openClose?: Function
}): JSX.Element => {

    return props.node.S.length > 0 ?
        <span onClick={e => props.openClose && props.openClose()}>
            <span className='element-ns'>
                {props.node.S}
            </span>
            :
            <span className='element-name'>
                {props.node.N}
            </span>
        </span>
        :
        <span onClick={e => props.openClose && props.openClose()}
            className='element-name'>
            {props.node.N}
        </span>
}



const NSNodeEdit = (props: {
    node: SNACElement,
    type: string,
    path: number[],
    openClose?: Function
}): JSX.Element => {

    const [oldNs, setOldNs] = useState(props.node.S)
    const [oldName, setOldName] = useState(props.node.N)
    const [ns, setNs] = useState(props.node.S)
    const [name, setName] = useState(props.node.N)

    const [attributes, setAttributes] = useState(props.node.A)
    const [editAttributes, setEditAttributes] = useState(true)

    const keys = attributeKeys(attributes)
    const [numRows, setNumRows] = useState(keys.length + 2)

    return (
        <>
            <span
                className='attributes-table'
                style={attributesGridStyle({
                    keys: keys, 
                    pathWidth: props.path.length * 1.2, 
                    buttonWidth: 6,
                    cellWidth: 6,
                    height: numRows * 1.4,
                })}
            >
                <span
                    style={{
                        gridArea: `1 / 1 / ${numRows} / 1`,
                    }}
                ></span>
                <span>
                    <Button
                        className='button x-button'
                        onClick={e => {
                            props.openClose && props.openClose()
                        }}
                        label='X'
                    />
                </span>
                {editAttributes ?
                    <>
                        <span className='element-ns'>
                            {ns.length > 0 && `${ns}:`}
                        </span>
                        <span className='element-name'>
                            {name}
                        </span>
                        <span>
                            <Button
                                className='button text-button'
                                onClick={e => {
                                    setEditAttributes(false)
                                }}
                                label='Edit'
                            />
                            <span style={{ display: 'block', width: '6em' }}>
                            </span>
                        </span>
                    </> :
                    <>
                        <span>
                            <TextInput
                                name="ns"
                                className='text-input ns-input'
                                value={ns}
                                size={4}
                                placeholder='ns'
                                onChange={e => setNs(e.target.value)}
                            />
                            :
                        </span>
                        <span>
                            <TextInput
                                name="name"
                                className='text-input name-input'
                                value={name}
                                size={10}
                                placeholder='name'
                                onChange={e => setName(e.target.value)}
                            />
                        </span>
                        <span>
                            <Button
                                className='button text-button'
                                onClick={e => {
                                    setOldNs(ns)
                                    setOldName(name)
                                    setEditAttributes(true)
                                    console.log(`<${ns}:${name}>`)
                                }}
                                label='Save'
                            />
                            <Button
                                className='button text-button'
                                onClick={e => {
                                    setNs(oldNs)
                                    setName(oldName)
                                    setEditAttributes(true)
                                }}
                                label='Cancel'
                            />
                        </span>
                    </>
                }
                <span>
                    <Button
                        className='button text-button'
                        onClick={e => {
                            if (ns.length > 0 && name.length > 0) {
                                console.log(`[${props.path}]:<${ns}:${name} />`)
                            }
                            else if (name.length > 0) {
                                console.log(`[${props.path}]:<${name} />`)
                            }
                            props.openClose && props.openClose()
                        }}
                        label='Save'
                    />
                </span>
                <span>
                    <Button
                        className='button text-button'
                        onClick={f => f}
                        label='Cancel'
                    />
                </span>
                <AttributesTable
                    path={props.path}
                    attributes={attributes}
                    setAttributes={setAttributes}
                    editAttributes={editAttributes}
                    numRows={numRows}
                    setNumRows={setNumRows}
                />
            </span>
        </>
    )
}



