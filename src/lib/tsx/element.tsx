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
    AttributesType
} from '../snac/types'

import {
    Prefix,
    ShowHideSwitch
} from './prefix'

import { Attributes, AttributesTable } from './attributes'

export const Tag = (props: {
    root: SNACItem[],
    node: SNACElement,
    path: number[],
    opts: SNACOpts,
    getChildren: Function,
    funcs: { [name: string]: Function }
}): JSX.Element => {

    const [isSelected, setSelected] = useState(props.node.q)
    const [isAttributesOpen, setAttributesOpen] = useState(props.node.a)
    const [isChildrenOpen, setChildrenOpen] = useState(props.node.o)

    let selectedClassName = 'element'

    if (props.opts.xml_showSelected) {
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
                opts={props.opts}
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
                props.funcs,
                props.opts
            ) :
                props.opts.xml_ellipsis
            }

            {!isEmpty && props.opts.xml_showCloseTags ? (
                <CloseTag
                    root={props.root}
                    node={props.node}
                    path={props.path}
                    isEmpty={isEmpty}
                    opts={props.opts}
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
    opts: SNACOpts,
    isSelected: boolean,
    setSelected: Function
    isAttributesOpen: boolean,
    setAttributesOpen: Function
    isChildrenOpen: boolean,
    setChildrenOpen: Function
}): JSX.Element => {

    const [isEditable, setIsEditable] = useState(false)

    let selectState = SwitchStates.HIDDEN
    let attributesOpenState = SwitchStates.HIDDEN
    let childrenOpenState = SwitchStates.HIDDEN
    let closeSlash = "/"

    if (props.opts.xml_showSelected) {
        selectState = props.isSelected ?
            SwitchStates.ON :
            SwitchStates.OFF
    }

    if (props.opts.xml_showAttributesOpen && Object.keys(props.node.A).length) {
        attributesOpenState = props.isAttributesOpen ?
            SwitchStates.ON :
            SwitchStates.OFF
    }

    if (!props.isEmpty) {
        if (props.opts.xml_showChildrenOpen) {
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
                        opts={props.opts}
                        openClose={e => { setIsEditable(false) }}
                    />
                </> :
                <>
                    <ShowHideSwitch
                        root={props.root}
                        path={props.path}
                        selected={selectState}
                        chars={props.opts.switch_selectChars}
                        className='selected-show-hide'
                        openClose={e => props.setSelected(!props.isSelected)}
                    />

                    <Prefix
                        path={props.path}
                        opts={props.opts}
                    />

                    <ShowHideSwitch
                        root={props.root}
                        path={props.path}
                        selected={childrenOpenState}
                        chars={props.opts.switch_elementChars}
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
                                opts={props.opts}
                            /> :
                            null
                        }
                    </>
                    {closeSlash}&gt;
                    <ShowHideSwitch
                        root={props.root}
                        path={props.path}
                        selected={attributesOpenState}
                        chars={props.opts.switch_attributeChars}
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
    opts: SNACOpts,
}): JSX.Element | null => {

    let selectState = SwitchStates.HIDDEN
    let childrenOpenState = SwitchStates.HIDDEN

    if (props.opts.xml_showSelected) {
        selectState = props.isSelected ? SwitchStates.ON : SwitchStates.OFF
    }

    if (props.isEmpty) {
        if (props.opts.xml_showChildrenOpen) {
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
                        chars={props.opts.switch_selectChars}
                        className='selected-show-hide'
                        openClose={e => props.setSelected(!props.isSelected)}
                    />
                    <Prefix path={props.path} opts={props.opts} />
                    <ShowHideSwitch
                        root={props.root}
                        path={props.path}
                        selected={childrenOpenState}
                        chars={props.opts.switch_elementChars}
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

    return props.node.S.length > 1 ?
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
    opts: SNACOpts,
    openClose?: Function
}): JSX.Element => {

    const [ns, setNs] = useState(props.node.S)
    const [name, setName] = useState(props.node.N)
    const [attributes, setAttributes] = useState(props.node.A)
    const [isNewMode, setIsNewMode] = useState(true)
    const [isEditMode, setIsEditMode] = useState(false)
    const [index, setIndex] = useState(-1)

    const keys = Object.keys(attributes)
    const numRows = keys.length + 2
    const height = numRows * 1.4
    const width = props.path.length * 1.2

    console.log(JSON.stringify(attributes, null, 4))
    console.log(JSON.stringify(keys, null, 4))

    let rows = ''
    let values = []
    for (let i in keys) {
        console.log(i, keys[i], attributes[keys[i]])
        rows += ' .6fr'
        //values.push(props.attributes[i])
    }

    return (
        <>
            <span className='attributes-table' style={{
                display: 'grid',
                gridTemplateColumns: `${width}em 2em 4em 20em 20em 10em 10em`,
                gridTemplateRows: `${rows}`,
                height: `${height}em`,
                width: 'auto'
            }}>
                <span className='table-prefix'
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
                <span>
                    <TextInput
                        name="ns"
                        className='text-input ns-input'
                        value={ns}
                        size={4}
                        placeholder='ns'
                        onChange={e => setNs(e.target.value)}
                    />
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
                </span>
                <span>
                    <Button
                        className='button text-button'
                        onClick={e => {
                            if (ns.length > 0 && name.length > 0) {
                                console.log(`[${props.path}] <${ns}:${name} />`)
                            }
                            else if (name.length > 0) {
                                console.log(`[${props.path}] <${name} />`)
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
                    isNewMode={isNewMode}
                    isEditMode={isEditMode}
                    index={index}
                    setIsNewMode={setIsNewMode}
                    setIsEditMode={setIsEditMode}
                    setIndex={setIndex}
                    setAttributes={setAttributes}
                />
            </span>
        </>
    )
}



