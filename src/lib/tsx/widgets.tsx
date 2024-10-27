import React, { useState, useRef } from 'react'

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