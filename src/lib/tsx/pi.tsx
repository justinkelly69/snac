import React, { useContext, useState } from 'react'
import { SNACPINode, SwitchStates, XMLModesType, XMLRWType } from "../snac/types"
import { Prefix } from './prefix'
import { escapePIBody, trimBody } from '../snac/textutils'
import { snacOpts } from '../snac/opts'
import { ShowHideSwitch } from './showhide'
import { insertPath, XMLModesContext, XMLRWContext } from '../snac/contexts'
import { clearPaths, hasPath } from '../snac/paths'
import { PICloseBracket, PIOpenBracket } from './brackets'
import { XmlShow } from './xmlshow'

export const PI = (props: {
    node: SNACPINode,
    path: number[],
    isSelected: boolean,
}): JSX.Element | null => {

    const xmlRWContext = useContext(XMLRWContext) as XMLRWType
    const xmlModesContext = useContext(XMLModesContext) as XMLModesType

    const [isChildrenOpen, setChildrenOpen] = useState(false)
    const isSelected = hasPath(xmlModesContext.paths, props.path) || props.isSelected

    let selectState = SwitchStates.HIDDEN
    let selectedClassName = 'pi'

    if (xmlRWContext.treeMode && (xmlModesContext.mode === 'VIEW_MODE' || xmlModesContext.mode === 'SELECT_MODE')) {
        selectState = isSelected ?
            SwitchStates.ON :
            SwitchStates.OFF

        selectedClassName = isSelected && xmlModesContext.paths.length > 0 ?
            'text selected' :
            'text'
    }

    let childrenState = SwitchStates.HIDDEN
    if (xmlRWContext.treeMode && (xmlModesContext.mode !== 'SELECT_MODE')) {
        childrenState = isChildrenOpen ?
            SwitchStates.ON :
            SwitchStates.OFF
    }

    const [body, showHide] = trimBody(
        isChildrenOpen,
        props.node.B,
        snacOpts.xml_trimPIBodyLength,
        snacOpts.xml_ellipsis
    )
    
    if (xmlRWContext.treeMode) {
        return (
            <div className={selectedClassName}>
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
                {showHide &&
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
                    />
                }
                <PIOpenBracket />
                <span className='pi-lang'>{props.node.L}</span>
                {" "}
                <span
                    className='text-show pi'
                    onClick={() => {
                        xmlModesContext.setPath(props.path)
                        xmlModesContext.setNode(props.node)
                        xmlModesContext.setMode('PI_EDIT_MODE')
                        xmlModesContext.setPaths(clearPaths())
                    }}>
                    {escapePIBody(body)}
                </span>
                {" "}
                <PICloseBracket />
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
                        <PIOpenBracket /><br />
                        {props.node.B.trim()}<br />
                        <PICloseBracket />
                    </XmlShow> :
                    null
                }
            </>
        )
    }
}
