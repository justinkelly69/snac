import {
    SNAC2XMLJSXFuncs, SNACItem, SNACElement, SNACText,
    SNACCDATA, SNACComment, SNACPINode, SNACOpts,
} from '../snac/types'

import {
    escapeHtml
} from '../snac/textutils'

const snac2xml = (root: SNACItem[], snac: SNACItem[], funcs: SNAC2XMLJSXFuncs, opts: SNACOpts) => {
    return getChildren(root, snac, [], funcs, opts)
}

const getChildren = (root: SNACItem[], snac: SNACItem[], path: number[], funcs: SNAC2XMLJSXFuncs, opts: SNACOpts) => {
    const { Tag, Text, CDATA, Comment, PI } = funcs
    let out: JSX.Element[] = []

    for (let i in Object.keys(snac)) {
        const newPath = [...path, parseInt(i)]

        if (snac[i].hasOwnProperty("N")) {
            const snacElementNode: SNACElement = snac[i] as SNACElement;

            out = [...out, (
                <Tag
                    key={i}
                    root={root}
                    node={snacElementNode}
                    path={newPath}
                    opts={opts}
                    getChildren={getChildren}
                    funcs={funcs}
                />
            )]
        }

        else if (snac[i].hasOwnProperty("T")) {
            const snacTextNode: SNACText = snac[i] as SNACText
            let text = escapeHtml(snacTextNode["T"])
            if (opts.xml_trimText) {
                text = text.trim()
            }
            out = [...out, (
                <Text
                    key={i}
                    root={root}
                    node={snacTextNode}
                    path={newPath}
                    showSelected={true}
                    showOpen={true}
                    opts={opts}
                />
            )]
        }

        else if (snac[i].hasOwnProperty("D")) {
            const snacCDATANode: SNACCDATA = snac[i] as SNACCDATA
            out = [...out, (
                <CDATA
                    key={i}
                    root={root}
                    node={snacCDATANode}
                    path={newPath}
                    showSelected={true}
                    showOpen={true}
                    opts={opts}
                />
            )]
        }

        else if (snac[i].hasOwnProperty("M")) {
            if (opts.xml_allowComments) {
                const snacCommentNode: SNACComment = snac[i] as SNACComment
                out = [...out, (
                    <Comment
                        key={i}
                        root={root}
                        node={snacCommentNode}
                        path={newPath}
                        showSelected={true}
                        showOpen={true}
                        opts={opts}
                    />
                )]
            }
        }

        else if (snac[i].hasOwnProperty("L")) {
            if (opts.xml_allowPIs) {
                const snacPINode: SNACPINode = snac[i] as SNACPINode
                out = [...out, (
                    <PI
                        key={i}
                        root={root}
                        node={snacPINode}
                        path={newPath}
                        showSelected={true}
                        showOpen={true}
                        opts={opts}
                    />
                )]
            }
        }
    }

    return out
}

export default snac2xml
