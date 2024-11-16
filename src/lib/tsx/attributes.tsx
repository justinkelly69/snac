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
    setCancelAttribute
} from '../snac/attributeutils'

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
                {props.value[0]}
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
    index: number,
    setIsNewMode: Function,
    setIsEditMode: Function,
    isDeleteMode: boolean,
    setIsDeleteMode: Function,
    setIndex: Function,
    setAttributes: Function,
}): JSX.Element => {

    const [state, dispatch] = useReducer(attributesEditReducer, snac2EditAttributes(props.attributes))
    const [selected, setSelected] = useState({
        ns: '#',
        name: '#',
    })
    const [mode, setMode] = useState('READY')

    //console.clear()
    console.log(JSON.stringify(state, null, 4))

    return (
        <>
            {Object.keys(state).map((ns, i) => {
                return Object.keys(state[ns]).map((name, j) => {
                    const isSelected = attributeIsSelected(ns, name, selected)
                    const isDeleted = attributeIsDeleted(state, ns, name)
                    return (
                        <AttributeTableRow
                            key={`${i}:${j}`}
                            ns={ns}
                            name={name}
                            value={state[ns][name]['V']}
                            mode={mode}
                            deleted={isDeleted}
                            deleteAttribute={e => {
                                setDeletedAttribute(
                                    dispatch,
                                    ns,
                                    name,
                                )
                            }}
                            selected={isSelected}
                            selectAttribute={e => {
                                setSelectedAttribute(
                                    setMode,
                                    setSelected,
                                    isSelected,
                                    dispatch,
                                    ns,
                                    name,
                                )
                            }}
                            saveAttribute={e => {
                                setSaveAttribute(
                                    setMode,
                                    setSelected,
                                    dispatch,
                                    ns,
                                    name,
                                )
                            }}
                            cancelAttribute={e => {
                                setCancelAttribute  (
                                    setMode,
                                    setSelected,
                                    dispatch,
                                    ns,
                                    name,
                                )
                            }}
                        />
                    )
                })
            })}

            {props.isNewMode &&
                <>
                    <span className='attributes-table-cell'></span>
                    <span className='attributes-table-cell'>
                        <Button
                            className='button text-button'
                            onClick={f => f}
                            label='New'
                        />
                    </span>
                    <span className='attributes-table-cell'></span>
                    <span className='attributes-table-cell'></span>
                    <span className='attributes-table-cell'></span>
                </>
            }
        </>
    )
}

const AttributeTableRow = (props: {
    ns: string
    name: string
    value: string
    mode: string
    deleted: boolean
    deleteAttribute: Function
    selected: boolean
    selectAttribute: Function
    saveAttribute: Function
    cancelAttribute: Function
}) => {

    const classDeleted = props.deleted ? 'attribute-deleted' : ''
    const deletedLabel = props.deleted ? 'Undelete' : 'Delete'

    const [value, setValue] = useState(props.value)

    return (
        <>
            <span>
                <Button
                    className='button x-button'
                    onClick={f => f}
                    label='X'
                />
            </span>
            <span className={`attribute-ns ${classDeleted}`}
                onClick={e => {
                    !props.deleted && props.selectAttribute()
                }}
            >
                {props.ns !== '@' ? `${props.ns}:` : ''}
            </span>
            <span className={`attribute-name ${classDeleted}`}
                onClick={e => {
                    !props.deleted && props.selectAttribute()
                }}
            >
                {props.name}
            </span >

            {props.selected ?
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
                                props.saveAttribute(value)
                            }}
                            label='Save'
                        />
                    </span>
                    <span>
                        <Button
                            className='button text-button'
                            onClick={e => {
                                props.cancelAttribute()
                            }}
                            label='Cancel'
                        />
                    </span>
                </> :
                <>
                    <span>
                        <span className={`attribute-value  ${classDeleted}`}
                            onClick={e => {
                                !props.deleted && props.selectAttribute()
                            }}>
                            {props.value}
                        </span>
                    </span>
                    <span>
                    </span>
                    <span>
                        {props.mode === 'READY' &&
                            <Button
                                className='button text-button'
                                onClick={e => props.deleteAttribute()}
                                label={deletedLabel}
                            />
                        }
                    </span>
                </>
            }



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
