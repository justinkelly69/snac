import React, { useContext, useEffect, useState } from 'react'
import { Button, TextInput, XButton } from './widgets'
import {
    AttributesType, SNACElement,
    XMLModesType, XMLRWType
} from '../snac/types'
import { AttributesTable } from './attributes'
import { attributeKeys } from '../snac/textutils'
import { attributesGridStyle } from '../snac/styles'
import {
    XMLRWContext, XMLAttributesOpenCloseContext,
    XMLModesContext
} from '../snac/contexts'

export const ElementEdit = (props: {
    node: SNACElement,
    path: number[],
    isSelected: boolean,
}): JSX.Element => {

    const xmlRWContext = useContext(XMLRWContext) as XMLRWType
    const xmlModesContext = useContext(XMLModesContext) as XMLModesType

    const [nsText, setNSText] = useState('')
    const [nameText, setNameText] = useState('')
    const [attributes, setAttributes] = useState<AttributesType>({})

    useEffect(() => {
        setNSText(props.node.S)
        setNameText(props.node.N)
        setAttributes(props.node.A)
    }, [props.node.S, props.node.N, props.node.A])

    //console.log('ElementEdit props.node', JSON.stringify(props.node, null, 4))

    return (
        <>
            <div className={`xml-display-controls-right xml-controls-area`}>
                <XButton xmlModesContext={xmlModesContext} />
                <TextInput
                    name="ns"
                    className='text-input ns-input'
                    size={4}
                    value={nsText}
                    placeholder='ns'
                    onChange={(e) => {
                        setNSText(e.target.value)
                    }}
                />
                <TextInput
                    name="name"
                    className='text-input name-input'
                    size={10}
                    value={nameText}
                    placeholder='name'
                    onChange={(e) => {
                        setNameText(e.target.value)
                    }} />
                <Button
                    className='button text-button'
                    onClick={f => f}
                    label='Save'
                />
                <Button
                    className='button text-button'
                    onClick={f => f}
                    label='Cancel'
                />
            </div>
            <div className={`xml-display-body-right xml-body-area`}>
                <AttributesEdit
                    attributes={attributes}
                    path={props.path}
                    openClose={f => f}
                />
            </div>
        </>
    )
}

const AttributesEdit = (props: {
    attributes: AttributesType,
    path: number[],
    openClose?: Function
}): JSX.Element => {

    const [attributes, setAttributes] = useState(props.attributes)
    const [editAttributes, setEditAttributes] = useState(true)
    const [numRows, setNumRows] = useState(1)

    const keys = attributeKeys(attributes)

    useEffect(() => {
        setAttributes(props.attributes)
        setNumRows(keys.length + 1)
    }, [props.attributes, keys])

    console.log('AttributesEdit attributes, keys', JSON.stringify(attributes, null, 4), JSON.stringify(keys, null, 4))


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
                {editAttributes &&
                    <>
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
                    </>
                }

                <AttributesTable
                    path={props.path}
                    attributes={attributes}
                />
            </span>
        </>
    )
}