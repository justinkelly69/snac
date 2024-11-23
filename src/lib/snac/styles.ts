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