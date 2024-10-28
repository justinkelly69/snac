import React, { useState, forwardRef } from 'react'

import {
    Button,
    TextArea,
    TextInput,
} from './widgets'

import {
    SNACItem,
    SNACElement,
    SNACText,
    AttributesType,
    SwitchStates,
    SNACOpts
} from '../snac/types'

import { Prefix, ShowHideSwitch } from './prefix'

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
            {isChildrenOpen ? props.getChildren(props.root, props.node["C"], props.path, props.funcs, props.opts) : props.opts.xml_ellipsis}
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
        selectState = props.isSelected ? SwitchStates.ON : SwitchStates.OFF
    }

    if (props.opts.xml_showAttributesOpen && Object.keys(props.node.A).length) {
        attributesOpenState = props.isAttributesOpen ? SwitchStates.ON : SwitchStates.OFF
    }

    if (!props.isEmpty) {
        if (props.opts.xml_showChildrenOpen) {
            childrenOpenState = props.isChildrenOpen ? SwitchStates.ON : SwitchStates.OFF
        }
        closeSlash = ""
    }

    return (
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
            {isEditable ?
                <>
                    &lt;
                    <NsNameEdit name={props.node.N} type='element' path={props.path} openClose={e => { setIsEditable(false) }} />
                </> :
                <>
                    &lt;
                    <NsName name={props.node.N} type='element' openClose={e => setIsEditable(true)} />
                    <>
                        {props.isAttributesOpen ?
                            <>
                                <Attributes path={props.path} attributes={props.node.A} opts={props.opts} />
                                {Object.keys(props.node.A).length > 0 ?
                                    <>
                                        {props.opts.prefix_spaceBefore}
                                        <Prefix path={props.path} opts={props.opts} />
                                        {props.opts.prefix_spaceAfter}
                                    </>
                                    : null
                                }
                            </> :
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
            <NsName name={props.node.N} type='element' />
            &gt;
        </>
    )
}

export const Text = (props: {
    root: SNACItem[],
    node: SNACText,
    path: number[],
    showSelected: boolean,
    showOpen: boolean,
    opts: SNACOpts,
}): JSX.Element => {

    const [isSelected, setSelected] = useState(false)
    const [isChildrenOpen, setChildrenOpen] = useState(false)
    const [isEditMode, setEditMode] = useState(false)
    const [insertMode, setInsertMode] = useState(false)

    const [nsText, setNSText] = useState('')
    const [nameText, setNameText] = useState('')
    const [valueText, setValueText] = useState(props.node.T)
    const [text, setText] = useState(props.node.T)
    const [beforeText, setBeforeText] = useState('')
    const [duringText, setDuringText] = useState('')
    const [afterText, setAfterText] = useState('')

    let selectState = SwitchStates.HIDDEN
    let openState = SwitchStates.OFF
    let selectedClassName = 'text'

    if (props.showSelected) {
        selectState = isSelected ? SwitchStates.ON : SwitchStates.OFF
        selectedClassName = isSelected ? 'text selected' : 'text'
    }
    if (props.showOpen) {
        openState = isChildrenOpen ? SwitchStates.ON : SwitchStates.OFF
    }

    let tmpText = props.node.T
    if (!isChildrenOpen && text.length > props.opts.xml_trimTextLength) {
        tmpText = `${text.trim().substring(0, props.opts.xml_trimTextLength)} ${props.opts.xml_ellipsis}`
    }

    const prefix = <Prefix path={props.path} opts={props.opts} />

    return (
        <div className={selectedClassName}>
            <span className='text-head'>
                <ShowHideSwitch
                    root={props.root}
                    path={props.path}
                    selected={selectState}
                    chars={props.opts.switch_selectChars}
                    className='selected-show-hide'
                    openClose={e => setSelected(!isSelected)}
                />
                {prefix}
            </span>
            {openState === SwitchStates.ON ?
                <>
                    <span className='text-editor'>
                        {isEditMode ?
                            <>
                                <span className='text-editor-controls'>
                                    <Button
                                        className='text-button text-cancel'
                                        onClick={e => {
                                            setEditMode(false)
                                            setChildrenOpen(false)
                                        }}
                                        label='X'
                                    />
                                    <Button
                                        className='text-button text-save'
                                        onClick={e => {
                                            setEditMode(false)
                                            setChildrenOpen(false)
                                            console.log(valueText)
                                        }}
                                        label='Save'
                                    />
                                </span>
                                <TextArea
                                    readOnly={false}
                                    className='text-editor-text'
                                    value={valueText}
                                    onChange={e => setValueText(e.target.value)}
                                />
                            </> :
                            <>
                                {insertMode ?
                                    <>
                                        <span className='text-editor-controls'>
                                            <Button
                                                className='text-button text-cancel'
                                                onClick={e => {
                                                    setEditMode(false)
                                                    setInsertMode(false)
                                                    setChildrenOpen(false)
                                                }}
                                                label='X'
                                            />
                                            <TextInput
                                                name="ns"
                                                size={4}
                                                placeholder='ns'
                                                onChange={e => setNSText(e.target.value)}
                                            />
                                            <TextInput
                                                name="name"
                                                size={10}
                                                placeholder='name'
                                                onChange={e => setNameText(e.target.value)}
                                            />
                                            <Button
                                                className='text-button text-insert'
                                                onClick={e => {
                                                    if (nsText.length > 0 && nameText.length > 0) {
                                                        const tag = `${nsText}:${nameText}`
                                                        console.log(`${props.path}:${beforeText}<${tag}>${duringText}</${tag}>${afterText}`)
                                                    }
                                                    else if (nameText.length > 0) {
                                                        const tag = `${nameText}`
                                                        console.log(`${props.path}:${beforeText}<${tag}>${duringText}</${tag}>${afterText}`)
                                                    }
                                                    setChildrenOpen(false)
                                                    setInsertMode(false)
                                                    setNSText('')
                                                    setNameText('')
                                                    setBeforeText('')
                                                    setDuringText('')
                                                    setAfterText('')
                                                }}
                                                label='Insert Here'
                                            />
                                        </span>
                                        <TextArea
                                            readOnly={true}
                                            className='text-editor-text'
                                            value={valueText}
                                            onSelect={e => {
                                                const value = e.target.value
                                                const start = e.target.selectionStart
                                                const end = e.target.selectionEnd

                                                setBeforeText(value.substr(0, start))
                                                setDuringText(value.substr(start, end - start))
                                                setAfterText(value.substr(end))
                                            }}
                                        />
                                    </> :
                                    <>
                                        <span className='text-editor-controls'>
                                            <Button
                                                className='text-button text-cancel'
                                                onClick={e => {
                                                    setEditMode(false)
                                                    setInsertMode(false)
                                                    setChildrenOpen(false)
                                                }}
                                                label='X'
                                            />
                                            <Button
                                                className='text-button text-edit'
                                                onClick={e => setEditMode(true)}
                                                label='Edit'
                                            />
                                            <Button
                                                className='text-button text-insert'
                                                onClick={e => setInsertMode(true)}
                                                label='Insert Mode'
                                            />
                                        </span>
                                        <span className='text-editor-text' >
                                            {text.trim()}
                                        </span>
                                    </>
                                }

                            </>
                        }
                    </span>
                    <br />
                </> :
                <span className='text-body' onClick={e => {
                    setChildrenOpen(true)
                }}>
                    <span className='text-bracket'>[</span>
                    {text}
                    <span className='text-bracket'>]</span>
                </span>
            }
        </div>
    )
}

export const Attributes = (props: {
    path: number[],
    attributes: AttributesType,
    opts: SNACOpts
}): JSX.Element | null => {
    return Object.keys(props.attributes).length > 0 ?
        <div>
            {Object.keys(props.attributes).map((a, i) => {
                return (
                    <span key={i}>
                        {i > 0 ? <br /> : null}
                        <Attribute path={props.path} name={a} value={props.attributes[a]} opts={props.opts} />
                    </span>
                )
            })}
        </div> :
        null
}

export const Attribute = (props: {
    path: number[],
    name: string,
    value: string,
    opts: SNACOpts
}): JSX.Element =>
    <span className='attribute'>
        <Prefix path={props.path} opts={props.opts} />
        {props.opts.prefix_attributePrefix}
        <NsName name={props.name} type='attribute' />
        =&quot;
        <span className='attribute-value'>{props.value}</span>
        &quot;
    </span>

const NsName = (props: { name: string, type: string, openClose?: Function }): JSX.Element => {
    const tagNsName = props.name.split(/:/)
    return tagNsName.length > 1 ?
        <span onClick={e => props.openClose && props.openClose()}>
            <span className={`${props.type}-ns`}>
                {tagNsName[0]}
            </span>
            :
            <span className={`${props.type}-name`}>
                {tagNsName[1]}
            </span>
        </span>
        :
        <span onClick={e => props.openClose && props.openClose()}
            className={`${props.type}-name`}>
            {tagNsName[0]}
        </span>
}

const NsNameEdit = (props: { name: string, type: string, path: number[], openClose?: Function }): JSX.Element => {

    let tagNsName = props.name.split(/:/)
    if (tagNsName.length === 1) {
        tagNsName = ['', tagNsName[0]]
    }

    const [ns, setNs] = useState(tagNsName[0])
    const [name, setName] = useState(tagNsName[1])

    return (
        <span className='text-editor-controls'>
            <Button
                className='text-button text-insert'
                onClick={e => {
                    props.openClose && props.openClose()
                }}
                label='X'
            />
            <TextInput
                name="ns"
                value={ns}
                size={4}
                placeholder='ns'
                onChange={e => setNs(e.target.value)}
            />
            <TextInput
                name="name"
                value={name}
                size={10}
                placeholder='name'
                onChange={e => setName(e.target.value)}
            />
            <Button
                className='text-button text-insert'
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
    )
}



