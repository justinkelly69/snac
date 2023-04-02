import { snac2xml } from "./lib/snac2xml"
import { xml2snac } from './lib/xml2snac';

const xml = `<?xml version="1.0"?>
<dog:menu food="bone" diet="veggie:museli">
woof woof
<para>T'was on a <b>dark</b> and <i>stormie</i> night as I set sail</para>
<![CDATA[<html><head 
    name="value">&&&]]>
to nowhere
<!-- this is
 a comment -->
and here is a bomb
<?php 
$name = "fred";
echo "$name\n";
?>
really
</dog:menu>`

const snac = xml2snac(xml)
console.log(JSON.stringify(snac, null, 4))

const xml2 = snac2xml(snac, {
    prefixStart: "",
    prefixCharacter: "\t",
    attributePrefix: "  ",
    minify: false,
    usePrefix: true,
    selfCloseTags: true,
    trimText: true,
})

console.log(xml2)