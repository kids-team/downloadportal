const htmlSplitRegex: RegExp = (() => {
    /* eslint-disable no-multi-spaces */
    const comments =
        '!' + // Start of comment, after the <.
        '(?:' + // Unroll the loop: Consume everything until --> is found.
        '-(?!->)' + // Dash not followed by end of comment.
        '[^\\-]*' + // Consume non-dashes.
        ')*' + // Loop possessively.
        '(?:-->)?'; // End of comment. If not found, match all input.

    const cdata =
        '!\\[CDATA\\[' + // Start of comment, after the <.
        '[^\\]]*' + // Consume non-].
        '(?:' + // Unroll the loop: Consume everything until ]]> is found.
        '](?!]>)' + // One ] not followed by end of comment.
        '[^\\]]*' + // Consume non-].
        ')*?' + // Loop possessively.
        '(?:]]>)?'; // End of comment. If not found, match all input.

    const escaped =
        '(?=' + // Is the element escaped?
        '!--' +
        '|' +
        '!\\[CDATA\\[' +
        ')' +
        '((?=!-)' + // If yes, which type?
        comments +
        '|' +
        cdata +
        ')';

    const regex =
        '(' + // Capture the entire match.
        '<' + // Find start of element.
        '(' + // Conditional expression follows.
        escaped + // Find end of escaped element.
        '|' + // ... else ...
        '[^>]*>?' + // Find end of normal element.
        ')' +
        ')';

    return new RegExp(regex);
    /* eslint-enable no-multi-spaces */
})();

function htmlSplit(input: string) {
    const parts: Array<string> = [];
    let workingInput: string = input;

    let match: RegExpMatchArray | null;

    while ((match = workingInput.match(htmlSplitRegex))) {
        const index: number = match.index || 0;

        parts.push(workingInput.slice(0, index));
        parts.push(match[0]);
        workingInput = workingInput.slice(index + match[0].length);
    }

    if (workingInput.length) {
        parts.push(workingInput);
    }

    return parts;
}

function replaceInHtmlTags(haystack: string, replacePairs: { [key: string]: string }): string {
    // Find all elements.
    haystack = haystack.replace(/<[^>]+>[\s\S]+?<\/[^>]+>/g, m => m.replace(/\n+/g, ''));
    console.log(haystack);
    return haystack;
}

function autop(text: string, br: boolean) {
    const allBlocks: string =
        '(?:table|thead|banner|subpage|tr|td|th|box|dl|ul|ol|li|address|hr|bible|box|newest|popular|div)';
    text = text.replace(new RegExp('(<' + allBlocks + '[\\s/>])', 'g'), '\n\n$1');
    text = text.replace(new RegExp('(</' + allBlocks + '>)', 'g'), '$1\n\n');
    text = text.replace(/\r\n|\r/g, '\n');
    text = replaceInHtmlTags(text, { '\n': ' <!-- ctxnl --> ' });

    if (text.indexOf('<box') !== -1) {
        text = text.replace(/\s*<box/g, '<box');
        text = text.replace(/<\/box>\s*/g, '</box>');
    }

    if (text.indexOf('</box>') !== -1) {
        text = text.replace(/(<box[^>]*>)\s*/g, '$1');
        text = text.replace(/\s*<\/box>/g, '</box>');
        text = text.replace(/\s*(<\/?(?:box)[^>]*>)\s*/g, '$1');
    }

    text = text.replace(/\n\n+/g, '\n\n');

    const texts: Array<string> = text.split(/\n\s*\n/).filter(Boolean);

    text = '';

    texts.forEach(textPiece => {
        text += '<p>' + textPiece.replace(/^\n*|\n*$/g, '') + '</p>\n';
    });

    text = text.replace(/<p>\s*<\/p>/g, '');

    text = text.replace(/<p>(<li.+?)<\/p>/g, '$1');

    text = text.replace(new RegExp('<p>\\s*(</?' + allBlocks + '[^>]*>)', 'g'), '$1');
    text = text.replace(new RegExp('(</?' + allBlocks + '[^>]*>)\\s*</p>', 'g'), '$1');

    if (br) {
        // Replace newlines that shouldn't be touched with a placeholder.
        text = text.replace(/<(script|style).*?<\/\\1>/g, match => match[0].replace(/\n/g, '<WPPreserveNewline />'));

        // Normalize <br>
        text = text.replace(/<br>|<br\/>/g, '<br />');

        // Replace any new line characters that aren't preceded by a <br /> with a <br />.
        text = text.replace(/(<br \/>)?\s*\n/g, (a, b) => (b ? a : '<br />\n'));

        // Replace newline placeholders with newlines.
        text = text.replace(/<WPPreserveNewline \/>/g, '\n');
    }

    // If a <br /> tag is after an opening or closing block tag, remove it.
    text = text.replace(new RegExp('(</?' + allBlocks + '[^>]*>)\\s*<br />', 'g'), '$1');

    // If a <br /> tag is before a subset of opening or closing block tags, remove it.
    text = text.replace(/<br \/>(\s*<\/?(?:li|dl|dd|dt|th|pre|td|ul|ol)[^>]*>)/g, '$1');
    text = text.replace(/\n<\/p>$/g, '</p>');

    if (-1 !== text.indexOf('<!-- ctxnl -->')) {
        text = text.replace(/\s?<!-- ctxnl -->\s?/g, '\n');
    }

    return text;
}

export default autop;
