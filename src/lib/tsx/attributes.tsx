import React, { Fragment, useState } from 'react'
import { Button, TextInput } from './widgets'

import {
    AttributesType,
    SNACOpts
} from '../snac/types'

import { Prefix } from './prefix'

export const Attributes = (props: {
    path: number[],
    attributes: AttributesType,
    opts: SNACOpts
}): JSX.Element | null => {
    return Object.keys(props.attributes).length > 0 ?
        <>
            <div>
                {Object.keys(props.attributes).map((a, i) => {
                    return (
                        <span key={i}>
                            {i > 0 ?
                                <br /> :
                                null
                            }
                            <Attribute
                                path={props.path}
                                name={a}
                                value={props.attributes[a]}
                                opts={props.opts}
                            />
                        </span>
                    )
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
}): JSX.Element =>
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

export const AttributesTable = (props: {
    path: number[],
    attributes: AttributesType,
    isNewMode: boolean,
    isEditMode: boolean,
    index: number,
    setIsNewMode: Function,
    setIsEditMode: Function,
    setIndex: Function,
}): JSX.Element => {

    const keys = Object.keys(props.attributes)

    return (
        <>
            {keys.map((attName, i) => {

                let tagANSName = attName.split(/:/)
                if (tagANSName.length === 1) {
                    tagANSName = ['', tagANSName[0]]
                }

                return (
                    <Fragment key={i}>
                        <span>
                            <Button
                                className='x-button'
                                onClick={f => f}
                                label='X'
                            />
                        </span>
                        <span>
                            <span className='attribute-ns'>
                                {tagANSName[0]}
                            </span>
                        </span>
                        <span>
                            <span className='attribute-name'>
                                {tagANSName[1]}
                            </span>
                        </span>
                        <span>
                            <span className='attribute-value'>
                                {props.attributes[attName]}
                            </span>
                        </span>
                        <span>
                            <Button
                                className='text-button'
                                onClick={f => f}
                                label='Edit'
                            />
                        </span>
                        <span>
                            <Button
                                className='text-button'
                                onClick={f => f}
                                label='Delete'
                            />
                        </span>
                    </Fragment>
                )
            })}
            {props.isNewMode &&
                <>
                    <span className='attributes-table-cell'></span>
                    <span className='attributes-table-cell'>
                        <Button
                            className='text-button'
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

const AttributesTableRow = () => {

}

const AttributesTableCell = () => {
    return (
        <span className='attributes-table-cell'></span>
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
