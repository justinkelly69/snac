import React, { useState } from 'react'
import { EditBoxGridStyle } from '../snac/styles'

export const Button = props =>
    <button
        className={props.className}
        onClick={props.onClick}
    >
        {props.label}
    </button>

export const TextInput = props =>
    <input
        id={props.id}
        name={props.name}
        className={props.className}
        type='text'
        value={props.value}
        size={props.size}
        maxLength={props.maxLength}
        placeholder={props.placeholder}
        onClick={props.onClick}
        onChange={props.onChange}
    />

export const TextArea = props =>
    <textarea
        ref={props.ref}
        readOnly={props.readOnly}
        className={props.className}
        value={props.value}
        onChange={props.onChange}
        onSelect={props.onSelect}
    />

export const DropDownList = props => {    
    return (
        <select
            ref={props.ref}
            className={props.className}
            value={props.value}
            onChange={props.onChange}
        >
            {props.opts.map((opt: string[]) =>
                <option value={opt[0]}>{opt[1]}</option>
            )}
        </select>
    )
}

export const TextEditTextBox = (props: {
    path: number[],
    widthMultiplier: number,
    editButtonBar: Function,
    editTextArea: Function,
}) => {
    return (
        <div className='text-edit-box'
        style={
            EditBoxGridStyle({
                pathWidth: props.path.length * props.widthMultiplier,
            })
        }>
            <span className='edit-prefix'></span>
            <span className='edit-button-bar'>
                {props.editButtonBar()}
            </span>
            <span className='edit-text-area'>
                {props.editTextArea()}
            </span>
        </div>
    )
}

export const EditTextBox = (props: {
    path: number[],
    widthMultiplier: number,
    editTopBar: Function,
    editButtonBar: Function,
    editTextArea: Function,
    editBottomBar: Function,
}) => {
    return (
        <div className='edit-box'
        style={
            EditBoxGridStyle({
                pathWidth: props.path.length * props.widthMultiplier,
            })
        }>
            <span className='edit-prefix'></span>
            <span className='edit-top-bar'>
                {props.editTopBar()}
            </span>
            <span className='edit-button-bar'>
                {props.editButtonBar()}
            </span>
            <span className='edit-text-area'>
                {props.editTextArea()}
            </span>
            <span className='edit-bottom-bar'>
                {props.editBottomBar()}
            </span>
        </div>
    )
}


