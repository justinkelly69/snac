import React, { useContext, useState } from 'react'
import { SNACCDATA, SwitchStates, XMLModesType, XMLRWType } from '../snac/types'
import { Prefix } from './prefix'
import { escapeCDATA, trimBody } from '../snac/textutils'
import { snacOpts } from '../snac/opts'
import { ShowHideSwitch } from './showhide'
import { insertPath, XMLModesContext, XMLRWContext } from '../snac/contexts'
import { XmlShow } from './xmlshow'
import { hasPath } from '../snac/paths'
import { CDATACloseBracket, CDATAOpenBracket } from './brackets'

export const CDATA = (props: {
    node: SNACCDATA,
    path: number[],
    isSelected: boolean,
}): JSX.Element => {

    const xmlRWContext = useContext(XMLRWContext) as XMLRWType
    const xmlModesContext = useContext(XMLModesContext) as XMLModesType

    const [isChildrenOpen, setChildrenOpen] = useState(false)

    const isSelected = hasPath(xmlModesContext.paths, props.path) || props.isSelected
    let selectState = SwitchStates.HIDDEN
    let selectedClassName = 'cdata'

    if (xmlRWContext.treeMode) {
        selectState = isSelected ?
            SwitchStates.ON :
            SwitchStates.OFF

        selectedClassName = isSelected && xmlModesContext.paths.length > 0 ?
            'cdata selected' :
            'cdata'
    }

    const [body, showHide] = trimBody(
        isChildrenOpen,
        props.node.D,
        snacOpts.xml_trimCDATALength,
        snacOpts.xml_ellipsis
    )

    if (xmlRWContext.treeMode) {
        return (
            <div className={selectedClassName}>
                <span>
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
                            selected={selectState}
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
                    {' '}
                    <CDATAOpenBracket />
                    <span
                        className='text-show cdata'
                        onClick={() => {
                            xmlModesContext.setPath(props.path)
                            xmlModesContext.setNode(props.node)
                            xmlModesContext.setMode('CDATA_EDIT_MODE')
                        }}>
                        {escapeCDATA(body)}
                    </span>
                    {" "}
                    <CDATACloseBracket />
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
                        <CDATAOpenBracket /><br />
                        {props.node.D.trim()}<br />
                        <CDATACloseBracket />
                    </XmlShow> :
                    null
                }
            </>

        )
    }
}
