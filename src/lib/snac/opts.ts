import { XMLOpts, SNACOpts } from "../snac/types"


export const xmlOpts: XMLOpts = {
    prefix_showPrefix: true,
    prefix_newLine: "\n",
    prefix_char: " ",
    prefix_spaceBefore: " ",
    prefix_spaceAfter: " ",
    prefix_attributePrefix: "    ",

    xml_selfCloseTags: true,
    xml_trimText: true,
    xml_allowComments: true,
    xml_allowPIs: true,
}

export const snacOpts: SNACOpts = {
    prefix_showPrefix: true,
    prefix_newLine: "\n",
    prefix_startChar: ">",
    prefix_charOn: " ",
    prefix_charOff: " ",
    prefix_spaceBefore: " ",
    prefix_spaceAfter: " ",
    prefix_attributePrefix: "    ",

    switch_selectOn: "+",
    switch_selectOff: "-",
    switch_selectHide: "#",
    switch_attributesOpen: "+",
    switch_attributesClose: "-",
    switch_attributesHide: "#",
    switch_elementOpen: "+",
    switch_elementClose: "-",
    switch_elementHide: "#",
    switch_selectChars: {
        on: "+",
        off: "-",
        hidden: " ",
    },
    switch_attributeChars: {
        on: "+",
        off: "-",
        hidden: " ",
    },
    switch_elementChars: {
        on: "+",
        off: "-",
        hidden: " ",
    },

    xml_showSelected: true,
    xml_showAttributesOpen: true,
    xml_showChildrenOpen: true,
    xml_selfCloseTags: true,
    xml_trimText: true,
    xml_trimTextLength: 50,
    xml_trimCDATA: true,
    xml_trimCDATALength: 20,
    xml_trimComment: true,
    xml_trimCommentLength: 20,
    xml_trimPIBody: true,
    xml_trimPIBodyLength: 10,
    xml_showCloseTags: false,
    xml_allowComments: true,
    xml_allowPIs: true,
    xml_ellipsis: '...',

    styles_attributeGridRowWidth: ' .6fr',
    styles_attributeGridButtonWidth: '6em',

    pi_languages: [['php', 'php'],['php=', 'php=']],
}
