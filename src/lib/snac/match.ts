export const isOpenTag = (xml: string): RegExpMatchArray | null =>
    xml.match(/^<([\w]*:?[\w]+)(.*)$/s)

export const isCloseTag = (xml: string): RegExpMatchArray | null =>
    xml.match(/^<\/([\w]*:?[\w]+)>(.*)$/s)

export const isCDATATag = (xml: string): RegExpMatchArray | null =>
    xml.match(/^<!\[CDATA\[(.*?)\]\]>(.*)$/s)

export const isCommentTag = (xml: string): RegExpMatchArray | null =>
    xml.match(/^<!--(.*?)-->(.*)$/s)

export const isPITag = (xml: string): RegExpMatchArray | null =>
    xml.match(/^<\?(\w+=?)\s+(.*?)\?>(.*)$/s)

export const isText = (xml: string): RegExpMatchArray | null =>
    xml.match(/^([^<>]+)(.*)$/s)

export const isBlank = (xml: string): RegExpMatchArray | null =>
    xml.match(/^$/s)

export const lastAttribute = (xml: string): RegExpMatchArray | null =>
    xml.match(/^\s*(\/?>)(.*)$/s)

export const nextAttribute = (xml: string): RegExpMatchArray | null =>
    xml.match(/^\s*([\w]+:?[\w]+)=(['"])(.*)$/s)

export const hasChildren = (lastTag: string) => (lastTag === '>' ? true : false)
