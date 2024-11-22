import {
    SNAC2XMLJSXFuncs, SNACItem, SNACElement, SNACText,
    SNACCDATA, SNACComment, SNACPINode, SNACOpts,
} from '../snac/types'

import {
    escapeHtml
} from '../snac/textutils'

const XMLOut = (
    root: SNACItem[],
    snac: SNACItem[],
    funcs: SNAC2XMLJSXFuncs,
    opts: SNACOpts
) => {
    return Children({
        root: root,
        snac: snac,
        path: [],
        funcs: funcs,
        opts: opts,
    })
}

const Children = (props: {
    root: SNACItem[],
    snac: SNACItem[],
    path: number[],
    funcs: SNAC2XMLJSXFuncs,
    opts: SNACOpts
}) => {
    const { Tag, Text, CDATA, Comment, PI } = props.funcs
    let out: JSX.Element[] = []

    for (let i in Object.keys(props.snac)) {
        const newPath = [...props.path, parseInt(i)]

        if (props.snac[i].hasOwnProperty("N")) {
            const snacElementNode: SNACElement = props.snac[i] as SNACElement;

            out = [...out, (
                <Tag
                    key={i}
                    root={props.root}
                    node={snacElementNode}
                    path={newPath}
                    opts={props.opts}
                    getChildren={() => Children({
                        ...props,
                        path: newPath,
                        snac: snacElementNode.C,
                    })}
                    funcs={props.funcs}
                />
            )]
        }

        else if (props.snac[i].hasOwnProperty("T")) {
            const snacTextNode: SNACText = props.snac[i] as SNACText
            let text = escapeHtml(snacTextNode["T"])
            if (props.opts.xml_trimText) {
                text = text.trim()
            }
            out = [...out, (
                <Text
                    key={i}
                    root={props.root}
                    node={snacTextNode}
                    path={newPath}
                    showSelected={true}
                    showOpen={true}
                    opts={props.opts}
                />
            )]
        }

        else if (props.snac[i].hasOwnProperty("D")) {
            const snacCDATANode: SNACCDATA = props.snac[i] as SNACCDATA
            out = [...out, (
                <CDATA
                    key={i}
                    root={props.root}
                    node={snacCDATANode}
                    path={newPath}
                    showSelected={true}
                    showOpen={true}
                    opts={props.opts}
                />
            )]
        }

        else if (props.snac[i].hasOwnProperty("M")) {
            if (props.opts.xml_allowComments) {
                const snacCommentNode: SNACComment = props.snac[i] as SNACComment
                out = [...out, (
                    <Comment
                        key={i}
                        root={props.root}
                        node={snacCommentNode}
                        path={newPath}
                        showSelected={true}
                        showOpen={true}
                        opts={props.opts}
                    />
                )]
            }
        }

        else if (props.snac[i].hasOwnProperty("L")) {
            if (props.opts.xml_allowPIs) {
                const snacPINode: SNACPINode = props.snac[i] as SNACPINode
                out = [...out, (
                    <PI
                        key={i}
                        root={props.root}
                        node={snacPINode}
                        path={newPath}
                        showSelected={true}
                        showOpen={true}
                        opts={props.opts}
                    />
                )]
            }
        }
    }

    return out
}

export default XMLOut
