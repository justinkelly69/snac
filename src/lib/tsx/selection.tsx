import React, { useContext } from "react"
import { SNACItem, XMLModesType } from '../snac/types'
import { XMLModesContext, XMLRWContext } from "../snac/contexts"
import { Children } from './children'
import { Button, TextInput } from "./widgets"

export const Selection = (props: {
    snac: SNACItem[],
    treeMode: boolean,
    isSelected: boolean,
    side: string,
}): JSX.Element => {

    const xmlModesContext = useContext(XMLModesContext) as XMLModesType

    const xmlRWValue = {
        treeMode: props.treeMode
    }

    return (
        <XMLRWContext.Provider value={xmlRWValue}>
            <div className={`xml-display-controls-${props.side} xml-controls-area`}>
                <Button
                    className='button x-button'
                    onClick={() => {
                        xmlModesContext.setMode('VIEW_MODE')
                    }}
                    label='X'
                />
                <TextInput
                    name="ns"
                    className='text-input ns-input'
                    size={4}
                    placeholder='ns'
                    onChange={(f: any) => f}
                />
                <TextInput
                    name="name"
                    className='text-input name-input'
                    size={10}
                    placeholder='name'
                    onChange={(f: any) => f}
                />
                <Button
                    className='button text-button'
                    onClick={() => {
                        xmlModesContext.setMode('VIEW_MODE')
                        xmlModesContext.setPath([])
                    }}
                    label='Wrap'
                />
                <Button
                    className='button text-button'
                    onClick={() => {
                        xmlModesContext.setMode('VIEW_MODE')
                        xmlModesContext.setPath([])
                    }}
                    label='Cut'
                />
                <Button
                    className='button text-button'
                    onClick={() => {
                        xmlModesContext.setMode('VIEW_MODE')
                        xmlModesContext.setPath([])
                    }}
                    label='Copy'
                />
                <Button
                    className='button text-button'
                    onClick={() => {
                        xmlModesContext.setMode('VIEW_MODE')
                        xmlModesContext.setPath([])
                    }}
                    label='Delete'
                />
            </div>
            <div className={`xml-display-body-${props.side} xml-body-area`}>
                <Children
                    snac={props.snac}
                    path={[]}
                    isSelected={props.isSelected}
                />
            </div>
        </XMLRWContext.Provider>
    )
}
