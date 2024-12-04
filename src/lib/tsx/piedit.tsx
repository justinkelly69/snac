import React, { useContext, useEffect, useState } from 'react'
import { SNACPINode, XMLModesType } from "../snac/types"
import { Button, DropDownList, TextArea, XButton } from './widgets'
import { escapePIBody } from '../snac/textutils'
import { snacOpts } from '../snac/opts'
import { XMLModesContext } from '../snac/contexts'
import { PICloseBracket, PIOpenBracket } from './brackets'

export const PIEdit = (props: {
    node: SNACPINode,
    path: number[],
    isSelected: boolean,
}): JSX.Element | null => {

    const xmlModesContext = useContext(XMLModesContext) as XMLModesType

    const [isEditable, setIsEditable] = useState(false)
    const [newPILang, setNewPILang] = useState(props.node.L)
    const [newPIBody, setNewPIBody] = useState(props.node.B)
    const [prevPILang, setPrevPILang] = useState(props.node.L)
    const [prevPIBody, setPrevPIBody] = useState(props.node.B)

    useEffect(() => {
        setNewPILang(props.node.L)
        setNewPIBody(props.node.B)
    }, [props.node.L, props.node.B])

    if (isEditable) {
        return (
            <>
                <div className={`xml-display-controls-right xml-controls-area`}>
                    <XButton xmlModesContext={xmlModesContext} />
                    <PIOpenBracket />
                    <DropDownList
                        className='pi-drop-down'
                        value={newPILang}
                        onChange={(e: { target: { value: React.SetStateAction<string> } }) => {
                            setNewPILang(e.target.value)
                        }}
                        opts={snacOpts.pi_languages}
                    />
                    <Button
                        className='button text-button'
                        onClick={() => {
                            setIsEditable(false)
                            setPrevPILang(newPILang)
                            setPrevPIBody(newPIBody)
                            console.log(`[${props.path}]:<?${newPILang} ${prevPIBody} ?>`)
                        }}
                        label='Save'
                    />
                    <Button
                        className='button text-button'
                        onClick={() => {
                            setIsEditable(false)
                            setNewPILang(prevPILang)
                            setNewPIBody(prevPIBody)
                        }}
                        label='Cancel'
                    />
                    <PICloseBracket />
                </div>
                <div className={`xml-display-body-right xml-body-area`}>
                    <TextArea
                        readOnly={false}
                        className='text-editor pi-editor'
                        value={newPIBody}
                        onChange={(e: { target: { value: React.SetStateAction<string> } }) => {
                            setNewPIBody(e.target.value)
                        }}
                    />
                </div>
            </>
        )
    }
    else {
        return (
            <>
                <div className={`xml-display-controls-right xml-controls-area`}>
                    <XButton xmlModesContext={xmlModesContext} />
                    <PIOpenBracket />
                    <span className='pi-lang'>
                        {newPILang}
                    </span>
                    <PICloseBracket />
                </div>
                <div className={`xml-display-body-right xml-body-area`}>
                    <span
                        className='text-show pi-disabled'
                        onClick={() => {
                            setIsEditable(true)
                            setPrevPIBody(newPIBody)
                        }}
                    >
                        {escapePIBody(newPIBody)}
                    </span>
                </div>
            </>
        )
    }
}
