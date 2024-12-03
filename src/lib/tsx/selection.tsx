import React, { useContext } from "react"
import { SNACItem, XMLModesType } from '../snac/types'
import { XMLModesContext, XMLRWContext } from "../snac/contexts"
import { Kids } from './kids'
import { Button, TextInput, XButton } from "./widgets"

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
                {xmlModesContext.paths.length > 0 ?
                    <>
                        <XButton xmlModesContext={xmlModesContext} />
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
                                xmlModesContext.setPaths([])
                            }}
                            label='Wrap'
                        />
                        <Button
                            className='button text-button'
                            onClick={() => {
                                xmlModesContext.setMode('VIEW_MODE')
                                xmlModesContext.setPaths([])
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
                    </> :
                    null
                }
            </div>
            <div className={`xml-display-body-${props.side} xml-body-area`}>
                <Kids
                    snac={props.snac}
                    path={[]}
                    isSelected={props.isSelected}
                />
            </div>
        </XMLRWContext.Provider>
    )
}
