import parse from 'html-react-parser';
import options from './parser/parserOptions';
import replaceSyntax from './parser/replaceSyntax';

interface Props {
    content: string;
}

const Parser = (props: Props) => {

    const { content } = props;

    if (content === undefined) return <></>;
	if (content === '') return <></>;

    const replacedText = replaceSyntax(content);
    let result = parse(replacedText, options);

    return <div className="parsed-text">{result}</div>;
};

export default Parser;
