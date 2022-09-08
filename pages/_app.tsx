import '../styles/globals.css';
import '../styles/tailwind.css';
import '../styles/css.css';
import { RecoilRoot } from "recoil";

function MyApp({ Component, pageProps }: { Component: any, pageProps: any }) {
  return (
    <RecoilRoot>
      <Component {...pageProps} />
    </RecoilRoot>
  )
}

export default MyApp
