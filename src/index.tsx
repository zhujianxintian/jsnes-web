import Raven from 'raven-js';
import React from 'react';
import ReactDOMClient from 'react-dom/client';
import App from './App';
import config from './utils/config';
import './index.scss';

if (config.SENTRY_URI) {
    Raven.config(config.SENTRY_URI).install();
}

Raven.context(() => {
    const container = document.getElementById('root');
    if (!container) {
        return;
    }
    const root = ReactDOMClient.createRoot(container);
    root.render(<App />);
});
