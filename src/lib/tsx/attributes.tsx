import React, {
    useContext,
    useEffect,
    useState
} from 'react'
import {
    Button,
    TextInput
} from './widgets'
import {
    AttributesType,
    EditAttributesType,
    XMLAttributesOpenCloseType,
    XMLAttributesStoreType,
    XMLAttributesTableType,
    XMLModesType
} from '../snac/types'
import { snacOpts } from '../snac/opts'
import { Prefix } from './prefix'
import {
    attributeIsSelected,
    setSelectedAttribute,
    attributeIsDeleted,
    setDeletedAttribute,
    setSaveAttribute,
    setCancelAttribute,
    attributeGetValue,
    setNewAttribute,
} from '../snac/attsutils'
import { attributesGridStyle, EditBoxGridStyle } from '../snac/styles'
import {
    XMLAttributesTableContext,
    XMLAttributesOpenCloseContext,
    XMLRWContext,
    XMLModesContext,
    XMLAttributesStoreContext
} from '../snac/contexts'
import { attributeKeys } from '../snac/textutils'

export const Attributes = (props: {
    path: number[],
    attributes: AttributesType,
}): JSX.Element | null => {

    const xmlContext = useContext(XMLRWContext);

    return Object.keys(props.attributes).length > 0 ?
        <>
            <div>
                {Object.keys(props.attributes).map((ns, i) => {

                    return Object.keys(props.attributes[ns]).map((name, j) => {
                        let tagName = name
                        if (ns !== '@') {
                            tagName = `${ns}:${name}`
                        }
                        return (
                            <span key={`${i}:${j}`}>
                                {xmlContext.treeMode ?
                                    <>
                                        {i > 0 || j > 0 ? <br /> : null}
                                        <Attribute
                                            path={props.path}
                                            name={tagName}
                                            value={props.attributes[ns][name]}
                                        />
                                    </> :
                                    <>
                                        <Attribute
                                            path={[]}
                                            name={tagName}
                                            value={props.attributes[ns][name]}
                                        />
                                    </>
                                }
                            </span>
                        )
                    })

                })}
            </div>
            {xmlContext.treeMode &&
                Object.keys(props.attributes).length > 0 ?
                <>
                    {snacOpts.prefix_spaceBefore}
                    <Prefix
                        path={props.path}
                    />
                    {snacOpts.prefix_spaceAfter}
                </>
                : null
            }
        </> :
        null
}

const Attribute = (props: {
    path: number[],
    name: string,
    value: string,
}): JSX.Element => {

    const xmlContext = useContext(XMLRWContext);

    if (xmlContext.treeMode) {
        return (
            <span className='attribute'>
                <Prefix
                    path={props.path}
                />
                {snacOpts.prefix_attributePrefix}
                <ANSName
                    name={props.name}
                    openClose={f => f}
                />
                =&quot;
                <span className='attribute-value'>
                    {props.value}
                </span>
                &quot;
            </span>
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
                    {snacOpts.prefix_attributePrefix}
                    <ANSName
                        name={props.name}
                        openClose={f => f}
                    />
                    =&quot;
                    <span className='attribute-value'>
                        {props.value}
                    </span>
                    &quot;
                </span>
            </div>
        )
    }
}

export const AttributesEdit = (props: {
    attributes: AttributesType,
    path: number[],
    openClose?: Function
}): JSX.Element => {

    const [attributes, setAttributes] = useState(props.attributes)
    const [editAttributes, setEditAttributes] = useState(true)
    const [numRows, setNumRows] = useState(1)

    const keys = attributeKeys(attributes)

    useEffect(() => {
        setAttributes(props.attributes)
        setNumRows(keys.length + 1)
    }, [props.attributes, keys])

    console.log('AttributesEdit attributes, keys', JSON.stringify(attributes, null, 4), JSON.stringify(keys, null, 4))

    console.log('numRows', numRows)

    return (
        <>
            <span
                className='attributes-table'
                style={attributesGridStyle({
                    keys: keys,
                    pathWidth: props.path.length * 1.2,
                    buttonWidth: 6,
                    cellWidth: 6,
                    height: numRows * 1.4,
                })}
            >
                <span
                    style={{
                        gridArea: `1 / 1 / ${numRows} / 1`,
                    }}
                ></span>
                {/*<span>
                    <Button
                        className='button x-button'
                        onClick={() => {
                            props.openClose && props.openClose()
                        }}
                        label='X'
                    />
                </span>
                 {editAttributes &&
                    <>
                        <span>
                            <Button
                                className='button text-button'
                                onClick={() => {
                                    setEditAttributes(true)
                                }}
                                label='Edit'
                            />
                            <span style={{
                                display: 'block',
                                width: '6em'
                            }}>
                            </span>
                        </span>
                    </>
                } */}

                <AttributesTable
                    path={props.path}
                    attributes={attributes}
                />
            </span>
        </>
    )
}

export const AttributesTable = (props: {
    path: number[],
    attributes: AttributesType,
}): JSX.Element => {

    //console.log('AttributesTable', JSON.stringify(props.attributes, null, 4))

    const openCloseContext = useContext(XMLAttributesOpenCloseContext) as XMLAttributesOpenCloseType
    const storeContext = useContext(XMLAttributesStoreContext) as XMLAttributesStoreType

    //console.log('AttributesTable store', JSON.stringify(storeContext.store, null, 4))


    //const newAttributes = snac2EditAttributes(props.attributes)

    // const [state, dispatch] = useReducer(
    //     attributesEditReducer,
    //     newAttributes
    // )

    // (alias) type XMLAttributesOpenCloseType = {
    //     setAttributes: Function;
    //     editAttributes: boolean;
    //     numRows: number;
    //     setNumRows: Function;
    // }

    //const numRows = attributeGetNumRows(state)

    //console.log('AttributesTable numRows', JSON.stringify(numRows, null, 4))
    //console.log('AttributesTable newAttributes', JSON.stringify(newAttributes, null, 4))
    //console.log('AttributesTable state', JSON.stringify(state, null, 4))

    const [selected, setSelected] = useState({
        ns: '#',
        name: '#',
    })

    return (
        <>
            {Object.keys(storeContext.store).map((ns, i) => {
                return Object.keys(storeContext.store[ns]).map((name, j) => {
                    console.log('state', ns, name, i, j)
                    return (
                        <XMLAttributesTableContext.Provider
                            key={`${i}:${j}`}
                            value={{
                                ns: ns,
                                name: name,
                                value: attributeGetValue(storeContext.store, ns, name),
                                dispatch: storeContext.dispatch,
                                isDeleted: attributeIsDeleted(storeContext.store, ns, name),
                                isSelected: attributeIsSelected(selected, ns, name),
                                setSelected: setSelected,
                            }}>
                            <AttributeTableRow />
                        </XMLAttributesTableContext.Provider >
                    )
                })
            })}

            {openCloseContext.editAttributes ?
                <AttributeNewRow
                    state={storeContext.store}
                    dispatch={storeContext.dispatch}
                /> :
                <span></span>
            }
        </>
    )
}

const AttributeTableRow = () => {

    const xmlModesContext = useContext(XMLModesContext) as XMLModesType
    const openCloseContext = useContext(XMLAttributesOpenCloseContext) as XMLAttributesOpenCloseType
    const tableContext = useContext(XMLAttributesTableContext) as XMLAttributesTableType

    const classDeleted = tableContext.isDeleted ? 'attribute-deleted' : ''
    const deletedLabel = tableContext.isDeleted ? 'O' : 'X'

    const [value, setValue] = useState(tableContext.value)
    const [oldValue, setOldValue] = useState(tableContext.value)

    return (
        <>
            <span>
                {openCloseContext.editAttributes &&
                    //xmlModesContext.mode === 'VIEW_MODE' &&
                    <Button
                        className='button x-button'
                        onClick={() => {
                            setDeletedAttribute({
                                ...tableContext,
                            })
                        }}
                        label={deletedLabel}
                    />
                }
            </span>
            <span className={`attribute-ns ${classDeleted}`}
                onClick={() => {
                    openCloseContext.editAttributes &&
                        setSelectedAttribute({
                            ...xmlModesContext,
                            ...tableContext,
                        })
                }}
            >
                {tableContext.ns !== '@' ? `${tableContext.ns}:` : ''}
            </span>
            <span className={`attribute-name ${classDeleted}`}
                onClick={() => {
                    openCloseContext.editAttributes &&
                        setSelectedAttribute({
                            ...xmlModesContext,
                            ...tableContext,
                        })
                }}
            >
                {tableContext.name}
            </span>

            {xmlModesContext.mode === 'ELEMENT_EDIT_MODE' &&
                tableContext.isSelected ?
                <>
                    <span>
                        <TextInput
                            name="ns"
                            className='text-input attribute-value-input'
                            value={value}
                            size={4}
                            placeholder='ns'
                            onChange={(e: {
                                target: {
                                    value: React.SetStateAction<string>
                                }
                            }) => setValue(e.target.value)}
                        />
                    </span>
                    <span>
                        <Button
                            className='button text-button'
                            onClick={() => {
                                setOldValue(value)
                                setSaveAttribute({
                                    ...xmlModesContext,
                                    ...tableContext,
                                    value
                                })
                            }}
                            label='Save'
                        />
                    </span>
                    <span>
                        <Button
                            className='button text-button'
                            onClick={() => {
                                setValue(oldValue)
                                setCancelAttribute({
                                    ...xmlModesContext,
                                    ...tableContext,
                                    oldValue,
                                })
                            }}
                            label='Cancel'
                        />
                    </span>
                </> :
                <>
                    <span>
                        <span className={`attribute-value  ${classDeleted}`}
                            onClick={() => {
                                openCloseContext.editAttributes &&
                                    setSelectedAttribute({
                                        ...xmlModesContext,
                                        ...tableContext,
                                    })
                            }}>
                            {value}
                        </span>
                    </span>
                    <span></span>
                    <span></span>
                </>
            }
        </>
    )
}

const AttributeNewRow = (props: {
    state: EditAttributesType
    dispatch: Function
}) => {

    const xmlModesContext = useContext(XMLModesContext) as XMLModesType
    const openCloseContext = useContext(XMLAttributesOpenCloseContext)

    const [ns, setNs] = useState('')
    const [name, setName] = useState('')
    const [value, setValue] = useState('')

    return (xmlModesContext.mode === 'INSERT_MODE' ?
        <>
            <span className='attributes-table-cell'></span>
            <span className='attributes-table-cell'></span>
            <span className='attributes-table-cell'>
                <TextInput
                    name="ns"
                    className='text-input attribute-ns-input'
                    value={ns}
                    size={4}
                    placeholder='ns'
                    onChange={(e: {
                        target: {
                            value: React.SetStateAction<string>
                        }
                    }) => setNs(e.target.value)}
                />
            </span>
            <span className='attributes-table-cell'>
                <TextInput
                    name="name"
                    className='text-input attribute-name-input'
                    value={name}
                    size={4}
                    placeholder='name'
                    onChange={(e: {
                        target: {
                            value: React.SetStateAction<string>
                        }
                    }) => setName(e.target.value)}
                />
            </span>
            <span className='attributes-table-cell'>
                <TextInput
                    name="value"
                    className='text-input attribute-value-input'
                    value={value}
                    size={4}
                    placeholder='value'
                    onChange={(e: {
                        target: {
                            value: React.SetStateAction<string>
                        }
                    }) => setValue(e.target.value)}
                />
            </span>

            <span className='attributes-table-cell'>
                <Button
                    className='button text-button'
                    onClick={() => {
                        const newNs = ns.length === 0 ? '@' : ns

                        if (name.length > 0 &&
                            value.length > 0 &&
                            !(newNs in props.state
                                && name in props.state[newNs]
                            )) {
                            setNewAttribute(
                                props.dispatch,
                                newNs,
                                name,
                                value
                            )
                            openCloseContext.setNumRows(
                                openCloseContext.numRows + 1
                            )
                        }
                        setNs('')
                        setName('')
                        setValue('')
                        xmlModesContext.setMode('LIST_MODE')
                    }}
                    label='Save'
                />
            </span>
            <span className='attributes-table-cell'>
                <Button
                    className='button text-button'
                    onClick={() => {
                        setNs('')
                        setName('')
                        setValue('')
                        xmlModesContext.setMode('LIST_MODE')
                    }}
                    label='Cancel'
                />
            </span>
        </> :
        <>
            <span className='attributes-table-cell'></span>
            <span className='attributes-table-cell'>
                {xmlModesContext.mode === 'LIST_MODE' &&
                    <Button
                        className='button x-button'
                        onClick={() => {
                            setNs('')
                            setName('')
                            setValue('')
                            xmlModesContext.setMode('INSERT_MODE')
                        }}
                        label='+'
                    />
                }
            </span>
            <span className='attributes-table-cell'></span>
            <span className='attributes-table-cell'></span>
            <span className='attributes-table-cell'></span>
            <span className='attributes-table-cell'></span>
        </>
    )
}

const ANSName = (props: {
    name: string,
    openClose: Function
}): JSX.Element => {
    const tagANSName = props.name.split(/:/)
    return tagANSName.length > 1 ?

        <span onClick={() => props.openClose && props.openClose()}>
            <span className='attribute-ns'>
                {tagANSName[0]}
            </span>
            :
            <span className='attribute-name'>
                {tagANSName[1]}
            </span>
        </span> :

        <span onClick={() => props.openClose && props.openClose()}
            className='attribute-name'>
            {tagANSName[0]}
        </span>
}
