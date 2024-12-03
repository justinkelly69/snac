import { snacOpts } from '../snac/opts'

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
    return path.reduce((out) => out + snacOpts.prefix_charOn, init)
}
