import xmlInput from './lib/data/xml/waffle'
import xml2snac from './lib/snac/xml2snac'
import { XMLDisplay } from './lib/tsx/xmldisplay';
import { clone } from './lib/snac/snac';

function App() {
    const snac = xml2snac(xmlInput).root

    console.log('clone', JSON.stringify(clone(snac, []), null, 4))

    return (
        <XMLDisplay snac={snac} />
    )
}

export default App;
