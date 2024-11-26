import {
    OnOffHiddenChars,
    SNACItem,
    SwitchStates
} from "../snac/types"

import {
    snacOpts
} from '../snac/opts'

export const Prefix = (props: {
    path: number[],
}): JSX.Element | null => {

    if (snacOpts.prefix_showPrefix) {
        return (
            <span className="prefix">
                {getPrefixString(props.path)}
            </span>)
    }
    else {
        return null
    }
}

const getPrefixString = (path: number[]): string => {
    const init = ""
    return path.reduce((out, p) => out + snacOpts.prefix_charOn, init)
}

export const ShowHideSwitch = (props: {
    path: number[],
    chars: OnOffHiddenChars,
    selected: SwitchStates,
    visible: boolean,
    className: string
    openClose: Function
}): JSX.Element => {

    let out = props.chars.hidden

    if (props.visible) {
        switch (props.selected) {
            case SwitchStates.OFF:
                out = props.chars.on
                break;
            case SwitchStates.ON:
                out = props.chars.off
        }
    }
    return (
        <span
            className={props.className}
            onClick={e => {
                props.selected !== SwitchStates.HIDDEN && props.openClose()
            }}
        >
            {out}
        </span>
    )
}