import { useEffect, useState } from 'react';

const loadJson = (languageKey: string): Promise<any> => {
	return new Promise((res, rej) => {
	  import(`../lang/${languageKey}.json`).then((data) => {
		res(data?.default);
	  });
	});
  };

const useTranslation = (locale: string) => {
	const [messages, setMessages] = useState({});

	useEffect(() => {
		const loadJsonAsync = async () => {
		  const messages = await loadJson(locale);
		  setMessages(messages);
		}
		loadJsonAsync();
	  }, [locale])

	  return  messages;
}

export default useTranslation;