import "../styles/globals.css";
import "../styles/tailwind.css";
import "../styles/css.css";
import { RecoilRoot } from "recoil";
import { AppProps } from "next/app";
import i18n from "../translation/i18n";
import { I18nextProvider } from "react-i18next";

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <RecoilRoot>
      <I18nextProvider i18n={i18n}>
        <Component {...pageProps} />
      </I18nextProvider>
    </RecoilRoot>
  );
}

export default MyApp;
