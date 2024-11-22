import React, { useState } from 'react'

import {
    Button,
    TextInput,
} from './widgets'

import {
    SNACItem,
    SNACElement,
    SwitchStates,
    SNACOpts,
    SwitchModes
} from '../snac/types'

import {
    Prefix,
    ShowHideSwitch
} from './prefix'

import { Attributes, AttributesTable } from './attributes'
import { attributeKeys } from '../snac/textutils'

export const Tag = (props: {
    root: SNACItem[],
    node: SNACElement,
    path: number[],
    snacOpts: SNACOpts,
    getChildren: Function,
    //funcs: { [name: string]: Function }
}): JSX.Element => {

    const [isSelected, setSelected] = useState(props.node.q)
    const [isAttributesOpen, setAttributesOpen] = useState(props.node.a)
    const [isChildrenOpen, setChildrenOpen] = useState(props.node.o)

    let selectedClassName = 'element'

    if (props.snacOpts.xml_showSelected) {
        selectedClassName = isSelected ? 'element selected' : 'element'
    }

    let isEmpty = false
    if (props.node.C.length === 0) {
        isEmpty = true
    }

    return (
        <div className={selectedClassName}>
            <OpenTag
                root={props.root}
                node={props.node}
                path={props.path}
                isEmpty={isEmpty}
                snacOpts={props.snacOpts}
                isSelected={isSelected}
                setSelected={setSelected}
                isAttributesOpen={isAttributesOpen}
                setAttributesOpen={setAttributesOpen}
                isChildrenOpen={isChildrenOpen}
                setChildrenOpen={setChildrenOpen}
            />

            {isChildrenOpen ? props.getChildren(
                props.root,
                props.node["C"],
                props.path,
                //props.funcs,
                props.snacOpts
            ) :
                props.snacOpts.xml_ellipsis
            }

            {!isEmpty && props.snacOpts.xml_showCloseTags ? (
                <CloseTag
                    root={props.root}
                    node={props.node}
                    path={props.path}
                    isEmpty={isEmpty}
                    snacOpts={props.snacOpts}
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
    root: SNACItem[],
    node: SNACElement,
    path: number[],
    isEmpty: boolean,
    snacOpts: SNACOpts,
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

    if (props.snacOpts.xml_showSelected) {
        selectState = props.isSelected ?
            SwitchStates.ON :
            SwitchStates.OFF
    }

    if (props.snacOpts.xml_showAttributesOpen && attributeKeys(props.node.A).length) {
        attributesOpenState = props.isAttributesOpen ?
            SwitchStates.ON :
            SwitchStates.OFF
    }

    if (!props.isEmpty) {
        if (props.snacOpts.xml_showChildrenOpen) {
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
                        snacOpts={props.snacOpts}
                        openClose={e => { setIsEditable(false) }}
                    />
                </> :
                <>
                    <ShowHideSwitch
                        root={props.root}
                        path={props.path}
                        selected={selectState}
                        visible={mode === 'VIEW_MODE'}
                        chars={props.snacOpts.switch_selectChars}
                        className='selected-show-hide'
                        openClose={e => props.setSelected(!props.isSelected)}
                    />

                    <Prefix
                        path={props.path}
                        snacOpts={props.snacOpts}
                    />

                    <ShowHideSwitch
                        root={props.root}
                        path={props.path}
                        selected={childrenOpenState}
                        visible={mode === 'VIEW_MODE'}
                        chars={props.snacOpts.switch_elementChars}
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
                                snacOpts={props.snacOpts}
                            /> :
                            null
                        }
                    </>
                    {closeSlash}&gt;
                    <ShowHideSwitch
                        root={props.root}
                        path={props.path}
                        selected={attributesOpenState}
                        visible={mode === 'VIEW_MODE'}
                        chars={props.snacOpts.switch_attributeChars}
                        className='attributes-show-hide'
                        openClose={e => props.setAttributesOpen(!props.isAttributesOpen)}
                    />
                </>
            }

        </>
    )
}

export const CloseTag = (props: {
    root: SNACItem[],
    node: SNACElement,
    path: number[],
    isEmpty: boolean,
    isSelected: boolean,
    setSelected: Function
    isChildrenOpen: boolean,
    setChildrenOpen: Function
    snacOpts: SNACOpts,
}): JSX.Element | null => {

    const [mode, setMode] = useState<SwitchModes>('VIEW_MODE') // VIEW_MODE, EDIT_MODE, INSERT_MODE


    let selectState = SwitchStates.HIDDEN
    let childrenOpenState = SwitchStates.HIDDEN

    if (props.snacOpts.xml_showSelected) {
        selectState = props.isSelected ? SwitchStates.ON : SwitchStates.OFF
    }

    if (props.isEmpty) {
        if (props.snacOpts.xml_showChildrenOpen) {
            childrenOpenState = props.isChildrenOpen ? SwitchStates.ON : SwitchStates.OFF
        }
    }

    return (
        <>
            {props.isChildrenOpen ? (
                <>
                    <ShowHideSwitch
                        root={props.root}
                        path={props.path}
                        selected={selectState}
                        visible={mode === 'VIEW_MODE'}
                        chars={props.snacOpts.switch_selectChars}
                        className='selected-show-hide'
                        openClose={e => props.setSelected(!props.isSelected)}
                    />
                    <Prefix path={props.path} snacOpts={props.snacOpts} />
                    <ShowHideSwitch
                        root={props.root}
                        path={props.path}
                        selected={childrenOpenState}
                        visible={mode === 'VIEW_MODE'}
                        chars={props.snacOpts.switch_elementChars}
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
    snacOpts: SNACOpts,
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
    const height = numRows * 1.4
    const pathWidth = props.path.length * 1.2

    let rows = ''
    for (let i in keys) {
        rows += ' .6fr'
    }

    return (
        <>
            <span className='attributes-table' style={{
                display: 'grid',
                gridTemplateColumns:
                    `${pathWidth}em min-content min-content min-content min-content 6em 6em`,
                gridAutoRows: `${rows}`,
                height: `${height}em`,
            }}>
                <span className='table-prefix'
                    style={{
                        gridArea: `1 / 1 / ${numRows} / 1`,
                        backgroundColor: 'pink',
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
                            <span style={{display:'block',width:'6em'}}>

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
                                    //setAttributes()
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



