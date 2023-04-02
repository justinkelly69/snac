"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const snac2xml_1 = require("./lib/snac2xml");
const xml2snac_1 = require("./lib/xml2snac");
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
</dog:menu>`;
const snac = (0, xml2snac_1.xml2snac)(xml);
console.log(JSON.stringify(snac, null, 4));
const xml2 = (0, snac2xml_1.snac2xml)(snac, {
    prefixStart: "",
    prefixCharacter: "\t",
    attributePrefix: "  ",
    minify: false,
    usePrefix: true,
    selfCloseTags: true,
    trimText: true,
});
console.log(xml2);
