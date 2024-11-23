import React from 'react';
import "./App.css";

import xmlInput from './lib/data/xml/waffle'
import xml2snac from './lib/snac/xml2snac'
import XMLOut from './lib/tsx/xmlout';

function App() {
    const snac = xml2snac(xmlInput)[0]

    console.log(JSON.stringify(snac, null, 4))

    return (
        <pre>
            <XMLOut
                root={[snac]}
                snac={[snac]}
            />
        </pre>
    )
}

export default App;
