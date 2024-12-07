import React, { useContext, useReducer, useState } from 'react'
import { SNACElement, XMLAttributeRowType, XMLModesType, XMLRWType } from '../snac/types'
import { snacOpts } from '../snac/opts'
import { Kids } from './kids'
import { XMLRWContext, XMLTagOpenCloseContext, XMLModesContext, XMLAttributeRowContext } from '../snac/contexts'
import { hasPath } from '../snac/paths'
import { CloseTag, OpenTag } from './tags'

export const Element = (props: {
    node: SNACElement,
    path: number[],
    isSelected: boolean,
}): JSX.Element => {

    const xmlRWContext = useContext(XMLRWContext) as XMLRWType
    const xmlModesContext = useContext(XMLModesContext) as XMLModesType
    //const xmlAttributesTableContext = useContext(XMLAttributesTableContext) as XMLAttributesTableType

    const [isAttributesOpen, setAttributesOpen] = useState(false)
    const [isChildrenOpen, setChildrenOpen] = useState(true)

    const isSelected = hasPath(xmlModesContext.paths, props.path) || props.isSelected

    let selectedClassName = 'element'

    if (xmlRWContext.treeMode && snacOpts.xml_showSelected && xmlModesContext.paths.length > 0) {
        selectedClassName = isSelected ?
            'element selected' :
            'element'
    }

    const isEmpty = props.node.C.length === 0

    const xmlTagOpenCloseContext = {
        isEmpty: props.node.C.length === 0,
        isSelected: isSelected,
        isAttributesOpen: isAttributesOpen,
        setAttributesOpen: setAttributesOpen,
        isChildrenOpen: isChildrenOpen,
        setChildrenOpen: setChildrenOpen,
    }

    return (
        <XMLTagOpenCloseContext.Provider value={xmlTagOpenCloseContext}>
            <div className={selectedClassName}>

                {xmlRWContext.treeMode || isSelected ?
                    <OpenTag
                        node={props.node}
                        path={props.path}
                    />
                    :
                    null
                }

                {isChildrenOpen ?
                    <Kids
                        snac={props.node.C}
                        path={props.path}
                        isSelected={isSelected}
                    /> :
                    snacOpts.xml_ellipsis
                }

                {isSelected && !isEmpty && (!xmlRWContext.treeMode || snacOpts.xml_showCloseTags) ? (
                    <CloseTag
                        node={props.node}
                        path={props.path}
                    />
                ) :
                    null
                }
            </div>
        </XMLTagOpenCloseContext.Provider>
    )
}


