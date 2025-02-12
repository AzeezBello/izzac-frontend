// src/pages/_app.tsx
import AppLayout from '../app/layout';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <AppLayout>
      <Component {...pageProps} />
    </AppLayout>
  );
}

export default MyApp;
