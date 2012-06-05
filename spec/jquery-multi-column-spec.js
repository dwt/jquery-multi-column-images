createDiv = function(columnCount, width) {
    
    columnCount = columnCount || 3
    width = width || 300
    
    var createLipsumWithImages = function() {
        var lipsum = [
            "Lorem ipsum dolor sit amet, ",
            "consectetur adipisicing elit, ",
            "sed do eiusmod tempor incididunt ",
            "ut labore et dolore magna aliqua. ",
            "Ut enim ad minim veniam, quis",
            "nostrud exercitation ullamco",
            "laboris nisi ut aliquip ex ea ",
            "commodo consequat. Duis aute irure ",
            "dolor in reprehenderit in voluptate ",
            "velit esse cillum dolore eu fugiat ",
            "nulla pariatur. Excepteur sint ",
            "occaecat cupidatat non proident, ",
            "sunt in culpa qui officia ",
            "deserunt mollit anim id est laborum.",
        ]
        var container = $('<div>').html('<p>' + lipsum.join('</p><p>') + '</p>')
        container.find('p:eq(4)').before('<img>')
        return container.contents()
    }
    var box = $('<div>')
        .attr('style', function(index, value) { return value + '; -webkit-column-count: ' + columnCount + ';' })
        .css({ height: 100, width: width })
        .html(createLipsumWithImages())
    setFixtures(box) // many size computations don't work if the div is not attached to the dom
    return box    
}

describe("jquery multi column", function() {
    beforeEach(function() {
        this.plugin = $.fn.multiColumnizeImages
    })
    
    describe("extracting meta-information", function() {
        
        it("should find the number of columns", function() {
            expect(createDiv(2).css('-webkit-column-count')).toBe('2')
            expect(createDiv().css('-webkit-column-count')).toBe('3')
        })
        
        it("should find the width of the column", function() {
            expect(this.plugin.columnWidth(createDiv(2, 100))).toBeLessThan(50)
            expect(this.plugin.columnWidth(createDiv(3, 100))).toBeLessThan(33)
        })
        
        it("should find the column-gap-width", function() {
            expect(this.plugin.columnGapWidth(createDiv(2, 100))).toBeLessThan(20)
            expect(this.plugin.columnGapWidth(createDiv(2, 100))).toBeGreaterThan(0)
        })
        
        it("should find the right size for an image to span two columns", function() {
            expect(this.plugin.widthOfImageSpanningTwoColumns(createDiv(2, 100))).toBe(100)
            expect(this.plugin.widthOfImageSpanningTwoColumns(createDiv(3, 100))).toBeGreaterThan(50)
            expect(this.plugin.widthOfImageSpanningTwoColumns(createDiv(3, 100))).toBeLessThan(70)
        })
        
    })
    
    describe("extracting images", function() {
        
        it("should position the first image at the top left over two columns", function() {
            var columns = createDiv(3).multiColumnizeImages()
            var image = columns.find('img')
            expect(image.length).toBe(1)
            expect(image.offset().top).toBe(columns.offset().top)
            expect(image.width()).toBe(this.plugin.widthOfImageSpanningTwoColumns(columns))
            expect(image.offset().left).toBeGreaterThan(this.plugin.columnWidth(columns)) // second column
        })
        
        // it("should only position the first image per page")
    })
    
    describe("reflowing text", function() {
        
        it("should find the breaking paragraph", function() {
            var div = createDiv(3, 300)
            expect(this.plugin.isBreakingParagraph(div.find('p').eq(0))).toBeFalsy()
            expect(this.plugin.isBreakingParagraph(div.find('p').eq(1))).toBeTruthy()
        })
        
        it("should spanify paragraph", function() {
            var p = createDiv().find('p').eq(1)
            expect(p).not.toContain('span')
            this.plugin.spanifyParagraph(p)
            expect(p).toContain('span')
            expect(p.find('span').length).toBe(2)
        })
        
        it("should find breaking span", function() {
            var p = createDiv().find('p').each(_(function(index, value) {
                this.plugin.spanifyParagraph($(value))
            }).bind(this))
            var breakingP = p.eq(1)
            debugger
            expect(this.plugin.isBreakingSpan(breakingP.find('span').eq(0))).toBeTruthy()
            expect(this.plugin.isBreakingSpan(breakingP.find('span').eq(1))).toBeTruthy()
        })
    })
})