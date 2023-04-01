import { _xml2snac, addAttribute, getAttributeValue, getAttributes } from '../src/lib/xml2snac'
import { QuoteChar, AttributesType, AttributeXMLType, AttributeValueType } from "../src/lib/types";

describe("test getAttributeValue function", () => {
    it(`should return '{
        value: "name=", 
        xml: "value\" type='test'><html>",
    }'
    for getAttributeValue('name=\"value\" type='test'><html>, QuoteChar['"'])"` , () => {
        expect(getAttributeValue("name=\"value\" type='test'><html>", '"')).toStrictEqual({
            value: "name=",
            xml: "value\" type='test'><html>",
        })
    })
    it(`should return '{
        value: "name=\"value\" type=", 
        xml: "test'><html>",
    }'
    for getAttributeValue('name=\"value\" type='test'><html>, QuoteChar["'"])"` , () => {
        expect(getAttributeValue("name=\"value\" type='test'><html>", "'")).toStrictEqual({
            value: "name=\"value\" type=",
            xml: "test'><html>",
        })
    })
    it(`should throw an error for getAttributeValue('name=value type=test><html>, QuoteChar["'"])"`, () => {
        expect(() => {
            getAttributeValue("name=value type=test><html>", "'")
        })
            .toThrowError("Bad xml name=value type=test><html>")
    })
})

describe("test addAttribute function", () => {
    it(`should return {
        attributes: {
            '@': {
                name: "value"
            }
        },
        xml: " type='test'><html>"
    } for addAttribute({}, "name", '"', "value\" type='test'><html>")`, () => {
        expect(addAttribute({}, "name", '"', "value\" type='test'><html>")).toStrictEqual({
            attributes: {
                '@': {
                    name: "value"
                }
            },
            xml: " type='test'><html>"
        })
    })

    it(`should return {
        attributes: {
            '@': {
                name: "value",
                type: "test"
            }
        },
        xml: "><html>"
    } for addAttribute({'@': {name: "value"}}, "type", "'", "test'><html>")`, () => {
        expect(addAttribute({ '@': { name: "value" } }, "type", "'", "test'><html>")).toStrictEqual({
            attributes: {
                '@': {
                    name: "value",
                    type: "test"
                }
            },
            xml: "><html>"
        })
    })

    it(`should return {
        attributes: {
            '@': {
                name: "value",
                type: "test"
            },
            co: {
                school: "Harvard University"
            }
        },
        xml: "><html>"
    } for addAttribute({'@': {name: "value", type: "test"}}, "co:school", "'", "Harvard University'><html>")`, () => {
        expect(addAttribute({ '@': { name: "value", type: "test" } }, "co:school", "'", "Harvard University'><html>"))
            .toStrictEqual({
                attributes: {
                    '@': {
                        name: "value",
                        type: "test"
                    },
                    co: {
                        school: "Harvard University"
                    }
                },
                xml: "><html>"
            })
    })
})

describe("test getAttributes function", () => {
    it(`should return {
            xml: "",
            hasChildren: true,
            attributes: {}
    } for getAttributes('>')`, () => {
        expect(getAttributes(">")).toStrictEqual({
            xml: "",
            hasChildren: true,
            attributes: {}
        })
    })

    it(`should return {
        xml: "",
        hasChildren: false,
        attributes: {}
    } for getAttributes('/>')`, () => {
        expect(getAttributes("/>")).toStrictEqual({
            xml: "",
            hasChildren: false,
            attributes: {}
        })
    })

    it(`should return {
        xml: "",
        hasChildren: true,
        attributes: {
            '@': {
                name: "value",
                type: "test"
            }
        }
    } for getAttributes("name=\"value\" type=\"test\">")`, () => {
        expect(getAttributes("name=\"value\" type=\"test\">")).toStrictEqual({
            xml: "",
            hasChildren: true,
            attributes: {
                '@': {
                    name: "value",
                    type: "test"
                }
            },
        })
    })

    it(`should return {
        xml: "",
        hasChildren: false,
        attributes: {
            no: {
                name: "value",
            }
            ty: {
                type: "test"
            }
        }
    } for getAttributes("no:name=\"value\" ty:type=\"test\"/>")`, () => {
        expect(getAttributes("no:name=\"value\" ty:type=\"test\"/>")).toStrictEqual({
            xml: "",
            hasChildren: false,
            attributes: {
                no: {
                    name: "value",
                },
                ty: {
                    type: "test"
                }
            }
        })
    })

    it(`should return {
        xml: "hello world<p class=\"big\">goodbye</p>",
        hasChildren: false,
        attributes: {
            '@': {
                id: "big",
                class: "small"
            },
            no: {
                name: "value",
            },
            ty: {
                type: "test"
            }
        }
    } for getAttributes("id='big' class=\"small\" no:name=\"value\" ty:type=\"test\"/>hello world<p class=\"big\">goodbye</p>")`, () => {
        expect(getAttributes("id='big' class=\"small\" no:name=\"value\" ty:type=\"test\"/>hello world<p class=\"big\">goodbye</p>")).toStrictEqual({
            xml: "hello world<p class=\"big\">goodbye</p>",
            hasChildren: false,
            attributes: {
                '@': {
                    id: "big",
                    class: "small"
                },
                no: {
                    name: "value",
                },
                ty: {
                    type: "test"
                }
            }
        })
    })

    describe("test _xml2snac function", () => {
        it(`should return {
                xml: "",
                out: [
                    {
                        S:"@",
                        N:"business",
                        A:{
                            "@":{
                                name: "value"
                            }
                        },
                        C:[
                            {
                                T: "Justin Kelly Solutions Inc.",
                                a: true,
                                o: true,
                                q: false
                            }
                        ],
                        a: true,
                        o: true,
                        q: false
                    }
                ]
        } for _xml2snac("<business name=\"value\">Justin Kelly Solutions Inc.</business>")`, () => {
            expect(_xml2snac("<business name=\"value\">Justin Kelly Solutions Inc.</business>", [])).toStrictEqual({
                xml: "",
                out: [
                    {
                        S: "@",
                        N: "business",
                        A: {
                            "@": {
                                name: "value"
                            }
                        },
                        C: [
                            {
                                T: "Justin Kelly Solutions Inc.",
                                a: true,
                                o: true,
                                q: false
                            }
                        ],
                        a: true,
                        o: true,
                        q: false
                    }
                ]
            })
        })
        it(`should return {
            xml: "",
                    out: [
                        {
                            S: "@",
                            N: "business",
                            A: {
                                "@": {
                                    name: "value"
                                }
                            },
                            C: [
                                {
                                    T: "Justin Kelly ",
                                    a: true,
                                    o: true,
                                    q: false
                                },
                                {
                                    S: "@",
                                    N: "b",
                                    A: {},
                                    C: [
                                        {
                                            T: "Solutions",
                                            a: true,
                                            o: true,
                                            q: false
                                        }
                                    ],
                                    a: true,
                                    o: true,
                                    q: false
                                },
                                {
                                    T: " Inc.",
                                    a: true,
                                    o: true,
                                    q: false
                                },
                                {
                                    S: "@",
                                    N: "br",
                                    A: {},
                                    C: [],
                                    a: true,
                                    o: true,
                                    q: false
                                },
                                {
                                    T: "He's amazing",
                                    a: true,
                                    o: true,
                                    q: false
                                },
                            ],
                            a: true,
                            o: true,
                            q: false
                        }
                    ]
                }
            } 
            for _xml2snac("<business name="value">Justin Kelly <b>Solutions</b> Inc.<br/>He's amazing</business>")`, () => {
            expect(_xml2snac(
                `<business name="value">Justin Kelly <b>Solutions</b> Inc.<br/>He's amazing</business>`, [])).toStrictEqual({
                    xml: "",
                    out: [
                        {
                            S: "@",
                            N: "business",
                            A: {
                                "@": {
                                    name: "value"
                                }
                            },
                            C: [
                                {
                                    T: "Justin Kelly ",
                                    a: true,
                                    o: true,
                                    q: false
                                },
                                {
                                    S: "@",
                                    N: "b",
                                    A: {},
                                    C: [
                                        {
                                            T: "Solutions",
                                            a: true,
                                            o: true,
                                            q: false
                                        }
                                    ],
                                    a: true,
                                    o: true,
                                    q: false
                                },
                                {
                                    T: " Inc.",
                                    a: true,
                                    o: true,
                                    q: false
                                },
                                {
                                    S: "@",
                                    N: "br",
                                    A: {},
                                    C: [],
                                    a: true,
                                    o: true,
                                    q: false
                                },
                                {
                                    T: "He's amazing",
                                    a: true,
                                    o: true,
                                    q: false
                                },
                            ],
                            a: true,
                            o: true,
                            q: false
                        }
                    ]
                })
        })
    })
})