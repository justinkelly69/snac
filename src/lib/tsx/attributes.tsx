import React, { Fragment, useEffect, useState } from 'react'
import { Button, TextInput } from './widgets'

import {
    AttributesType,
    SNACOpts
} from '../snac/types'

import { Prefix } from './prefix'
import { flushSync } from 'react-dom'

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

    let index = 0

    return (
        <>
            {Object.keys(props.attributes).map((ns, i) => {
                return Object.keys(props.attributes[ns]).map((name, j) => {
                    index++
                    return (
                        <AttributeTableRow
                            key={`${i}:${j}`}
                            ns={ns}
                            name={name}
                            thisIndex={index}
                            index={props.index}
                            setIndex={props.setIndex}
                            value={props.attributes[ns][name][0]}
                            setValue={f => f}
                            setIsEditMode={props.setIsEditMode}
                            isEditMode={props.isEditMode}
                            isDeleteMode={props.isDeleteMode}
                            setIsDeleteMode={props.setIsDeleteMode}
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
    index: number
    thisIndex: number
    setIndex: Function
    value: string
    setValue: Function,
    setIsEditMode: Function,
    isEditMode: boolean
    isDeleteMode: boolean
    setIsDeleteMode: Function

}) => {
    const [thisIndex, setThisIndex] = useState(props.thisIndex)

    const setEditMode = () => {
        props.setIndex(thisIndex)
        props.setIsEditMode(thisIndex === props.index)
    }

    const setDeleteMode = () => {
        props.setIndex(thisIndex)
        props.setIsDeleteMode(thisIndex === props.index)
    }

    return (
        <>
            <span>
                <Button
                    className='button x-button'
                    onClick={f => f}
                    label='X'
                />
            </span>
            <span className='attribute-ns'
                onClick={setEditMode}
            >
                {props.ns !== '@' ? `${props.ns}:` : ''}
            </span>
            <span className='attribute-name'
                onClick={setEditMode}
            >
                {`${props.name} = ${props.index}`}
            </span >
            <span>
                {props.isEditMode && thisIndex === props.index ?
                    <>
                        <TextInput
                            name="ns"
                            className='text-input attribute-value-input'
                            value={`${props.isEditMode}:${thisIndex === props.index}:${thisIndex}:${props.index}:${props.value}`}
                            size={4}
                            placeholder='ns'
                            onChange={f => f}
                        />
                    </> :
                    <>
                        <span className='attribute-value'>
                            {props.value}
                        </span>
                    </>
                }

            </span>
            <span>
                <Button
                    className='button text-button'
                    onClick={e => props.setIndex(-1)}
                    label='Edit'
                />
            </span>
            <span>
                <Button
                    className='button text-button'
                    onClick={f => f}
                    label='Delete'
                />
            </span>
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
