import React, { useState, forwardRef } from 'react'

import { Button, TextArea, TextInput, CDATA_OPEN_BRACKET, CDATA_CLOSE_BRACKET, COMMENT_OPEN_BRACKET, COMMENT_CLOSE_BRACKET } from './widgets'
import { SNACItem, SNACElement, SNACText, SNACCDATA, SNACComment, SNACPINode, AttributesType, SwitchStates, SNACOpts, OnOffHiddenChars } from '../snac/types'
import { escapeCDATA, escapeComment, escapePIBody } from '../snac/textutils'

export const Tag = (props: {
    root: SNACItem[],
    node: SNACElement,
    path: number[],
    opts: SNACOpts,
    getChildren: Function,
    funcs: { [name: string]: Function }
}): JSX.Element => {

    const [isSelected, setSelected] = useState(props.node.q)
    const [isAttributesOpen, setAttributesOpen] = useState(props.node.a)
    const [isChildrenOpen, setChildrenOpen] = useState(props.node.o)

    let selectedClassName = 'element'

    if (props.opts.xml_showSelected) {
        selectedClassName = isSelected ? 'element selected' : 'element'
    }

    let isEmpty = false
    if (props.node.C.length === 0) {
        isEmpty = true
    }

    return (
        <div className={selectedClassName}>
            <OpenTag
                root={props.root}
                node={props.node}
                path={props.path}
                isEmpty={isEmpty}
                opts={props.opts}
                isSelected={isSelected}
                setSelected={setSelected}
                isAttributesOpen={isAttributesOpen}
                setAttributesOpen={setAttributesOpen}
                isChildrenOpen={isChildrenOpen}
                setChildrenOpen={setChildrenOpen}
            />
            {isChildrenOpen ? props.getChildren(props.root, props.node["C"], props.path, props.funcs, props.opts) : props.opts.xml_ellipsis}
            {!isEmpty && props.opts.xml_showCloseTags ? (
                <CloseTag
                    root={props.root}
                    node={props.node}
                    path={props.path}
                    isEmpty={isEmpty}
                    opts={props.opts}
                    isSelected={isSelected}
                    setSelected={setSelected}
                    isChildrenOpen={isChildrenOpen}
                    setChildrenOpen={setChildrenOpen}
                />
            ) :
                null
            }
        </div>
    )
}

export const OpenTag = (props: {
    root: SNACItem[],
    node: SNACElement,
    path: number[],
    isEmpty: boolean,
    opts: SNACOpts,
    isSelected: boolean,
    setSelected: Function
    isAttributesOpen: boolean,
    setAttributesOpen: Function
    isChildrenOpen: boolean,
    setChildrenOpen: Function
}): JSX.Element => {

    let selectState = SwitchStates.HIDDEN
    let attributesOpenState = SwitchStates.HIDDEN
    let childrenOpenState = SwitchStates.HIDDEN
    let closeSlash = "/"

    if (props.opts.xml_showSelected) {
        selectState = props.isSelected ? SwitchStates.ON : SwitchStates.OFF
    }

    if (props.opts.xml_showAttributesOpen && Object.keys(props.node.A).length) {
        attributesOpenState = props.isAttributesOpen ? SwitchStates.ON : SwitchStates.OFF
    }

    if (!props.isEmpty) {
        if (props.opts.xml_showChildrenOpen) {
            childrenOpenState = props.isChildrenOpen ? SwitchStates.ON : SwitchStates.OFF
        }
        closeSlash = ""
    }

    return (
        <>
            <ShowHideSwitch
                root={props.root}
                path={props.path}
                selected={selectState}
                chars={props.opts.switch_selectChars}
                className='selected-show-hide'
                openClose={e => props.setSelected(!props.isSelected)}
            />
            <Prefix path={props.path} opts={props.opts} />
            <ShowHideSwitch
                root={props.root}
                path={props.path}
                selected={childrenOpenState}
                chars={props.opts.switch_elementChars}
                className='element-show-hide'
                openClose={e => props.setChildrenOpen(!props.isChildrenOpen)}
            />
            &lt;
            <NsName name={props.node.N} type='element' />
            <>
                {props.isAttributesOpen ?
                    <>
                        <Attributes path={props.path} attributes={props.node.A} opts={props.opts} />
                        {Object.keys(props.node.A).length > 0 ?
                            <>
                                {props.opts.prefix_spaceBefore}
                                <Prefix path={props.path} opts={props.opts} />
                                {props.opts.prefix_spaceAfter}
                            </>
                            : null
                        }
                    </> :
                    null
                }
            </>
            {closeSlash}&gt;
            <ShowHideSwitch
                root={props.root}
                path={props.path}
                selected={attributesOpenState}
                chars={props.opts.switch_attributeChars}
                className='attributes-show-hide'
                openClose={e => props.setAttributesOpen(!props.isAttributesOpen)}
            />
        </>
    )
}

export const CloseTag = (props: {
    root: SNACItem[],
    node: SNACElement,
    path: number[],
    isEmpty: boolean,
    isSelected: boolean,
    setSelected: Function
    isChildrenOpen: boolean,
    setChildrenOpen: Function
    opts: SNACOpts,
}): JSX.Element | null => {

    let selectState = SwitchStates.HIDDEN
    let childrenOpenState = SwitchStates.HIDDEN

    if (props.opts.xml_showSelected) {
        selectState = props.isSelected ? SwitchStates.ON : SwitchStates.OFF
    }

    if (props.isEmpty) {
        if (props.opts.xml_showChildrenOpen) {
            childrenOpenState = props.isChildrenOpen ? SwitchStates.ON : SwitchStates.OFF
        }
    }
    return (
        <>
            {props.isChildrenOpen ? (
                <>
                    <ShowHideSwitch
                        root={props.root}
                        path={props.path}
                        selected={selectState}
                        chars={props.opts.switch_selectChars}
                        className='selected-show-hide'
                        openClose={e => props.setSelected(!props.isSelected)}
                    />
                    <Prefix path={props.path} opts={props.opts} />
                    <ShowHideSwitch
                        root={props.root}
                        path={props.path}
                        selected={childrenOpenState}
                        chars={props.opts.switch_elementChars}
                        className='element-show-hide'
                        openClose={e => props.setChildrenOpen(!props.isChildrenOpen)}
                    />
                </>
            ) :
                null
            }
            &lt;/
            <NsName name={props.node.N} type='element' />
            &gt;
        </>
    )
}

export const Text = (props: {
    root: SNACItem[],
    node: SNACText,
    path: number[],
    showSelected: boolean,
    showOpen: boolean,
    opts: SNACOpts,
}): JSX.Element => {

    const [isSelected, setSelected] = useState(false)
    const [isChildrenOpen, setChildrenOpen] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [insertMode, setInsertMode] = useState(false)

    const [nsText, setNSText] = useState('')
    const [nameText, setNameText] = useState('')
    const [valueText, setValueText] = useState(props.node.T)
    const [beforeText, setBeforeText] = useState('')
    const [duringText, setDuringText] = useState('')
    const [afterText, setAfterText] = useState('')

    let selectState = SwitchStates.HIDDEN
    let openState = SwitchStates.OFF
    let selectedClassName = 'text'

    if (props.showSelected) {
        selectState = isSelected ? SwitchStates.ON : SwitchStates.OFF
        selectedClassName = isSelected ? 'text selected' : 'text'
    }
    if (props.showOpen) {
        openState = isChildrenOpen ? SwitchStates.ON : SwitchStates.OFF
    }

    let text = valueText
    if (!isChildrenOpen && text.length > props.opts.xml_trimTextLength) {
        text = `${text.trim().substring(0, props.opts.xml_trimTextLength)} ${props.opts.xml_ellipsis}`
    }

    const prefix = <Prefix path={props.path} opts={props.opts} />

    return (
        <div className={selectedClassName}>
            <span className='text-head'>
                <ShowHideSwitch
                    root={props.root}
                    path={props.path}
                    selected={selectState}
                    chars={props.opts.switch_selectChars}
                    className='selected-show-hide'
                    openClose={e => setSelected(!isSelected)}
                />
                {prefix}
            </span>
            {openState === SwitchStates.ON ?
                <>
                    <span className='text-editor'>
                        {editMode ?
                            <>
                                <span className='text-editor-controls'>
                                    <Button
                                        className='text-button text-save'
                                        onClick={e => {
                                            setEditMode(false)
                                            setChildrenOpen(false)
                                        }}
                                        label='Save'
                                    />
                                    <Button
                                        className='text-button text-cancel'
                                        onClick={e => {
                                            setEditMode(false)
                                            setChildrenOpen(false)
                                        }}
                                        label='Cancel'
                                    />
                                </span>
                                <TextArea
                                    readOnly={false}
                                    className='text-editor-text'
                                    value={valueText}
                                    onChange={e => setValueText(e.target.value)}
                                />
                            </> :
                            <>
                                {insertMode ?
                                    <>
                                        <span className='text-editor-controls'>
                                            <Button
                                                className='text-button text-insert'
                                                onClick={e => {
                                                    setInsertMode(false)
                                                    setNSText('')
                                                    setNameText('')
                                                }}
                                                label='X'
                                            />
                                            <TextInput
                                                name="ns"
                                                size={4}
                                                placeholder='ns'
                                                onChange={e => setNSText(e.target.value)}
                                            />
                                            <TextInput
                                                name="name"
                                                size={10}
                                                placeholder='name'
                                                onChange={e => setNameText(e.target.value)}
                                            />
                                            <Button
                                                className='text-button text-insert'
                                                onClick={e => {
                                                    if (nsText.length > 0 && nameText.length > 0) {
                                                        const tag = `${nsText}:${nameText}`
                                                        console.log(`${props.path}:${beforeText}<${tag}>${duringText}</${tag}>${afterText}`)
                                                    }
                                                    else if (nameText.length > 0) {
                                                        const tag = `${nameText}`
                                                        console.log(`${props.path}:${beforeText}<${tag}>${duringText}</${tag}>${afterText}`)
                                                    }
                                                    setChildrenOpen(false)
                                                    setInsertMode(false)
                                                    setNSText('')
                                                    setNameText('')
                                                    setBeforeText('')
                                                    setDuringText('')
                                                    setAfterText('')
                                                }}
                                                label='Insert Here'
                                            />
                                        </span>
                                        <TextArea
                                            readOnly={true}
                                            className='text-editor-text'
                                            value={valueText}
                                            onSelect={e => {
                                                const value = e.target.value
                                                const start = e.target.selectionStart
                                                const end = e.target.selectionEnd

                                                setBeforeText(value.substr(0, start))
                                                setDuringText(value.substr(start, end - start))
                                                setAfterText(value.substr(end))
                                            }}
                                        />
                                    </> :
                                    <>
                                        <span className='text-editor-controls'>
                                            <Button
                                                className='text-button text-edit'
                                                onClick={e => setEditMode(true)}
                                                label='Edit'
                                            />
                                            <Button
                                                className='text-button text-insert'
                                                onClick={e => setInsertMode(true)}
                                                label='Insert Mode'
                                            />
                                        </span>
                                        <span className='text-editor-text' >
                                            {text.trim()}
                                        </span>
                                    </>
                                }

                            </>
                        }
                    </span>
                    <br />
                </> :
                <span className='text-body' onClick={e => {
                    setChildrenOpen(true)
                }}>
                    <span className='text-bracket'>[</span>
                    {text}
                    <span className='text-bracket'>]</span>
                </span>
            }
        </div>
    )
}

export const CDATA = (props: {
    root: SNACItem[],
    node: SNACCDATA,
    path: number[],
    showSelected: boolean,
    showOpen: boolean,
    opts: SNACOpts,
}): JSX.Element => {

    const [isSelected, setSelected] = useState(false)
    const [isChildrenOpen, setChildrenOpen] = useState(false)
    const [isEditable, setIsEditable] = useState(false)

    const [valueCDATA, setValueCDATA] = useState(props.node.D)
    const [tmpValueCDATA, setTmpValueCDATA] = useState(props.node.D)

    let selectState = SwitchStates.HIDDEN
    let openState = SwitchStates.OFF
    let selectedClassName = 'cdata'

    if (props.showSelected) {
        selectState = isSelected ? SwitchStates.ON : SwitchStates.OFF
        selectedClassName = isSelected ? 'cdata selected' : 'cdata'
    }

    if (props.showOpen) {
        openState = isChildrenOpen ? SwitchStates.ON : SwitchStates.OFF
    }

    let cdata = valueCDATA
    if (!isChildrenOpen && cdata.length > props.opts.xml_trimTextLength) {
        cdata = `${cdata.substring(0, props.opts.xml_trimCDATALength)} ${props.opts.xml_ellipsis}`
    }

    const prefix = <Prefix path={props.path} opts={props.opts} />

    return (
        <div className={selectedClassName}>
            <ShowHideSwitch
                root={props.root}
                path={props.path}
                selected={selectState}
                chars={props.opts.switch_selectChars}
                className='selected-show-hide'
                openClose={e => setSelected(!isSelected)}
            />
            <Prefix path={props.path} opts={props.opts} />
            <CDATA_OPEN_BRACKET />
            {openState === SwitchStates.ON ?
                <>
                    <br /> {prefix}
                    <span className='cdata-body'>
                        {isEditable ?
                            <>
                                <span className='text-editor-controls'>
                                    <Button
                                        className='text-button text-save'
                                        onClick={e => {
                                            setIsEditable(false)
                                            setChildrenOpen(false)
                                            setValueCDATA(tmpValueCDATA)
                                            console.log(`<![CDATA[ ${tmpValueCDATA} ]]>`)
                                        }}
                                        label='Save'
                                    />
                                    <Button
                                        className='text-button text-cancel'
                                        onClick={e => {
                                            setIsEditable(false)
                                            setChildrenOpen(false)
                                            setTmpValueCDATA('')
                                        }}
                                        label='Cancel'
                                    />
                                </span>
                                <TextArea
                                    readOnly={false}
                                    className='text-editor-text'
                                    value={tmpValueCDATA}
                                    onChange={e => setTmpValueCDATA(e.target.value)}
                                />
                            </> :
                            <>
                                <span className='text-editor-controls'>
                                    <Button
                                        className='text-button text-edit'
                                        onClick={e => {
                                            setIsEditable(true)
                                            setTmpValueCDATA(valueCDATA)
                                        }}
                                        label='Edit'
                                    />
                                    <Button
                                        className='text-button text-remove'
                                        onClick={e => {
                                            setIsEditable(false)
                                            setChildrenOpen(false)
                                        }}
                                        label='Remove'
                                    />
                                </span>
                                <span className='text-editor-text' >
                                    {cdata.trim()}
                                </span>
                            </>
                        }
                    </span>
                    <br /> {prefix}
                </> :
                <span className='cdata-body' onClick={e => {
                    setChildrenOpen(true)
                }}>
                    {escapeCDATA(cdata)}
                </span>
            }
            <CDATA_CLOSE_BRACKET />
        </div>
    )
}

export const Comment = (props: {
    root: SNACItem[],
    node: SNACComment,
    path: number[],
    showSelected: boolean,
    showOpen: boolean,
    opts: SNACOpts,
}): JSX.Element | null => {

    const [isSelected, setSelected] = useState(false)
    const [isChildrenOpen, setChildrenOpen] = useState(false)
    const [isEditable, setIsEditable] = useState(false)

    const [valueComment, setValueComment] = useState(props.node.M)
    const [tmpValueComment, setTmpValueComment] = useState(props.node.M)

    let selectState = SwitchStates.HIDDEN
    let openState = SwitchStates.HIDDEN
    let selectedClassName = 'comment'

    if (props.showSelected) {
        selectState = isSelected ? SwitchStates.ON : SwitchStates.OFF
        selectedClassName = isSelected ? 'comment selected' : 'comment'
    }

    if (props.showOpen) {
        openState = isChildrenOpen ? SwitchStates.ON : SwitchStates.OFF
    }

    let comment = valueComment
    if (!isChildrenOpen && comment.length > props.opts.xml_trimTextLength) {
        comment = `${comment.substring(0, props.opts.xml_trimCommentLength)} ${props.opts.xml_ellipsis}`
    }

    const prefix = <Prefix path={props.path} opts={props.opts} />

    return (
        <div className={selectedClassName}>
            <ShowHideSwitch
                root={props.root}
                path={props.path}
                selected={selectState}
                chars={props.opts.switch_selectChars}
                className='selected-show-hide'
                openClose={e => setSelected(!isSelected)}
            />
            {prefix}

            <COMMENT_OPEN_BRACKET />
            {openState === SwitchStates.ON ?
                <>
                    <br /> {prefix}
                    <span className='comment-body'>
                        {isEditable ?
                            <>
                                <span className='text-editor-controls'>
                                    <Button
                                        className='text-button text-save'
                                        onClick={e => {
                                            setIsEditable(false)
                                            setChildrenOpen(false)
                                            setValueComment(tmpValueComment)
                                            console.log(`<!-- ${tmpValueComment} -->`)
                                        }}
                                        label='Save'
                                    />
                                    <Button
                                        className='text-button text-cancel'
                                        onClick={e => {
                                            setIsEditable(false)
                                            setChildrenOpen(false)
                                            setTmpValueComment('')
                                        }}
                                        label='Cancel'
                                    />
                                </span>
                                <TextArea
                                    readOnly={false}
                                    className='text-editor-text'
                                    value={tmpValueComment}
                                    onChange={e => setTmpValueComment(e.target.value)}
                                />
                            </> :
                            <>
                                <span className='text-editor-controls'>
                                    <Button
                                        className='text-button text-edit'
                                        onClick={e => {
                                            setIsEditable(true)
                                            setTmpValueComment(valueComment)
                                        }}
                                        label='Edit'
                                    />
                                    <Button
                                        className='text-button text-remove'
                                        onClick={e => {
                                            setIsEditable(false)
                                            setChildrenOpen(false)
                                        }}
                                        label='Remove'
                                    />
                                </span>
                                <span className='text-editor-text' >
                                    {comment.trim()}
                                </span>
                            </>
                        }
                    </span>
                    <br /> {prefix}
                </> :
                <span className='comment-body' onClick={e => {
                    setChildrenOpen(true)
                }}>
                    {escapeCDATA(comment)}
                </span>
            }
            <COMMENT_CLOSE_BRACKET />
        </div>
    )
}

export const PI = (props: {
    root: SNACItem[],
    node: SNACPINode,
    path: number[],
    showSelected: boolean,
    showOpen: boolean,
    opts: SNACOpts,
}): JSX.Element | null => {

    const [isSelected, setSelected] = useState(false)
    const [isChildrenOpen, setChildrenOpen] = useState(false)
    const [isEditable, setIsEditable] = useState(false)

    const [valuePILang, setValuePILang] = useState(props.node.L)
    const [valuePIBody, setValuePIBody] = useState(props.node.B)
    const [tmpValuePIBody, setTmpValuePIBody] = useState(props.node.B)

    let selectState = SwitchStates.HIDDEN
    let openState = SwitchStates.HIDDEN
    let selectedClassName = 'pi'

    if (props.showSelected) {
        selectState = isSelected ? SwitchStates.ON : SwitchStates.OFF
        selectedClassName = isSelected ? 'pi selected' : 'pi'
    }

    if (props.showOpen) {
        openState = isChildrenOpen ? SwitchStates.ON : SwitchStates.OFF
    }

    let body = valuePIBody
    if (!isChildrenOpen && body.length > props.opts.xml_trimTextLength) {
        body = `${props.opts.xml_ellipsis}`
    }

    const prefix = <Prefix path={props.path} opts={props.opts} />

    return (
        <div className={selectedClassName}>
            <ShowHideSwitch
                root={props.root}
                path={props.path}
                selected={selectState}
                chars={props.opts.switch_selectChars}
                className='selected-show-hide'
                openClose={e => setSelected(!isSelected)}
            />
            {prefix}
            &lt;?
            <span className='pi-lang'>{props.node.L}</span>
            {" "}
            {openState === SwitchStates.ON ?
                <>
                    <br /> {prefix}
                    <span className='pi-body'>
                        {isEditable ?
                            <>
                                <span className='text-editor-controls'>
                                    {/*                                     <button className='text-button text-save' onClick={e => {
                                        setIsEditable(false)
                                        setChildrenOpen(false)
                                    }}>Save</button>
                                    <button className='text-button text-cancel' onClick={e => {
                                        setIsEditable(false)
                                        setChildrenOpen(false)
                                    }}>Cancel</button> */}
                                    <Button
                                        className='text-button text-save'
                                        onClick={e => {
                                            setIsEditable(false)
                                            setChildrenOpen(false)
                                            setValuePIBody(tmpValuePIBody)
                                            console.log(`<?${valuePILang} ${tmpValuePIBody} ?>`)
                                        }}
                                        label='Save'
                                    />
                                    <Button
                                        className='text-button text-cancel'
                                        onClick={e => {
                                            setIsEditable(false)
                                            setChildrenOpen(false)
                                            setTmpValuePIBody('')
                                        }}
                                        label='Cancel'
                                    />
                                </span>
                                <TextArea
                                    readOnly={false}
                                    className='text-editor-text'
                                    value={tmpValuePIBody}
                                    onChange={e => setTmpValuePIBody(e.target.value)}
                                />
                            </> :
                            <>
                                <span className='text-editor-controls'>
                                    {/*                                     <button className='text-button text-edit' onClick={e => {
                                        setIsEditable(true)
                                    }}>Edit</button>
                                    <button className='text-button text-remove' onClick={e => {
                                        setIsEditable(false)
                                        setChildrenOpen(false)
                                    }}>Remove</button> */}
                                    <Button
                                        className='text-button text-edit'
                                        onClick={e => {
                                            setIsEditable(true)
                                            setTmpValuePIBody(valuePIBody)
                                        }}
                                        label='Edit'
                                    />
                                    <Button
                                        className='text-button text-remove'
                                        onClick={e => {
                                            setIsEditable(false)
                                            setChildrenOpen(false)
                                        }}
                                        label='Remove'
                                    />
                                </span>
                                <span className='text-editor-text' >
                                    {body.trim()}
                                </span>
                            </>
                        }
                    </span>
                    <br /> {prefix}
                </> :
                <span className='pi-body' onClick={e => {
                    setChildrenOpen(true)
                }}>
                    {escapePIBody(body)}
                </span>
            }
            {" "}?&gt;
        </div>
    )
}
export const Attributes = (props: {
    path: number[],
    attributes: AttributesType,
    opts: SNACOpts
}): JSX.Element | null => {
    return Object.keys(props.attributes).length > 0 ?
        <div>
            {Object.keys(props.attributes).map((a, i) => {
                return (
                    <span key={i}>
                        {i > 0 ? <br /> : null}
                        <Attribute path={props.path} name={a} value={props.attributes[a]} opts={props.opts} />
                    </span>
                )
            })}
        </div> :
        null
}

export const Attribute = (props: {
    path: number[],
    name: string,
    value: string,
    opts: SNACOpts
}): JSX.Element =>
    <span className='attribute'>
        <Prefix path={props.path} opts={props.opts} />
        {props.opts.prefix_attributePrefix}
        <NsName name={props.name} type='attribute' />
        =&quot;
        <span className='attribute-value'>{props.value}</span>
        &quot;
    </span>

export const Prefix = (props: {
    path: number[],
    opts: SNACOpts
}): JSX.Element | null => {
    if (props.opts.prefix_showPrefix) {
        return (<span className="prefix">{getPrefixString(props.path, props.opts)}</span>)
    }
    else {
        return null
    }
}

const getPrefixString = (path: number[], opts: SNACOpts): string => {
    const init = ""
    return path.reduce((out, p) => out + opts.prefix_charOn, init)
}

const NsName = (props: { name: string, type: string }): JSX.Element => {
    const tagName = props.name.split(/:/)
    return tagName.length > 1 ?
        <>
            <span className={`${props.type}-ns`}>{tagName[0]}</span>
            :
            <span className={`${props.type}-name`}>{tagName[1]}</span>
        </>
        :
        <span className={`${props.type}-name`}>{tagName[0]}</span>
}

const ShowHideSwitch = (props:
    {
        root: SNACItem[],
        path: number[],
        chars: OnOffHiddenChars,
        selected: SwitchStates,
        className: string
        openClose: Function
    }): JSX.Element => {
    let out = props.chars.hidden
    switch (props.selected) {
        case SwitchStates.OFF:
            out = props.chars.on
            break;
        case SwitchStates.ON:
            out = props.chars.off
    }
    return (
        <span className={props.className} onClick={e => {
            props.selected !== SwitchStates.HIDDEN && props.openClose()
        }}>{out}</span>
    )
}

