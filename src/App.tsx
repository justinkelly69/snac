import React from 'react';
import "./App.css";

import xmlInput from './lib/data/xml/waffle'
import xml2snac from './lib/snac/xml2snac'
import xmlOut from './lib/tsx/snac2xml';
import { Tag, CloseTag, OpenTag } from './lib/tsx/element';
import { Attributes } from './lib/tsx/attributes';
import { Text } from './lib/tsx/text';
import { CDATA } from './lib/tsx/cdata';
import { Comment } from './lib/tsx/comment';
import { PI } from './lib/tsx/pi';
import { Prefix } from './lib/tsx/prefix';
import { snacOpts } from './lib/snac/opts'


function App() {
    const snac = xml2snac(xmlInput)[0]
    const xml = xmlOut(
        [snac],
        [snac],
        {
            Tag,
            OpenTag,
            CloseTag,
            Text,
            CDATA,
            Comment,
            PI,
            Attributes,
            Prefix
        },
        snacOpts
    )

    //console.log(JSON.stringify(snac, null, 4))

    return (
        <>
            <h2>XMLOUT</h2>
            <pre>{xml}</pre>
        </>
    )
}

export default App;
