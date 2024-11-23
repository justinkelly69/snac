import React, { useState } from 'react'

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
            onSelect={f=>f}
        >
            {props.opts.map((opt: string, index: number) =>
                <option value={index}>{opt}</option>
            )}
        </select>
    )
}


