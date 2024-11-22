import { OnOffHiddenChars, SNACItem, SNACOpts, SwitchStates } from "../snac/types"

export const Prefix = (props: {
    path: number[],
    opts: SNACOpts
}): JSX.Element | null => {
    if (props.opts.prefix_showPrefix) {
        return (
            <span className="prefix">
                {getPrefixString(props.path, props.opts)}
            </span>)
    }
    else {
        return null
    }
}

const getPrefixString = (path: number[], opts: SNACOpts): string => {
    const init = ""
    return path.reduce((out, p) => out + opts.prefix_charOn, init)
}

export const ShowHideSwitch = (props: {
    root: SNACItem[],
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
        <span className={props.className} onClick={e => {
            props.selected !== SwitchStates.HIDDEN && props.openClose()
        }}>{out}</span>
    )
}