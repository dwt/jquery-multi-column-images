// Idea: Take an image out of the normal flow and show it top right over two columns
// Add placeholders in the text to prevent it from being shown under the image

(function($) {
    $.fn.multiColumnizeImages = function() {
        return this.each(function() {
            context.dom = $(this);
            context.extractImageToTopRight($(this).find('img:eq(0)'))
            delete context.dom;
        })
    }
    
    var context = $.fn.multiColumnizeImages
    
    $.extend(context, {
      
        columnWidth: function(aDomElement) {
            var tester = $('<div>').css({
                width: '100%',
                height: 0
            });
            $(aDomElement).prepend(tester);
            var width = tester.width();
            tester.remove();
            return width;
        },
    
        columnGapWidth: function(aDomElement) {
            var first = $('<div>').css({
                width: '100%',
                height: '100%'
            });
            var second = first.clone();
            $(aDomElement).append(first).append(second);
            var width = second.position().left - first.position().left - first.width();
            first.remove(); second.remove();
            return width;
        },
    
        widthOfImageSpanningTwoColumns: function(aDomElement) {
            return Math.ceil(this.columnWidth(aDomElement) * 2 + this.columnGapWidth(aDomElement));
        },
        
        extractImageToTopRight: function(anImage) {
            this.dom.css({ position: 'relative' });
            var width = this.widthOfImageSpanningTwoColumns(this.dom);
            anImage.css({
                position: 'absolute',
                top: 0,
                left: this.dom.width() - width,
                width: width
            });
        },
        
        isBreakingParagraph: function(aParagraph) {
            // curiously the position left is reported on the next column, 
            // even if it's beginning is rendered on the previous
            var previous = aParagraph.prev();
            if (0 === previous.length) { // first element
                previous = aParagraph.parent()
            }
            return aParagraph.position().left > previous.position().left;
        },
        
        spanifyParagraph: function(aParagraph) {
            // only work on text nodes, everything else we ignore for now
            aParagraph
                .contents()
                .filter(function() { return this.nodeType == 3;})
                .each(function() {
                    $(this).parent().html($(this).text().trim().split(/\s+/).join(' <span/>'))
                });
        },
        
        isBreakingSpan: function(aSpan) {
            // in difference to paragraphs the spans have a width of 0 which the 
            // rendering engine seems to take as an agreement to render it on the previous column
            var next = aSpan.next();
            // how to deal with the last span?
            return aSpan.position().top < next.position().top;
            
        }
    })
    
    context.breakingParagraphs = function() {
        // broken, need to do this incremental instead
        return $('p').filter(function() { return $(this).position().top < 0; })
    };
    
    context.splinterBreakingParagraphs = function() {
        this.breakingParagraphs().each(function() {
            // only work on text nodes, everything else we ignore for now
            $(this).contents()
                .filter(function() { return this.nodeType == 3;})
                .each(function() {
                    $(this).parent().html($(this).text().split(/\s+/).join(' <span/>'))
                });
        });
    };
    
    context.firstSpanAtTopOfColumn = function() {
        var spans = $('span');
        var previousElement = $('span')[0]
        for (var index = 0; index < spans.length; index++) {
            if ($(spans[index]).position().top < $(previousElement).position().top) {
                // found a column break
                return $(spans[index]);
            }
            previousElement = spans[index];
        }
        return $([]);
    };

    context.enlargeToPlaceholder = function(element) {
        $(element).css({
            width: '100%',
            height: '300px', // should come from image
            display: 'block'
        });
    };
    
    context.insertFirstSpacer = function() {
        this.splinterBreakingParagraphs();
        this.enlargeToPlaceholder(this.firstSpanAtTopOfColumn());
    };

})(jQuery);
