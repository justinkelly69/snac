const xml = `
<fo:breakfast_menu 
xmlns="http://br.com" 
xmlns:fo="http://fo.com" 
xmlns:co="http://co.com" 
xmlns:html="http://html.com"
chef="ooohlala">
the food starts here
    <empty />
    <fo:food co:nationality="BE" id="x999" class="noclass">
        <name>Belgian Waffles</name>
        <![CDATA[ Hello from CDATA ]]>
before
        <html:p>
Chapter One - Down the Rabbit Hole: Alice, a seven-year-old girl, is feeling bored and drowsy while sitting on the riverbank with her elder sister. She notices a talking, clothed white rabbit 
with a pocket <b>watch run past. She follows it down a rabbit hole where she suddenly falls a long way to a curious hall with many <i>locked doors</i> of all sizes. She finds a little key to a 
door too small  for her to <u>fit through, but through it, she 
sees an <r>attractive garden now</r> She then discovers</u> 
a bottle on a table labelled "DRINK ME," the contents 
of which</b> cause her to shrink too small to 
reach the key which she had left on the table. 
She subsequently eats a cake labelled "EAT ME" 
in currants as the chapter closes.
        </html:p>
after
        <?php
        $name="James P. Sullivan XXXVIII";
        for($i = 0; $i < SIZE_OF_MEMORY; $i++){
            deleteMemory($i);
        } ?>
         <!-- This is comment numero one -->
        <price co:currency="USD" curse="Oh Noe!" fo:bs="Awesome">$5.95</price>
        <description xmlns:xy="http://boxxlox.com" class="longtext">
        <!-- THIS IS 
        A NICE 
        COMMENT !!!! -->
Two of our &lt;famous&gt; <xy:country>Belgian</xy:country> &quot;Waffles&quot; &amp; &apos;with&apos; plenty of real maple syrup
        </description>
        <![CDATA[This is 
                CDATA <html 
                name="&&&value'''">]]>
        <calories multiply="1000">650</calories>
    </fo:food>
that was all the food
</fo:breakfast_menu>
`

export default xml
