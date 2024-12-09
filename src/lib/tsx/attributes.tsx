import React, { useContext, useEffect, useState } from 'react'
import { Button, TextInput } from './widgets'
import { AttributeModes, AttributesType, EditAttributesType } from '../snac/types'
import { snacOpts } from '../snac/opts'
import { Prefix } from './prefix'
import { attributesGridStyle, EditBoxGridStyle } from '../snac/styles'
import { XMLAttributesEditContext, XMLRWContext, XMLAttributeRowContext } from '../snac/contexts'
import { attributeKeys, cancelAttribute, deleteAttribute, newAttribute, rowSelected, saveAttribute } from '../snac/attsutils'
import { selectAttribute } from '../snac/attsutils'

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
                    openClose={(f: any) => f}
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
                        openClose={(f: any) => f}
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
    editAttributes: EditAttributesType,
    setEditAttributes: Function,
    path: number[],
}): JSX.Element => {

    const [numRows, setNumRows] = useState(1)
    const [attMode, setAttMode] = useState<AttributeModes>('ATTRIBUTES_VIEW_MODE')
    const keys = attributeKeys(props.editAttributes)

    useEffect(() => {
        setNumRows(keys.length + 1)
    }, [keys])

    const value = {
        attMode: attMode,
        setAttMode: setAttMode,
        numRows: numRows,
        setNumRows: setNumRows,
    }

    return (
        <XMLAttributeRowContext.Provider value={value}>
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
                {Object.keys(props.editAttributes).map((ns, i) => {
                    return Object.keys(props.editAttributes[ns]).map((name, j) => {
                        return (
                            <AttributeTableRow
                                key={`${i}:${j}`}
                                ns={ns}
                                name={name}
                            />
                        )
                    })
                })}
                <AttributeNewRow />
            </span >
        </XMLAttributeRowContext.Provider>

    )
}

const AttributeTableRow = (props: {
    ns: string,
    name: string,
}) => {
    const { editAttributes, setEditAttributes } = useContext(XMLAttributesEditContext)
    const { attMode, setAttMode } = useContext(XMLAttributeRowContext)

    const classDeleted = editAttributes[props.ns][props.name].d ? 'attribute-deleted' : ''
    const deletedLabel = editAttributes[props.ns][props.name].d ? 'O' : 'X'

    const [newValue, setNewValue] = useState('')
    const [oldValue, setOldValue] = useState('')

    // console.log('attMode', attMode)
    // console.log('oldValue', oldValue)
    // console.log('newValue', newValue)

    return (
        <>
            <span>
                {attMode === 'ATTRIBUTES_VIEW_MODE' &&
                    <Button
                        className='button x-button'
                        onClick={() => {
                            setEditAttributes(
                                deleteAttribute(editAttributes, {
                                    ns: props.ns,
                                    name: props.name,
                                })
                            )
                        }}
                        label={deletedLabel}
                    />
                }
            </span>
            <span
                className={`text-show attribute-ns ${classDeleted}`}
                onClick={() => {
                    setEditAttributes(
                        selectAttribute(editAttributes, {
                            ns: props.ns,
                            name: props.name,
                        })
                    )
                    if(attMode === 'ATTRIBUTES_VIEW_MODE') {
                        setAttMode('ATTRIBUTES_EDIT_MODE')
                    }
                    else {
                        setAttMode('ATTRIBUTES_VIEW_MODE')
                    }
                }}
            >
                {props.ns !== '@' ? `${props.ns}:` : ''}
            </span>
            <span
                className={`text-show attribute-name ${classDeleted}`}
                onClick={() => {
                    setEditAttributes(
                        selectAttribute(editAttributes, {
                            ns: props.ns,
                            name: props.name,
                        })
                    )
                    if(attMode === 'ATTRIBUTES_VIEW_MODE') {
                        setAttMode('ATTRIBUTES_EDIT_MODE')
                    }
                    else {
                        setAttMode('ATTRIBUTES_VIEW_MODE')
                    }
                }}
            >
                {props.name}
            </span>

            {attMode === 'ATTRIBUTES_EDIT_MODE' &&
                rowSelected(editAttributes, props.ns, props.name) ?
                <>
                    <span>
                        <TextInput
                            name="ns"
                            className='text-input attribute-value-input'
                            value={newValue}
                            size={4}
                            placeholder='value'
                            onChange={(e: { target: { value: React.SetStateAction<string> } }) => setNewValue(e.target.value)}
                        />
                    </span>
                    <span>
                        <Button
                            className='button text-button'
                            onClick={() => {
                                setEditAttributes(
                                    saveAttribute(editAttributes, {
                                        ns: props.ns,
                                        name: props.name,
                                        value: newValue
                                    })
                                )
                                setAttMode('ATTRIBUTES_VIEW_MODE')
                                setOldValue('')
                            }}
                            label='Save'
                        />
                    </span>
                    <span>
                        <Button
                            className='button text-button'
                            onClick={() => {
                                setEditAttributes(
                                    cancelAttribute(editAttributes)
                                )
                                setAttMode('ATTRIBUTES_VIEW_MODE')
                                setNewValue(oldValue)
                                setOldValue('')
                            }}
                            label='Cancel'
                        />
                    </span>
                </> :
                <>
                    <span
                        className={`text-show attribute-value  ${classDeleted}`}
                        onClick={() => {
                            setEditAttributes(
                                selectAttribute(editAttributes, {
                                    ns: props.ns,
                                    name: props.name,
                                })
                            )
                            setAttMode('ATTRIBUTES_EDIT_MODE')
                        }}
                    >
                        {editAttributes[props.ns][props.name].V}
                    </span>
                    <span></span>
                    <span></span>
                </>
            }
        </>
    )
}

const AttributeNewRow = () => {
    const { editAttributes, setEditAttributes } = useContext(XMLAttributesEditContext)
    const { attMode, setAttMode, numRows, setNumRows } = useContext(XMLAttributeRowContext)

    const [ns, setNs] = useState('')
    const [name, setName] = useState('')
    const [value, setValue] = useState('')

    return (attMode === 'ATTRIBUTES_NEW_MODE' ?
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
                    onChange={(e: { target: { value: React.SetStateAction<string> } }) => setNs(e.target.value)}
                />
            </span>
            <span className='attributes-table-cell'>
                <TextInput
                    name="name"
                    className='text-input attribute-name-input'
                    value={name}
                    size={4}
                    placeholder='name'
                    onChange={(e: { target: { value: React.SetStateAction<string> } }) => setName(e.target.value)}
                />
            </span>
            <span className='attributes-table-cell'>
                <TextInput
                    name="value"
                    className='text-input attribute-value-input'
                    value={value}
                    size={4}
                    placeholder='value'
                    onChange={(e: { target: { value: React.SetStateAction<string> } }) => setValue(e.target.value)}
                />
            </span>

            <span className='attributes-table-cell'>
                <Button
                    className='button text-button'
                    onClick={() => {
                        const namespace = ns.length === 0 ? '@' : ns

                        if (name.length > 0 && value.length > 0 &&
                            !(ns in editAttributes && name in editAttributes[namespace])) {
                            setEditAttributes(
                                newAttribute(editAttributes, {
                                    ns: ns,
                                    name: name,
                                    value: value
                                })
                            )
                            console.log('newAttribute', JSON.stringify(editAttributes, null, 4))
                        }
                        setNumRows(numRows + 1)
                        setNs('')
                        setName('')
                        setValue('')
                        setAttMode('ATTRIBUTES_VIEW_MODE')
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
                        setAttMode('ATTRIBUTES_VIEW_MODE')
                    }}
                    label='Cancel'
                />
            </span>
        </> :
        <>
            <span className='attributes-table-cell'></span>
            <span className='attributes-table-cell'>
                {attMode === 'ATTRIBUTES_VIEW_MODE' &&
                    <Button
                        className='button x-button'
                        onClick={() => {
                            setNs('')
                            setName('')
                            setValue('')
                            setAttMode('ATTRIBUTES_NEW_MODE')
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
