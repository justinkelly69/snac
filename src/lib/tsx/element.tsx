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
                        name={props.node.N}
                        attributes={props.node.A}
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
                        name={props.node.N}
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
            <NSName name={props.node.N} />
            &gt;
        </>
    )
}

const NSName = (props: {
    name: string,
    openClose?: Function
}): JSX.Element => {

    const tagNSName = props.name.split(/:/)
    return tagNSName.length > 1 ?
        <span onClick={e => props.openClose && props.openClose()}>
            <span className='element-ns'>
                {tagNSName[0]}
            </span>
            :
            <span className='element-name'>
                {tagNSName[1]}
            </span>
        </span>
        :
        <span onClick={e => props.openClose && props.openClose()}
            className='element-name'>
            {tagNSName[0]}
        </span>
}

const NSNodeEdit = (props: {
    name: string,
    attributes: AttributesType,
    type: string,
    path: number[],
    opts: SNACOpts,
    openClose?: Function
}): JSX.Element => {

    let tagNSName = props.name.split(/:/)

    if (tagNSName.length === 1) {
        tagNSName = ['', tagNSName[0]]
    }

    const [ns, setNs] = useState(tagNSName[0])
    const [name, setName] = useState(tagNSName[1])
    const [isNewMode, setIsNewMode] = useState(true)
    const [isEditMode, setIsEditMode] = useState(false)
    const [index, setIndex] = useState(-1)

    const keys = Object.keys(props.attributes)
    const height = (keys.length + 2) * 1.4
    const width = props.path.length

    let rows = ''
    for (let i in keys) {
        rows += ' .6fr'
    }

    return (
        <>
            <span className='table-prefix'
                style={{

                    height: `${height}vw`,
                    width: `${width}vw`
                }}
            >
            </span>
            <span className='attributes-table' style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 4fr 20fr 20fr 10fr 10fr',
                gridTemplateRows: `${rows}`,
                height: `${height}vw`,
                width: '65.2vw'
            }}>
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
                    attributes={props.attributes}
                    isNewMode={isNewMode}
                    isEditMode={isEditMode}
                    index={index}
                    setIsNewMode={setIsNewMode}
                    setIsEditMode={setIsEditMode}
                    setIndex={setIndex}
                />
            </span>
        </>
    )
}



