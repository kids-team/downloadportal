import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { Article } from './services/models/article';
import { StateProvider } from './services/store';

declare global {
    interface Window {
        PAGE_DATA: Article;
    }
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <StateProvider>
        <App />
    </StateProvider>
);
