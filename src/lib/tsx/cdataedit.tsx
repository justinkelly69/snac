import React, { useContext, useState } from 'react'
import { SNACCDATA, XMLModesType } from '../snac/types'
import { Button, TextArea } from './widgets'
import { escapeCDATA } from '../snac/textutils'
import { XMLModesContext } from '../snac/contexts'
import { CDATACloseBracket, CDATAOpenBracket } from './brackets'

export const CDATAEdit = (props: {
    node: SNACCDATA,
    path: number[],
    isSelected: boolean,
}): JSX.Element => {

    const xmlModesContext = useContext(XMLModesContext) as XMLModesType

    const [isEditable, setIsEditable] = useState(false)
    const [newCDATA, setNewCDATA] = useState(props.node.D)
    const [prevCDATA, setPrevCDATA] = useState(props.node.D)

    if (isEditable) {
        return (
            <>
                <div className={`xml-display-controls-right xml-controls-area`}>
                    <Button
                        className='button x-button'
                        onClick={() => {
                            xmlModesContext.setMode('VIEW_MODE')
                        }}
                        label='X'
                    />
                    <CDATAOpenBracket />
                    <Button
                        className='button text-button'
                        onClick={() => {
                            setIsEditable(false)
                            setNewCDATA(prevCDATA)
                            console.log(`[${props.path}]:<!-- ${prevCDATA} -->`)
                        }}
                        label='Save'
                    />
                    <Button
                        className='button text-button'
                        onClick={() => {
                            setIsEditable(false)
                            setPrevCDATA('')
                        }}
                        label='Cancel'
                    />
                    <CDATACloseBracket />
                </div>
                <div className={`xml-display-body-right xml-body-area`}>
                    <TextArea
                        readOnly={false}
                        className='text-editor cdata-editor'
                        value={prevCDATA}
                        onChange={(e: {
                            target: {
                                value: React.SetStateAction<string>
                            }
                        }) => setPrevCDATA(e.target.value)}
                    />
                </div>
            </>
        )
    }
    else {
        return (
            <>
                <div className={`xml-display-controls-right xml-controls-area`}>
                    <Button
                        className='button x-button'
                        onClick={() => {
                            xmlModesContext.setMode('VIEW_MODE')
                        }}
                        label='X'
                    />
                    <CDATAOpenBracket />
                    <CDATACloseBracket />
                </div>
                <div className={`xml-display-body-right xml-body-area`}>
                    <span
                        className='text-show cdata-disabled'
                        onClick={() => {
                            setIsEditable(true)
                            setPrevCDATA(newCDATA)
                        }}
                    >
                        {escapeCDATA(newCDATA)}
                    </span>
                </div>
            </>
        )
    }
}
