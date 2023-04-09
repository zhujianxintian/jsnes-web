import Raven from 'raven-js';
import { ErrorInfo } from 'react';

export const handleError = (error: Error, errorInfo: ErrorInfo) => {
    console.error(error);
    Raven.captureException(error, { extra: errorInfo });
};

type Path = string | URL;

type ProgressEvent = XMLHttpRequestEventTarget['onprogress'];

interface LoadBinary {
    (path: Path, callback: (error: Error | null, data?: string) => any, handleProgress: ProgressEvent): XMLHttpRequest;
}

export const loadBinary: LoadBinary = (path, callback, handleProgress) => {
    const request = new XMLHttpRequest();
    request.open('GET', path);
    request.overrideMimeType('text/plain; charset=x-user-defined');
    request.onload = () => {
        if (request.status === 200) {
            if (request.responseText.match(/^<!doctype html>/i)) {
                // Got HTML back, so it is probably falling back to index.html due to 404
                return callback(new Error('Page not found'), undefined);
            }
            callback(null, request.responseText);
        } else if (request.status === 0) {
            // Aborted, so ignore error
        } else {
            callback(new Error(request.statusText));
        }
    };
    request.onerror = () => callback(new Error(request.statusText));
    request.onprogress = handleProgress;
    request.send();
    return request;
};
