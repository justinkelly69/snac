import React from 'react';
import "./App.css";

import xmlInput from './lib/data/xml/waffle'
import xml2snac from './lib/snac/xml2snac'
//import snac2xml from './lib/snac/snac2xml';
import xmlOut from './lib/tsx/snac2xml';
import { Tag, Attribute, Attributes, CloseTag, Text, OpenTag} from './lib/tsx/outFuncs';
import { CDATA } from './lib/tsx/cdata';
import { Comment } from './lib/tsx/comment';
import { PI } from './lib/tsx/pi';
import { Prefix } from './lib/tsx/prefix';
import {snacOpts} from './lib/snac/opts'


function App() {

    const funcs = { Tag, OpenTag, CloseTag, Text, CDATA, Comment, PI, Attributes, Attribute, Prefix }
    const snac = xml2snac(xmlInput)[0]

    //const xml2 = snac2xml([snac], xmlOpts)
    const xml3 = xmlOut([snac], [snac], funcs, snacOpts)

    return (
        <>
            {/* <h2>XML INPUT</h2>
            <pre>{xmlInput}</pre>
            <hr />
            <h2>SNAC</h2>
            <pre>{JSON.stringify(snac, null, 4)}</pre>
            <hr />
            <h2>SNAC 2 XML</h2>
            <pre>{xml2}</pre>
            <hr /> */}
            <h2>XMLOUT</h2>
            <pre>{xml3}</pre>
        </>
    )
}

export default App;
