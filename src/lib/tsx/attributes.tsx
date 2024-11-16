import React, { Fragment, useEffect, useReducer, useState } from 'react'
import { Button, TextInput } from './widgets'

import {
    AttributesType,
    EditAttributesActionType,
    EditAttributesType,
    SNACOpts
} from '../snac/types'

import { Prefix } from './prefix'

import {
    attributesEditReducer,
    selectAttribute,
    saveAttribute,
    cancelAttribute,
    deleteAttribute,
    newAttribute,
    snac2EditAttributes,
    attributeIsSelected,
    setSelectedAttribute,
    attributeIsDeleted,
    setDeletedAttribute,
    setSaveAttribute,
    setCancelAttribute,
    attributeGetValue,
    setNewAttribute,
    attributeGetNumRows
} from '../snac/attributeutils'
import { networkInterfaces } from 'os'

export const Attributes = (props: {
    path: number[],
    attributes: AttributesType,
    opts: SNACOpts
}): JSX.Element | null => {
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
                                {i > 0 || j > 0 ? <br /> : null}
                                <Attribute
                                    path={props.path}
                                    name={tagName}
                                    value={props.attributes[ns][name]}
                                    opts={props.opts}
                                />
                            </span>
                        )
                    })

                })}
            </div>
            {Object.keys(props.attributes).length > 0 ?
                <>
                    {props.opts.prefix_spaceBefore}
                    <Prefix
                        path={props.path}
                        opts={props.opts}
                    />
                    {props.opts.prefix_spaceAfter}
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
    opts: SNACOpts,
}): JSX.Element => {

    return (
        <span className='attribute'>

            <Prefix
                path={props.path}
                opts={props.opts}
            />

            {props.opts.prefix_attributePrefix}

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

export const AttributesTable = (props: {
    path: number[],
    attributes: AttributesType,
    isNewMode: boolean,
    isEditMode: boolean,
    isDeleteMode: boolean,
    setAttributes: Function,
    numRows: number
    setNumRows: Function
}): JSX.Element => {

    const [state, dispatch] = useReducer(
        attributesEditReducer,
        snac2EditAttributes(props.attributes))

    const [selected, setSelected] = useState({
        ns: '#',
        name: '#',
    })
    const [mode, setMode] = useState('LIST_MODE')

    //console.clear()
    console.log(JSON.stringify(state, null, 4))

    return (
        <>
            {Object.keys(state).map((ns, i) => {
                return Object.keys(state[ns]).map((name, j) => {
                    return (
                        <AttributeTableRow
                            key={`${i}:${j}`}
                            ns={ns}
                            name={name}
                            value={attributeGetValue(state, ns, name)}
                            mode={mode}
                            setMode={setMode}
                            dispatch={dispatch}
                            isDeleted={attributeIsDeleted(state, ns, name)}
                            isSelected={attributeIsSelected(selected, ns, name)}
                            setSelected={setSelected}
                            setAttributes={props.setAttributes}
                            numRows={props.numRows}
                            setNumRows={props.setNumRows}
                        />
                    )
                })
            })}

            <AttributeNewRow
                state={state}
                mode={mode}
                setMode={setMode}
                dispatch={dispatch}
                setAttributes={props.setAttributes}
                numRows={props.numRows}
                setNumRows={props.setNumRows}
            />
        </>
    )
}



const AttributeTableRow = (props: {
    ns: string
    name: string
    value: string
    mode: string
    setMode: Function
    dispatch: Function
    isDeleted: boolean
    isSelected: boolean
    setSelected: Function
    setAttributes: Function
    numRows: number
    setNumRows: Function
}) => {

    const classDeleted = props.isDeleted ? 'attribute-deleted' : ''
    const deletedLabel = props.isDeleted ? 'O' : 'X'

    const [value, setValue] = useState(props.value)
    const [oldValue, setOldValue] = useState(props.value)

    return (
        <>
            <span>
                {props.mode === 'LIST_MODE' &&
                    <Button
                        className='button'
                        onClick={e => {
                            setDeletedAttribute(
                                props.dispatch,
                                props.ns,
                                props.name,
                            )
                        }}
                        label={deletedLabel}
                    />
                }
            </span>
            <span className={`attribute-ns ${classDeleted}`}
                onClick={e => {
                    setSelectedAttribute(
                        props.setMode,
                        props.setSelected,
                        props.isSelected,
                        props.isDeleted,
                        props.dispatch,
                        props.ns,
                        props.name,
                    )
                }}
            >
                {props.ns !== '@' ? `${props.ns}:` : ''}
            </span>
            <span className={`attribute-name ${classDeleted}`}
                onClick={e => {
                    setSelectedAttribute(
                        props.setMode,
                        props.setSelected,
                        props.isSelected,
                        props.isDeleted,
                        props.dispatch,
                        props.ns,
                        props.name,
                    )
                }}
            >
                {props.name}
            </span>

            {props.mode === 'EDIT_MODE' && props.isSelected ?
                <>
                    <span>
                        <TextInput
                            name="ns"
                            className='text-input attribute-value-input'
                            value={value}
                            size={4}
                            placeholder='ns'
                            onChange={e => setValue(e.target.value)}
                        />
                    </span>
                    <span>
                        <Button
                            className='button text-button'
                            onClick={e => {
                                setOldValue(value)
                                setSaveAttribute(
                                    props.setMode,
                                    props.setSelected,
                                    props.dispatch,
                                    props.ns,
                                    props.name,
                                    value
                                )
                            }}
                            label='Save'
                        />
                    </span>
                    <span>
                        <Button
                            className='button text-button'
                            onClick={e => {
                                setValue(oldValue)
                                setCancelAttribute(
                                    props.setMode,
                                    props.setSelected,
                                    props.dispatch,
                                    props.ns,
                                    props.name,
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
                            onClick={e => {
                                setSelectedAttribute(
                                    props.setMode,
                                    props.setSelected,
                                    props.isSelected,
                                    props.isDeleted,
                                    props.dispatch,
                                    props.ns,
                                    props.name,
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
    mode: string
    setMode: Function
    dispatch: Function
    setAttributes: Function
    numRows: number
    setNumRows: Function
}) => {

    const [ns, setNs] = useState('')
    const [name, setName] = useState('')
    const [value, setValue] = useState('')

    return (props.mode === 'INSERT_MODE' ?
        <>
            <span className='attributes-table-cell'></span>
            <span className='attributes-table-cell'></span>
            <span className='attributes-table-cell'>
                <TextInput
                    name="ns"
                    className=' text-input attribute-ns-input'
                    value={ns}
                    size={4}
                    placeholder='ns'
                    onChange={e => setNs(e.target.value)}
                />
            </span>
            <span className='attributes-table-cell'>
                <TextInput
                    name="name"
                    className='text-input attribute-name-input'
                    value={name}
                    size={4}
                    placeholder='name'
                    onChange={e => setName(e.target.value)}
                />
            </span>
            <span className='attributes-table-cell'>
                <TextInput
                    name="value"
                    className='text-input attribute-value-input'
                    value={value}
                    size={4}
                    placeholder='value'
                    onChange={e => setValue(e.target.value)}
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
                            props.setNumRows(props.numRows + 1)
                        }
                        setNs('')
                        setName('')
                        setValue('')
                        props.setMode('LIST_MODE')
                    }}
                    label='Save'
                />
            </span>
            <span className='attributes-table-cell'>
                <Button
                    className='button text-button'
                    onClick={e => {
                        setNs('')
                        setName('')
                        setValue('')
                        props.setMode('LIST_MODE')
                    }}
                    label='Cancel'
                />
            </span>
        </> :
        <>
            <span className='attributes-table-cell'></span>
            <span className='attributes-table-cell'>
                <Button
                    className='button'
                    onClick={e => props.setMode('INSERT_MODE')}
                    label='+'
                />
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

        <span onClick={e => props.openClose && props.openClose()}>
            <span className='attribute-ns'>
                {tagANSName[0]}
            </span>
            :
            <span className='attribute-name'>
                {tagANSName[1]}
            </span>
        </span> :

        <span onClick={e => props.openClose && props.openClose()}
            className='attribute-name'>
            {tagANSName[0]}
        </span>
}
