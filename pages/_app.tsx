import '../styles/globals.css';
import '../styles/tailwind.css';
import '../styles/css.css';
import { RecoilRoot } from "recoil";
import { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <RecoilRoot>
      <Component {...pageProps} />
    </RecoilRoot>
  )
}

export default MyApp
