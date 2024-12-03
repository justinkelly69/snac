import React, { useContext, useState } from 'react'
import { Button, TextInput } from './widgets'
import {
    SNACElement, SwitchStates,
    XMLModesType, XMLRWType, XMLTagOpenCloseType
} from '../snac/types'
import { snacOpts } from '../snac/opts'
import { Prefix } from './prefix'
import { Attributes, AttributesTable } from './attributes'
import { Kids } from './kids'
import { attributeKeys } from '../snac/textutils'
import { attributesGridStyle, EditBoxGridStyle } from '../snac/styles'
import { ShowHideSwitch } from './showhide'
import {
    XMLRWContext, XMLTagOpenCloseContext, XMLAttributesOpenCloseContext,
    XMLModesContext, insertPath
} from '../snac/contexts'
import { hasPath } from '../snac/paths'

export const Element = (props: {
    node: SNACElement,
    path: number[],
    isSelected: boolean,
}): JSX.Element => {

    const xmlRWContext = useContext(XMLRWContext) as XMLRWType
    const xmlModesContext = useContext(XMLModesContext) as XMLModesType

    const [isAttributesOpen, setAttributesOpen] = useState(false)
    const [isChildrenOpen, setChildrenOpen] = useState(true)

    const isSelected = hasPath(xmlModesContext.paths, props.path) || props.isSelected

    let selectedClassName = 'element'

    if (xmlRWContext.treeMode && snacOpts.xml_showSelected && xmlModesContext.paths.length > 0) {
        selectedClassName = isSelected ?
            'element selected' :
            'element'
    }

    const isEmpty = props.node.C.length === 0

    const xmlTagOpenCloseContext = {
        isEmpty: props.node.C.length === 0,
        isSelected: isSelected,
        isAttributesOpen: isAttributesOpen,
        setAttributesOpen: setAttributesOpen,
        isChildrenOpen: isChildrenOpen,
        setChildrenOpen: setChildrenOpen,
    }

    return (
        <XMLTagOpenCloseContext.Provider
            value={xmlTagOpenCloseContext}>
            <div className={selectedClassName}>

                {xmlRWContext.treeMode || isSelected ?
                    <OpenTag
                        node={props.node}
                        path={props.path}
                    />
                    :
                    null
                }

                {isChildrenOpen ?
                    <Kids
                        snac={props.node.C}
                        path={props.path}
                        isSelected={isSelected}
                    /> :
                    snacOpts.xml_ellipsis
                }

                {isSelected && !isEmpty && (!xmlRWContext.treeMode || snacOpts.xml_showCloseTags) ? (
                    <CloseTag
                        node={props.node}
                        path={props.path}
                    />
                ) :
                    null
                }
            </div>
        </XMLTagOpenCloseContext.Provider>
    )
}

export const OpenTag = (props: {
    node: SNACElement,
    path: number[],
}): JSX.Element => {

    const xmlModesContext = useContext(XMLModesContext) as XMLModesType
    const xmlRWContext = useContext(XMLRWContext) as XMLRWType
    const openCloseContext = useContext(XMLTagOpenCloseContext) as XMLTagOpenCloseType

    const [isEditable, setIsEditable] = useState(false)

    let selectState = SwitchStates.HIDDEN
    let attributesOpenState = SwitchStates.HIDDEN
    let childrenOpenState = SwitchStates.HIDDEN
    let closeSlash = "/"

    if (snacOpts.xml_showSelected) {
        selectState = openCloseContext.isSelected ?
            SwitchStates.ON :
            SwitchStates.OFF
    }

    if (snacOpts.xml_showAttributesOpen &&
        Object.keys(props.node.A).length > 0) {
        attributesOpenState = openCloseContext.isAttributesOpen ?
            SwitchStates.ON :
            SwitchStates.OFF
    }

    if (!openCloseContext.isEmpty) {
        if (snacOpts.xml_showChildrenOpen) {
            childrenOpenState = openCloseContext.isChildrenOpen ?
                SwitchStates.ON :
                SwitchStates.OFF
        }
        closeSlash = ""
    }
    if (xmlRWContext.treeMode) {
        return (
            <>
                {isEditable ?
                    <>
                        <NSNodeEdit
                            node={props.node}
                            type='element'
                            path={props.path}
                            openClose={() => {
                                setIsEditable(false)
                            }}
                        />
                    </> :
                    <>
                        <ShowHideSwitch
                            path={props.path}
                            selected={selectState}
                            chars={snacOpts.switch_selectChars}
                            openClose={() => insertPath(
                                xmlModesContext,
                                props.path,
                            )}
                        />
                        <Prefix path={props.path} />
                        <ShowHideSwitch
                            path={props.path}
                            selected={childrenOpenState}
                            chars={snacOpts.switch_elementChars}
                            openClose={() =>
                                openCloseContext.setChildrenOpen(
                                    !openCloseContext.isChildrenOpen
                                )
                            }
                        />
                        &lt;
                        <NSName
                            node={props.node}
                            openClose={() =>
                                setIsEditable(true)
                            }
                        />
                        <>
                            {openCloseContext.isAttributesOpen ?
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
                            chars={snacOpts.switch_attributeChars}
                            openClose={() =>
                                openCloseContext.setAttributesOpen(
                                    !openCloseContext.isAttributesOpen
                                )
                            }
                        />
                    </>
                }
            </>
        )
    }
    else {
        return (
            <div className='show-body-code'
                style={EditBoxGridStyle({
                    pathWidth: props.path.length
                })}
            >
                <span className='show-body-code-prefix'></span>
                <span className='show-body-code-text'>
                    &lt;
                    <NSName node={props.node} />
                    <Attributes
                        attributes={props.node.A}
                        path={props.path}
                    />
                    {props.node.C.length === 0 &&
                        '/'
                    }
                    &gt;
                </span>
            </div>
        )
    }
}

export const CloseTag = (props: {
    node: SNACElement,
    path: number[],
}): JSX.Element | null => {

    const xmlRWContext = useContext(XMLRWContext) as XMLRWType
    const openCloseContext = useContext(XMLTagOpenCloseContext) as XMLTagOpenCloseType

    let selectState = SwitchStates.HIDDEN
    let childrenOpenState = SwitchStates.HIDDEN

    if (snacOpts.xml_showSelected) {
        selectState = openCloseContext.isSelected ?
            SwitchStates.ON :
            SwitchStates.OFF
    }

    if (openCloseContext.isEmpty) {
        if (snacOpts.xml_showChildrenOpen) {
            childrenOpenState = openCloseContext.isChildrenOpen ?
                SwitchStates.ON :
                SwitchStates.OFF
        }
    }

    if (xmlRWContext.treeMode) {
        return (
            <>
                {openCloseContext.isChildrenOpen ? (
                    <>
                        <ShowHideSwitch
                            path={props.path}
                            selected={selectState}
                            chars={snacOpts.switch_selectChars}
                            openClose={(f: any) => f}
                        />
                        <Prefix path={props.path} />
                        <ShowHideSwitch
                            path={props.path}
                            selected={childrenOpenState}
                            chars={snacOpts.switch_elementChars}
                            openClose={() =>
                                openCloseContext.setChildrenOpen(
                                    !openCloseContext.isChildrenOpen
                                )
                            }
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
    else {
        return (
            <div className='show-body-code'
                style={EditBoxGridStyle({
                    pathWidth: props.path.length
                })}
            >
                <span className='show-body-code-prefix'></span>
                <span className='show-body-code-text'>
                    &lt;/
                    <NSName node={props.node} />
                    &gt;
                </span>
            </div>
        )
    }
}

const NSName = (props: {
    node: SNACElement,
    openClose?: Function
}): JSX.Element => {

    return props.node.S.length > 0 ?
        <span onClick={() => props.openClose && props.openClose()}>
            <span className='element-ns'>
                {props.node.S}
            </span>
            :
            <span className='element-name'>
                {props.node.N}
            </span>
        </span>
        :
        <span onClick={() => props.openClose && props.openClose()}
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

    const attributesOpenCloseContext = {
        setAttributes: setAttributes,
        editAttributes: editAttributes,
        numRows: numRows,
        setNumRows: setNumRows,
    }

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
                        onClick={() => {
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
                                onClick={() => {
                                    setEditAttributes(false)
                                }}
                                label='Edit'
                            />
                            <span style={{
                                display: 'block',
                                width: '6em'
                            }}>
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
                                onChange={(e: {
                                    target: {
                                        value: React.SetStateAction<string>
                                    }
                                }) => setNs(e.target.value)}
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
                                onChange={(e: {
                                    target: {
                                        value: React.SetStateAction<string>
                                    }
                                }) => setName(e.target.value)}
                            />
                        </span>
                        <span>
                            <Button
                                className='button text-button'
                                onClick={() => {
                                    setOldNs(ns)
                                    setOldName(name)
                                    setEditAttributes(true)
                                    console.log(`<${ns}:${name}>`)
                                }}
                                label='Save'
                            />
                            <Button
                                className='button text-button'
                                onClick={() => {
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
                        onClick={() => {
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
                <XMLAttributesOpenCloseContext.Provider
                    value={attributesOpenCloseContext}>
                    <AttributesTable
                        path={props.path}
                        attributes={attributes}
                    />
                </XMLAttributesOpenCloseContext.Provider>
            </span>
        </>
    )
}
