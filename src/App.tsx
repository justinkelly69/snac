import React from 'react';
import "./App.css";

import xmlInput from './lib/data/xml/waffle'
import xml2snac from './lib/snac/xml2snac'
import { XMLDisplay } from './lib/tsx/xmldisplay';

function App() {
    const snac = xml2snac(xmlInput)[0]

    console.log(JSON.stringify(snac, null, 4))

    return (
        <XMLDisplay snac={[snac]} />
    )
}

export default App;
