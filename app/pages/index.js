import React, { useState, useEffect } from 'react';
import * as anchor from '@project-serum/anchor';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import idl from './myproject.json'

const { SystemProgram, Keypair } = anchor.web3;

let myAccount = Keypair.generate();

const programID = new PublicKey(idl.metadata.address);
console.log('program Id set correctly:', programID);

const network = clusterApiUrl('devnet');

const opts = {
    preflightCommitment: 'processed',
}

function App() {
    const [walletAddress, setWalletAddres] = useState(null);
    const [retrieveValue, setRetrieveValue] = useState(null);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        async function checkWallet() {
            try {
                if (window.solana) {
                    const solana = window.solana;
                    if (solana.isPhantom) {
                        console.log('wallet detected!');
                        alert('Phantom wallet found!');
                        const res = await solana.connect({ onlyIfTrusted: true });
                        console.log('connected with publicKey:', res.publicKey.toString());
                        setWalletAddres(res.publicKey.toString());
                        await retrieve();
                        if (retrieveValue === null) {
                            await createAccount();
                        }
                    }
                } else {
                    alert('wallet not found!');
                    console.log('wallet not found!');
                }
            } catch (error) {
                alert('connect your Phantom wallet');
                console.log('wallet not yet authorized');
            }
        }

        checkWallet();
    }, []);

    const connectWallet = async () => {
        try {
            if (window.solana) {
                const solana = window.solana;
                const res = await solana.connect();
                setWalletAddres(res.publicKey.toString());
                await retrieve();
                if (retrieveValue === null) {
                    await createAccount();
                }
            } else {
                alert('transaction failed!')
            }
        } catch (error) {
            alert('the user has rejected the request!')
            console.log(error);
        }
    }

    const getProvider = () => {
        const connection = new Connection(network, opts.preflightCommitment);
        const provider = new anchor.AnchorProvider(
            connection,
            window.solana,
            opts.preflightCommitment,
        )
        console.log(provider, 'provider is set correctly');
        return provider;
    }

    const retrieve = async () => {
        try {
            const provider = getProvider();
            const program = new anchor.Program(idl, programID, provider);
            const account = await program.account.init.fetch(myAccount.publicKey);
            setRetrieveValue(account.value.toString());
            console.log('retrieve value is:', retrieveValue);
        } catch (error) {
            console.log('Error in fetching:', error);
            setRetrieveValue(null)
        }
    }

    const createAccount = async () => {
        try {
            const provider = getProvider();
            const program = new anchor.Program(idl, programID, provider);
            let tx = await program.rpc.initialize({
                accounts: {
                    initialAccount: myAccount.publicKey,
                    user: provider.wallet.publicKey,
                    systemProgram: SystemProgram.programId,
                },
                signers: [myAccount],
            })
            console.log('Created a new account w/ address:', myAccount.publicKey.toString(),
            )
        } catch (error) {
            console.log('Error in creating account:', error)
        }
    }

    const onInputChange = (event) => {
        const { value } = event.target
        setInputValue(value)
    }

    const UpdateValue = async () => {
        try {
            const provider = getProvider();
            const program = new anchor.Program(idl, programID, provider);
            const value = inputValue;

            let tx2 = await program.rpc.updateValue(value, {
                accounts: {
                    storageAccount: myAccount.publicKey,
                },
                
            }) 
            console.log('Message stored sucessfully! tx:', tx2)
        } catch (error) {
            console.log('error in tx2!:', error);
        }
    }

    return (
        <div className='App'>
            <div>
                <h2 className="header" >Daoist&apos;s Note DApp</h2>

                {!walletAddress ? (
                    <div>
                        <button className='btn' onClick={connectWallet}>
                            Connect Wallet
                        </button>
                    </div>
                ) : (
                    <div>
                        <p>
                            Connected Account :{' '}
                            <span className='address'>{walletAddress}</span>
                        </p>
                        <div className="grid-container">
                            {/* set value column one */}
                            <div className="grid-item">
                                <input
                                    placeholder="Type here..."
                                    value={inputValue}
                                    onChange={onInputChange}
                                ></input>
                                <br></br>
                                <button className="btn2" onClick={UpdateValue} >
                                    Save
                                </button>
                            </div>
                            {/* set value column two*/}
                            <div className="grid-item">
                                <button className="btn2" onClick={retrieve} >
                                    Retrieve
                                </button>
                                <p>{retrieveValue}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

}

export default App;
