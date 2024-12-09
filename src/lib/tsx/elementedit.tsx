import React, { useContext, useEffect, useState } from 'react'
import { Button, TextInput, XButton } from './widgets'
import {
    EditAttributesType, SNACElement,
    XMLModesType} from '../snac/types'
import { AttributesEdit } from './attributes'
import {
    XMLAttributesEditContext,
    XMLModesContext} from '../snac/contexts'
import { snac2EditAttributes } from '../snac/attsutils'

export const ElementEdit = (props: {
    node: SNACElement,
    path: number[],
    isSelected: boolean,
}): JSX.Element => {

    const xmlModesContext = useContext(XMLModesContext) as XMLModesType

    const [nsText, setNSText] = useState('')
    const [nameText, setNameText] = useState('')
    const [editAttributes, setEditAttributes] = useState<EditAttributesType>({})

    useEffect(() => {
        setNSText(props.node.S)
        setNameText(props.node.N)
        setEditAttributes(snac2EditAttributes(props.node.A))
    }, [props.node.S, props.node.N, props.node.A])

    const value = {
        editAttributes: editAttributes,
        setEditAttributes: setEditAttributes,
    }

    return (
        <XMLAttributesEditContext.Provider value={value}>
            <div className={`xml-display-controls-right xml-controls-area`}>
                <XButton xmlModesContext={xmlModesContext} />
                <TextInput
                    name="ns"
                    className='text-input ns-input'
                    size={4}
                    value={nsText}
                    placeholder='ns'
                    onChange={(e: { target: { value: React.SetStateAction<string> } }) => {
                        setNSText(e.target.value)
                    }}
                />
                <TextInput
                    name="name"
                    className='text-input name-input'
                    size={10}
                    value={nameText}
                    placeholder='name'
                    onChange={(e: { target: { value: React.SetStateAction<string> } }) => {
                        setNameText(e.target.value)
                    }} />
                <Button
                    className='button text-button'
                    onClick={(f: any) => f}
                    label='Save'
                />
                <Button
                    className='button text-button'
                    onClick={(f: any) => f}
                    label='Cancel'
                />
            </div>
            <div className={`xml-display-body-right xml-body-area`}>
                    <AttributesEdit
                        editAttributes={editAttributes}
                        setEditAttributes={setEditAttributes}
                        path={props.path}
                    />
            </div>
        </XMLAttributesEditContext.Provider>
    )
}
