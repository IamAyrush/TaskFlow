import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const mount = () => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

async function enableMocking() {
  try {
    const { worker } = await import('./mocks/browser');
    await worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: { url: '/mockServiceWorker.js' },
    });
  } catch {
    // MSW failed to start — app still renders normally
  }
}

enableMocking().finally(mount);
