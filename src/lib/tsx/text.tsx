import React, { useContext, useState } from 'react'
import { SNACText, SwitchStates, XMLModesType, XMLRWType } from '../snac/types'
import { Prefix } from './prefix'
import { snacOpts } from '../snac/opts'
import { escapeHtml, isLonger, trimBody } from '../snac/textutils'
import { ShowHideSwitch } from './showhide'
import { insertPath, XMLModesContext, XMLRWContext } from '../snac/contexts'
import { XmlShow } from './xmlshow'
import { hasPath } from '../snac/paths'
import { TextCloseBracket, TextOpenBracket } from './brackets'

export const Text = (props: {
    node: SNACText,
    path: number[],
    isSelected: boolean,
}): JSX.Element => {

    const xmlModesContext = useContext(XMLModesContext) as XMLModesType
    const xmlRWContext = useContext(XMLRWContext) as XMLRWType

    const [isChildrenOpen, setChildrenOpen] = useState(false)

    let selectState = SwitchStates.HIDDEN
    let selectedClassName = 'text'
    let childrenState = SwitchStates.HIDDEN

    const isSelected = hasPath(xmlModesContext.paths, props.path) || props.isSelected

    if (xmlRWContext.treeMode) {
        selectState = isSelected ?
            SwitchStates.ON :
            SwitchStates.OFF

        childrenState = isChildrenOpen ?
            SwitchStates.ON :
            SwitchStates.OFF

        selectedClassName = isSelected && xmlModesContext.paths.length > 0 ?
            'text selected' :
            'text'
    }

    const [body, showHide] = trimBody(
        isChildrenOpen,
        props.node.T,
        snacOpts.xml_trimTextLength,
        snacOpts.xml_ellipsis
    )

    if (xmlRWContext.treeMode) {
        return (
            <div className={selectedClassName}>
                <span className='prefix-area'>
                    <ShowHideSwitch
                        path={props.path}
                        selected={selectState}
                        chars={snacOpts.switch_selectChars}
                        openClose={() => insertPath(
                            xmlModesContext,
                            props.path,
                        )}
                    />
                    <Prefix path={props.path} />
                    {showHide ?
                        <ShowHideSwitch
                            path={props.path}
                            selected={childrenState}
                            chars={snacOpts.switch_elementChars}
                            openClose={() => {
                                if (isChildrenOpen) {
                                    setChildrenOpen(false)
                                }
                                else {
                                    setChildrenOpen(true)
                                }
                            }}
                        /> :
                        null
                    }

                </span>
                <span
                    className='text-show text-body'
                    onClick={() => {
                        xmlModesContext.setPath(props.path)
                        xmlModesContext.setNode(props.node)
                        xmlModesContext.setMode('TEXT_EDIT_MODE')
                    }}>
                    <TextOpenBracket />
                    {escapeHtml(body)}
                    <TextCloseBracket />
                </span>
            </div>
        )
    }
    else {
        return (
            <>
                {isSelected ?
                    <XmlShow
                        path={props.path}
                        className={selectedClassName}
                    >
                        {escapeHtml(body)}
                    </XmlShow> :
                    null
                }
            </>
        )
    }
}
