import {
    escapeHtml,
    unEscapeHtml,
    escapeCDATA,
    unEscapeCDATA,
    escapeComment,
    unEscapeComment,
    testPILang,
    escapePIBody,
    unEscapePIBody
} from '../src/lib/text'

describe("test escapeHtml function", () => {
    it("should return '&lt;html&gt; &lt;body&gt; &lt;/body&gt; &lt;/html&gt;' for escapeHtml('<html> <body> </body> </html>')", () => {
        expect(escapeHtml("<html> <body> </body> </html>")).toBe("&lt;html&gt; &lt;body&gt; &lt;/body&gt; &lt;/html&gt;")
    })
    it("should return '&quot;&amp;&apos;' for escapeHtml('\"&'')", () => {
        expect(escapeHtml("\"&'")).toBe("&quot;&amp;&apos;")
    })
    it("should return '&lt;html name=&quot;value&quot; type=&apos;&amp;&amp;&apos; /&gt;'" +
    " for escapeHtml('<html name=\"value\" type='&&' />')", () => {
        expect(escapeHtml("<html name=\"value\" type='&&' />")).toBe(
            "&lt;html name=&quot;value&quot; type=&apos;&amp;&amp;&apos; /&gt;")
    })
})

describe("test unEscapeHtml function", () => {
    it("should return '<html>' for unEscapeHtml('&lt;html&gt;')", () => {
        expect(unEscapeHtml("&lt;html&gt;")).toBe("<html>")
    })
    it("should return '\"&'' for unEscapeHtml('&quot;&amp;&apos;')", () => {
        expect(unEscapeHtml("&quot;&amp;&apos;")).toBe("\"&'")
    })
    it("should return '<html name=\"value\" type='&&' />'" +
    " for unEscapeHtml('&lt;html name=&quot;value&quot; type=&apos;&amp;&amp;&apos; /&gt;')", () => {
        expect(unEscapeHtml("&lt;html name=&quot;value&quot; type=&apos;&amp;&amp;&apos; /&gt;")).toBe(
            "<html name=\"value\" type='&&' />")
    })
})

describe("test escapeCDATA function", () => {
    it("should return ']]&gt;' for escapeCDATA(']]>')", () => {
        expect(escapeCDATA("]]>")).toBe("]]&gt;")
    })
    it("should return '<html name=\"value\"]]&gt;<'&'' for escapeCDATA('<html name=\"value\"]]><'&'')", () => {
        expect(escapeCDATA("<html name=\"value\"]]><'&'")).toBe("<html name=\"value\"]]&gt;<'&'")
    })
})

describe("test unEscapeCDATA function", () => {
    it("should return ']]>' for unEscapeCDATA(']]&gt;')", () => {
        expect(unEscapeCDATA("]]&gt;")).toBe("]]>")
    })
    it("should return '<html name=\"value\"]]><'&'' for unEscapeCDATA('<html name=\"value\"]]&gt;<'&'')", () => {
        expect(unEscapeCDATA("<html name=\"value\"]]&gt;<'&'")).toBe("<html name=\"value\"]]><'&'")
    })
})

describe("test escapeComment function", () => {
    it("should return ' - - ' for escapeComment('--')", () => {
        expect(escapeComment("--")).toBe(" - - ")
    })
    it("should return ' - -   - - ' for escapeComment('-- --')", () => {
        expect(escapeComment("-- --")).toBe(" - -   - - ")
    })
})

describe("test unEscapeComment function", () => {
    it("should return '--' for unEscapeComment(' - - ')", () => {
        expect(unEscapeComment(" - - ")).toBe("--")
    })
    it("should return '-- --' for unEscapeComment(' - -   - - ')", () => {
        expect(unEscapeComment(" - -   - - ")).toBe("-- --")
    })
})

describe("test testPILang function", () => {
    it("should return true for testPILang('php')", () => {
        expect(testPILang("php")).toBe(true)
    })
    it("should return true for testPILang('php=')", () => {
        expect(testPILang("php=")).toBe(true)
    })
    it("should return false for testPILang('2php')", () => {
        expect(testPILang("2php")).toBe(false)
    })
    it("should return false for testPILang('#php')", () => {
        expect(testPILang("#php")).toBe(false)
    })
})

describe("test escapePIBody function", () => {
    it("should return '?&gt;' for escapePIBody('\?>')", () => {
        expect(escapePIBody("\?>")).toBe("?&gt;")
    })
    it("should return '?&gt; $a<$b ?&gt;' for escapePIBody('\?> $a<$b \?>')", () => {
        expect(escapePIBody("\?> $a<$b \?>")).toBe("?&gt; $a<$b ?&gt;")
    })
})

describe("test unEscapePIBody function", () => {
    it("should return '\?>' for unEscapePIBody('?&gt;')", () => {
        expect(unEscapePIBody("?&gt;")).toBe("\?>")
    })
    it("should return '\?> $a<$b \?>' for unEscapePIBody('?&gt; $a<$b ?&gt;')", () => {
        expect(unEscapePIBody("?&gt; $a<$b ?&gt;")).toBe("\?> $a<$b \?>")
    })
})

