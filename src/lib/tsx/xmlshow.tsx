import { ReactNode } from "react"
import { EditBoxGridStyle } from "../snac/styles"

export const XmlShow = (props: {
    path: number[],
    className: string,
    children: ReactNode,
}) => {

    return (
        <>
            {props.children ?
                <div className={`show-body-code ${props.className}`}
                    style={EditBoxGridStyle({
                        pathWidth: props.path.length
                    })}
                >
                    <span className='show-body-code-prefix'></span>
                    <span className='show-body-code-text'>
                        {props.children}
                    </span>
                </div> :
                null}
        </>
    )

}