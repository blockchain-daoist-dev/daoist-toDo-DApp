// import App from './index'
import Head from 'next/head'
import '../styles/global.css'
// Import WalletConnectionProvider from components
import { WalletConnectProvider } from '../components/WalletConnectProvider'
// Import the solana wallet css
import '@solana/wallet-adapter-react-ui/styles.css'

import { Toaster } from 'react-hot-toast'

function MyApp({ Component, pageProps }) {
    return (
        <>
            <Head>
                <title>Daoist Todo App</title>
            </Head>
            <main>
                <WalletConnectProvider>
                    <Component {...pageProps} />
                    <Toaster />
                    {/* <App /> */}
                </WalletConnectProvider>
            </main >
        </>
    )
}

export default MyApp
