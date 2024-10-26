import React, { Fragment, useState } from 'react'

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
        <Fragment>
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
        </Fragment>
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
    const [isEditable, setIsEditable] = useState(false)

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

    let text = props.node.T
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
                {props.showOpen ?
                    <ShowHideSwitch
                        root={props.root}
                        path={props.path}
                        selected={openState}
                        chars={props.opts.switch_elementChars}
                        className='element-show-hide'
                        openClose={e => setChildrenOpen(!isChildrenOpen)}
                    /> :
                    null
                }
            </span>
            {openState === SwitchStates.ON ?
                <>
                    <span className='text-editor'>

                        {isEditable ?
                            <>
                                <span className='text-editor-controls'>
                                    <button className='text-button text-save' onClick={e => {
                                        setIsEditable(false)
                                        setChildrenOpen(false)
                                    }}>Save</button>
                                    <button className='text-button text-cancel' onClick={e => {
                                        setIsEditable(false)
                                        setChildrenOpen(false)
                                    }}>Cancel</button>
                                </span>
                                <textarea className='text-editor-text'>
                                    {text}
                                </textarea>
                            </> :
                            <>
                                <span className='text-editor-controls'>
                                    <button className='text-button text-edit' onClick={e => {
                                        setIsEditable(true)
                                    }}>Edit</button>
                                </span>
                                <span className='text-editor-text'>
                                    {text.trim()}
                                </span>
                            </>
                        }

                    </span>
                    <br />
                </> :
                <span className='text-body'>{text}</span>
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

    const [isSelected, setSelected] = useState(props.node.q)
    const [isChildrenOpen, setChildrenOpen] = useState(props.node.o)

    let selectState = SwitchStates.HIDDEN
    let openState = SwitchStates.HIDDEN
    let selectedClassName = 'cdata'

    if (props.showSelected) {
        selectState = isSelected ? SwitchStates.ON : SwitchStates.OFF
        selectedClassName = isSelected ? 'cdata selected' : 'cdata'
    }

    if (props.showOpen) {
        openState = isChildrenOpen ? SwitchStates.ON : SwitchStates.OFF
    }

    let cdata = props.node.D
    if (!isChildrenOpen) {
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
            {props.showOpen ?
                <ShowHideSwitch
                    root={props.root}
                    path={props.path}
                    selected={openState}
                    chars={props.opts.switch_elementChars}
                    className='element-show-hide'
                    openClose={e => setChildrenOpen(!isChildrenOpen)}
                /> :
                null
            }
            &lt;![CDATA[

            {openState === SwitchStates.ON ?
                <>
                    <br /> {prefix}
                    <span className='cdata-body'>{escapeCDATA(cdata)}</span>
                    <br /> {prefix}
                </> :
                <span className='cdata-body'>{escapeCDATA(cdata)}</span>
            }
            ]]&gt;
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

    const [isSelected, setSelected] = useState(props.node.q)
    const [isChildrenOpen, setChildrenOpen] = useState(props.node.o)

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

    let comment = props.node.M
    if (!isChildrenOpen) {
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
            {props.showOpen ?
                <ShowHideSwitch
                    root={props.root}
                    path={props.path}
                    selected={openState}
                    chars={props.opts.switch_elementChars}
                    className='element-show-hide'
                    openClose={e => setChildrenOpen(!isChildrenOpen)}
                /> :
                null
            }
            &lt;!--
            {openState === SwitchStates.ON ?
                <>
                    <br /> {prefix}
                    <span className='comment-body'>{escapeComment(comment)}</span>
                    <br /> {prefix}
                </> :
                <span className='comment-body'>{escapeComment(comment)}</span>
            }
            --&gt;
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
    const [isSelected, setSelected] = useState(props.node.q)
    const [isChildrenOpen, setChildrenOpen] = useState(props.node.o)

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

    let body = props.node.B
    if (!isChildrenOpen) {
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
            <Prefix path={props.path} opts={props.opts} />
            {props.showOpen ?
                <ShowHideSwitch
                    root={props.root}
                    path={props.path}
                    selected={openState}
                    chars={props.opts.switch_elementChars}
                    className='element-show-hide'
                    openClose={e => setChildrenOpen(!isChildrenOpen)}
                /> :
                null
            }
            &lt;?
            <span className='pi-lang'>{props.node.L}</span>
            {" "}

            {openState === SwitchStates.ON ?
                <>
                    <br /> {prefix}
                    <span className='pi-body'>{escapePIBody(body)}</span>
                    <br /> {prefix}
                </> :
                <span className='pi-body'>{escapePIBody(body)}</span>
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

