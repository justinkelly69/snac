import { repeatString } from "./helpers"

export const attributesGridStyle = (
    props: {
        keys: any,
        pathWidth: number,
        buttonWidth: number,
        cellWidth: number,
        height: number
    }
) => {
    return {
        gridTemplateColumns:
            `${props.pathWidth}em 
            min-content 
            min-content 
            min-content 
            min-content 
            ${props.buttonWidth}em 
            ${props.buttonWidth}em`,
        gridAutoRows: repeatString(0, props.keys.length, ` .${props.cellWidth}fr`),
        height: `${props.height}em`,
    }
}

export const CDATAGridStyle = (
    props: {
        pathWidth: number,
        xButtonWidth: number,
        buttonWidth: number,
    }) => {
    return {
        gridTemplateColumns: `
            ${props.pathWidth}em
            ${props.xButtonWidth}em 
            ${props.buttonWidth}em 
            ${props.buttonWidth}em
            min-content
            `,
    }
}

export const commentsGridStyle = (
    props: {
        pathWidth: number,
        xButtonWidth: number,
        buttonWidth: number,
    }) => {
    return {
        gridTemplateColumns: `
            ${props.pathWidth}em
            ${props.xButtonWidth}em 
            ${props.buttonWidth}em 
            ${props.buttonWidth}em
            min-content
            `,
    }
}

export const PIGridStyle = (
    props: {
        pathWidth: number,
        xButtonWidth: number,
        buttonWidth: number,
    }) => {
        return {
            gridTemplateColumns: `
            ${props.pathWidth}em
            ${props.xButtonWidth}em 
            ${props.buttonWidth}em 
            ${props.buttonWidth}em
            min-content
            `,
        }
}

export const EditBoxGridStyle = (
    props: {
        pathWidth: number,
    }) => {
        return {
            gridTemplateColumns: `
            ${props.pathWidth}em
            min-content
            `,
        }
}