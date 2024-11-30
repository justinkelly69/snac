import React, { useContext, useReducer, useState } from 'react'
import { Button, TextInput } from './widgets'
import { AttributesType, EditAttributesType, XMLAttributesOpenCloseType, XMLAttributesTableType, XMLModesType } from '../snac/types'
import { snacOpts } from '../snac/opts'
import { Prefix } from './prefix'
import {
    attributesEditReducer,
    snac2EditAttributes,
    attributeIsSelected,
    setSelectedAttribute,
    attributeIsDeleted,
    setDeletedAttribute,
    setSaveAttribute,
    setCancelAttribute,
    attributeGetValue,
    setNewAttribute,
} from '../snac/attsutils'
import { XMLRWContext } from './xmlout'
import { EditBoxGridStyle } from '../snac/styles'
import { XMLAttributesOpenCloseContext } from './element'
import { XMLModesContext } from './xmldisplay'

const XMLAttributesTableContext = React.createContext<XMLAttributesTableType>({
    ns: '',
    name: '',
    value: '',
    dispatch: (f: any) => f,
    isDeleted: false,
    isSelected: false,
    setSelected: (f: any) => f,
})

export const Attributes = (props: {
    path: number[],
    attributes: AttributesType,
}): JSX.Element | null => {

    const xmlContext = useContext(XMLRWContext);

    return Object.keys(props.attributes).length > 0 ?
        <>
            <div>
                {Object.keys(props.attributes).map((ns, i) => {

                    return Object.keys(props.attributes[ns]).map((name, j) => {
                        let tagName = name
                        if (ns !== '@') {
                            tagName = `${ns}:${name}`
                        }
                        return (
                            <span key={`${i}:${j}`}>
                                {xmlContext.treeMode ?
                                    <>
                                        {i > 0 || j > 0 ? <br /> : null}
                                        <Attribute
                                            path={props.path}
                                            name={tagName}
                                            value={props.attributes[ns][name]}
                                        />
                                    </> :
                                    <>
                                        <Attribute
                                            path={[]}
                                            name={tagName}
                                            value={props.attributes[ns][name]}
                                        />
                                    </>
                                }
                            </span>
                        )
                    })

                })}
            </div>
            {xmlContext.treeMode && Object.keys(props.attributes).length > 0 ?
                <>
                    {snacOpts.prefix_spaceBefore}
                    <Prefix
                        path={props.path}
                    />
                    {snacOpts.prefix_spaceAfter}
                </>
                : null
            }
        </> :
        null
}

const Attribute = (props: {
    path: number[],
    name: string,
    value: string,
}): JSX.Element => {

    const xmlContext = useContext(XMLRWContext);

    if (xmlContext.treeMode) {
        return (
            <span className='attribute'>
                <Prefix
                    path={props.path}
                />
                {snacOpts.prefix_attributePrefix}
                <ANSName
                    name={props.name}
                    openClose={f => f}
                />
                =&quot;
                <span className='attribute-value'>
                    {props.value}
                </span>
                &quot;
            </span>
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
                    {snacOpts.prefix_attributePrefix}
                    <ANSName
                        name={props.name}
                        openClose={f => f}
                    />
                    =&quot;
                    <span className='attribute-value'>
                        {props.value}
                    </span>
                    &quot;
                </span>
            </div>
        )
    }
}

export const AttributesTable = (props: {
    path: number[],
    attributes: AttributesType,
}): JSX.Element => {

    const attributesOpenCloseContext = useContext(XMLAttributesOpenCloseContext) as XMLAttributesOpenCloseType

    const [state, dispatch] = useReducer(
        attributesEditReducer,
        snac2EditAttributes(props.attributes))

    const [selected, setSelected] = useState({
        ns: '#',
        name: '#',
    })

    return (
        <>
            {Object.keys(state).map((ns, i) => {
                return Object.keys(state[ns]).map((name, j) => {

                    const value = {
                        ns: ns,
                        name: name,
                        value: attributeGetValue(state, ns, name),
                        dispatch: dispatch,
                        isDeleted: attributeIsDeleted(state, ns, name),
                        isSelected: attributeIsSelected(selected, ns, name),
                        setSelected: setSelected,
                    }

                    return (
                        <XMLAttributesTableContext.Provider value={value}>
                            <AttributeTableRow key={`${i}:${j}`} />
                        </XMLAttributesTableContext.Provider>
                    )
                })
            })}

            {attributesOpenCloseContext.editAttributes ?
                <AttributeNewRow
                    state={state}
                    dispatch={dispatch}
                /> :
                <span></span>
            }
        </>
    )
}



const AttributeTableRow = () => {

    const xmlModesContext = useContext(XMLModesContext) as XMLModesType
    const attributesOpenCloseContext = useContext(XMLAttributesOpenCloseContext) as XMLAttributesOpenCloseType
    const attributesTableContext = useContext(XMLAttributesTableContext) as XMLAttributesTableType

    const classDeleted = attributesTableContext.isDeleted ? 'attribute-deleted' : ''
    const deletedLabel = attributesTableContext.isDeleted ? 'O' : 'X'

    const [value, setValue] = useState(attributesTableContext.value)
    const [oldValue, setOldValue] = useState(attributesTableContext.value)

    return (
        <>
            <span>
                {attributesOpenCloseContext.editAttributes && xmlModesContext.mode === 'VIEW_MODE' &&
                    <Button
                        className='button x-button'
                        onClick={() => {
                            setDeletedAttribute(
                                attributesTableContext.dispatch,
                                attributesTableContext.ns,
                                attributesTableContext.name,
                            )
                        }}
                        label={deletedLabel}
                    />
                }
            </span>
            <span className={`attribute-ns ${classDeleted}`}
                onClick={() => {
                    attributesOpenCloseContext.editAttributes && setSelectedAttribute(
                        xmlModesContext.setMode,
                        attributesTableContext.setSelected,
                        attributesTableContext.isSelected,
                        attributesTableContext.isDeleted,
                        attributesTableContext.dispatch,
                        attributesTableContext.ns,
                        attributesTableContext.name,
                    )
                }}
            >
                {attributesTableContext.ns !== '@' ? `${attributesTableContext.ns}:` : ''}
            </span>
            <span className={`attribute-name ${classDeleted}`}
                onClick={() => {
                    attributesOpenCloseContext.editAttributes && setSelectedAttribute(
                        xmlModesContext.setMode,
                        attributesTableContext.setSelected,
                        attributesTableContext.isSelected,
                        attributesTableContext.isDeleted,
                        attributesTableContext.dispatch,
                        attributesTableContext.ns,
                        attributesTableContext.name,
                    )
                }}
            >
                {attributesTableContext.name}
            </span>

            {xmlModesContext.mode === 'EDIT_MODE' && attributesTableContext.isSelected ?
                <>
                    <span>
                        <TextInput
                            name="ns"
                            className='text-input attribute-value-input'
                            value={value}
                            size={4}
                            placeholder='ns'
                            onChange={(e: {
                                target: {
                                    value: React.SetStateAction<string>
                                }
                            }) => setValue(e.target.value)}
                        />
                    </span>
                    <span>
                        <Button
                            className='button text-button'
                            onClick={() => {
                                setOldValue(value)
                                setSaveAttribute(
                                    xmlModesContext.setMode,
                                    attributesTableContext.setSelected,
                                    attributesTableContext.dispatch,
                                    attributesTableContext.ns,
                                    attributesTableContext.name,
                                    value
                                )
                            }}
                            label='Save'
                        />
                    </span>
                    <span>
                        <Button
                            className='button text-button'
                            onClick={() => {
                                setValue(oldValue)
                                setCancelAttribute(
                                    xmlModesContext.setMode,
                                    attributesTableContext.setSelected,
                                    attributesTableContext.dispatch,
                                    attributesTableContext.ns,
                                    attributesTableContext.name,
                                    oldValue,
                                )
                            }}
                            label='Cancel'
                        />
                    </span>
                </> :
                <>
                    <span>
                        <span className={`attribute-value  ${classDeleted}`}
                            onClick={() => {
                                attributesOpenCloseContext.editAttributes && setSelectedAttribute(
                                    xmlModesContext.setMode,
                                    attributesTableContext.setSelected,
                                    attributesTableContext.isSelected,
                                    attributesTableContext.isDeleted,
                                    attributesTableContext.dispatch,
                                    attributesTableContext.ns,
                                    attributesTableContext.name,
                                )
                            }}>
                            {value}
                        </span>
                    </span>
                    <span></span>
                    <span></span>
                </>
            }
        </>
    )
}

const AttributeNewRow = (props: {
    state: EditAttributesType
    dispatch: Function
}) => {

    const xmlModesContext = useContext(XMLModesContext) as XMLModesType
    const attributesOpenCloseContext = useContext(XMLAttributesOpenCloseContext)

    const [ns, setNs] = useState('')
    const [name, setName] = useState('')
    const [value, setValue] = useState('')

    return (xmlModesContext.mode === 'INSERT_MODE' ?
        <>
            <span className='attributes-table-cell'></span>
            <span className='attributes-table-cell'></span>
            <span className='attributes-table-cell'>
                <TextInput
                    name="ns"
                    className='text-input attribute-ns-input'
                    value={ns}
                    size={4}
                    placeholder='ns'
                    onChange={(e: {
                        target: {
                            value: React.SetStateAction<string>
                        }
                    }) => setNs(e.target.value)}
                />
            </span>
            <span className='attributes-table-cell'>
                <TextInput
                    name="name"
                    className='text-input attribute-name-input'
                    value={name}
                    size={4}
                    placeholder='name'
                    onChange={(e: {
                        target: {
                            value: React.SetStateAction<string>
                        }
                    }) => setName(e.target.value)}
                />
            </span>
            <span className='attributes-table-cell'>
                <TextInput
                    name="value"
                    className='text-input attribute-value-input'
                    value={value}
                    size={4}
                    placeholder='value'
                    onChange={(e: {
                        target: {
                            value: React.SetStateAction<string>
                        }
                    }) => setValue(e.target.value)}
                />
            </span>

            <span className='attributes-table-cell'>
                <Button
                    className='button text-button'
                    onClick={e => {
                        const newNs = ns.length === 0 ? '@' : ns

                        if (name.length > 0 &&
                            value.length > 0 &&
                            !(newNs in props.state
                                && name in props.state[newNs]
                            )) {
                            setNewAttribute(
                                props.dispatch,
                                newNs,
                                name,
                                value
                            )
                            attributesOpenCloseContext.setNumRows(
                                attributesOpenCloseContext.numRows + 1
                            )
                        }
                        setNs('')
                        setName('')
                        setValue('')
                        xmlModesContext.setMode('LIST_MODE')
                    }}
                    label='Save'
                />
            </span>
            <span className='attributes-table-cell'>
                <Button
                    className='button text-button'
                    onClick={() => {
                        setNs('')
                        setName('')
                        setValue('')
                        xmlModesContext.setMode('LIST_MODE')
                    }}
                    label='Cancel'
                />
            </span>
        </> :
        <>
            <span className='attributes-table-cell'></span>
            <span className='attributes-table-cell'>
                {xmlModesContext.mode === 'LIST_MODE' &&
                    <Button
                        className='button x-button'
                        onClick={() => {
                            setNs('')
                            setName('')
                            setValue('')
                            xmlModesContext.setMode('INSERT_MODE')
                        }}
                        label='+'
                    />
                }
            </span>
            <span className='attributes-table-cell'></span>
            <span className='attributes-table-cell'></span>
            <span className='attributes-table-cell'></span>
            <span className='attributes-table-cell'></span>
        </>
    )
}

const ANSName = (props: {
    name: string,
    openClose: Function
}): JSX.Element => {
    const tagANSName = props.name.split(/:/)
    return tagANSName.length > 1 ?

        <span onClick={() => props.openClose && props.openClose()}>
            <span className='attribute-ns'>
                {tagANSName[0]}
            </span>
            :
            <span className='attribute-name'>
                {tagANSName[1]}
            </span>
        </span> :

        <span onClick={() => props.openClose && props.openClose()}
            className='attribute-name'>
            {tagANSName[0]}
        </span>
}
