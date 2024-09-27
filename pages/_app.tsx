// pages/_app.tsx
import { AppProps } from "next/app";
import "./../styles/global.css";
import { AuthProvider } from "../context/AuthContext";
import i18n from "../i18n";
import { I18nextProvider } from "react-i18next";
import { LanguageProvider } from "../context/LanguageContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <I18nextProvider i18n={i18n}>
        <LanguageProvider>
          <Component {...pageProps} />
        </LanguageProvider>
      </I18nextProvider>
    </AuthProvider>
  );
}

export default MyApp;
