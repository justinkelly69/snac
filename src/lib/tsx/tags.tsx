import React, { useContext } from 'react'
import {
    SNACElement, SwitchStates,
    XMLModesType, XMLRWType, XMLTagOpenCloseType
} from '../snac/types'
import { snacOpts } from '../snac/opts'
import { Prefix } from './prefix'
import { Attributes } from './attributes'
import { EditBoxGridStyle } from '../snac/styles'
import { ShowHideSwitch } from './showhide'
import {
    XMLRWContext, XMLTagOpenCloseContext,
    XMLModesContext, insertPath
} from '../snac/contexts'
import { clearPaths } from '../snac/paths'

export const OpenTag = (props: {
    node: SNACElement,
    path: number[],
}): JSX.Element => {

    const xmlModesContext = useContext(XMLModesContext) as XMLModesType
    const xmlRWContext = useContext(XMLRWContext) as XMLRWType
    const openCloseContext = useContext(XMLTagOpenCloseContext) as XMLTagOpenCloseType

    let selectState = SwitchStates.HIDDEN
    let attributesOpenState = SwitchStates.HIDDEN
    let childrenOpenState = SwitchStates.HIDDEN
    let closeSlash = "/"

    if (snacOpts.xml_showSelected && ((xmlModesContext.mode === 'VIEW_MODE' || xmlModesContext.mode === 'SELECT_MODE'))) {
        selectState = openCloseContext.isSelected ?
            SwitchStates.ON :
            SwitchStates.OFF
    }

    if (snacOpts.xml_showAttributesOpen && xmlModesContext.mode !== 'SELECT_MODE' &&
        Object.keys(props.node.A).length > 0) {
        attributesOpenState = openCloseContext.isAttributesOpen ?
            SwitchStates.ON :
            SwitchStates.OFF
    }

    if (!openCloseContext.isEmpty) {
        if (snacOpts.xml_showChildrenOpen && xmlModesContext.mode !== 'SELECT_MODE') {
            childrenOpenState = openCloseContext.isChildrenOpen ?
                SwitchStates.ON :
                SwitchStates.OFF
        }
        closeSlash = ""
    }
    if (xmlRWContext.treeMode) {
        return (
            <>
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
                <ShowHideSwitch
                    path={props.path}
                    selected={childrenOpenState}
                    chars={snacOpts.switch_elementChars}
                    openClose={() =>
                        openCloseContext.setChildrenOpen(
                            !openCloseContext.isChildrenOpen
                        )
                    }
                />
                &lt;
                <NSName
                    node={props.node}
                    openClose={() => {
                        xmlModesContext.setNode(props.node)
                        xmlModesContext.setPath(props.path)
                        xmlModesContext.setMode('ELEMENT_EDIT_MODE')
                        xmlModesContext.setPaths(clearPaths())

                    }}
                />
                <>
                    {openCloseContext.isAttributesOpen ?
                        <Attributes
                            attributes={props.node.A}
                            path={props.path}
                        /> :
                        null
                    }
                </>
                {closeSlash}&gt;
                <ShowHideSwitch
                    path={props.path}
                    selected={attributesOpenState}
                    chars={snacOpts.switch_attributeChars}
                    openClose={() =>
                        openCloseContext.setAttributesOpen(
                            !openCloseContext.isAttributesOpen
                        )
                    }
                />
            </>
        )
    }
    else {
        return (
            <div className='show-body-code'
                style={EditBoxGridStyle({
                    pathWidth: props.path.length
                })}
            >
                <span className='show-body-code-prefix'></span>
                <span className='show-body-code-text'>
                    &lt;
                    <NSName node={props.node} />
                    <Attributes
                        attributes={props.node.A}
                        path={props.path}
                    />
                    {props.node.C.length === 0 &&
                        '/'
                    }
                    &gt;
                </span>
            </div>
        )
    }
}

export const CloseTag = (props: {
    node: SNACElement,
    path: number[],
}): JSX.Element | null => {

    return (
        <div className='show-body-code'
            style={EditBoxGridStyle({
                pathWidth: props.path.length
            })}
        >
            <span className='show-body-code-prefix'></span>
            <span className='show-body-code-text'>
                &lt;/
                <NSName node={props.node} />
                &gt;
            </span>
        </div>
    )
}

const NSName = (props: {
    node: SNACElement,
    openClose?: Function
}): JSX.Element => {

    return props.node.S.length > 0 ?
        <span onClick={() => props.openClose && props.openClose()}>
            <span className='element-ns'>
                {props.node.S}
            </span>
            :
            <span className='element-name'>
                {props.node.N}
            </span>
        </span>
        :
        <span onClick={() => props.openClose && props.openClose()}
            className='element-name'>
            {props.node.N}
        </span>
}