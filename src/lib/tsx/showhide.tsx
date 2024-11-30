import { useContext } from "react";
import { OnOffHiddenChars, SwitchStates } from "../snac/types"
import { Button } from "./widgets"
import { XMLRWContext } from '../snac/contexts'

export const ShowHideSwitch = (props: {
    path: number[],
    chars: OnOffHiddenChars,
    selected: SwitchStates,
    openClose: Function
}): JSX.Element => {

    const xmlContext = useContext(XMLRWContext);
    
    let out = props.chars.hidden
    if (xmlContext.treeMode) {
        switch (props.selected) {
            case SwitchStates.OFF:
                out = props.chars.on
                break;
            case SwitchStates.ON:
                out = props.chars.off
        }
    }
    return (
        <>
            {xmlContext.treeMode && props.selected !== SwitchStates.HIDDEN ?
                <Button
                    className='show-hide-button'
                    onClick={() => {
                        props.openClose()
                    }}
                    label={out}
                /> :
                <span className="show-hide-button-hidden">{" "}</span>
            }
        </>
    )
}