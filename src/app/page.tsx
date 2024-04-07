"use client"
import { useAccount, useConnect } from "@starknet-react/core";
import { useCallback, useState } from "react";
import Image from 'next/image'
import logo from '../../public/logo.svg'
import Game from "../components/game";


export default function Home() {
  const { account, address, status } = useAccount();
  const [isReady, setIsReady] = useState(false);
  const onClick = useCallback(() => {
    setIsReady(true);
  }, []);

  if (status === "connected") {
    return (
      <main className="flex min-h-screen flex-col items-center p-20">
        <Game />
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-20">

      <div className="relative flex place-items-center">
        <Image src={logo} alt="Amneszia" />
        {/* <h1 className="text-3xl text-center"> */}
        {/*   Amneszia */}
        {/*   <small className="block text-sm text-slate-500">Will you find those pairs ?</small> */}
        {/* </h1> */}
      </div>
      <div className="flex place-items-center mt-24">
        {!isReady && <button onClick={onClick} className="button">Ready ?</button>}
        {isReady && <WalletList />}
      </div>
    </main>
  );
}

function WalletList() {
  const { connect, connectors } = useConnect();
  return (
    <ul>
      {connectors.map((connector) => (
        <li key={connector.id} className="pr-12 inline-block">
          <button className="button" onClick={() => connect({ connector })}>
            {connector.name}
          </button>
        </li>
      ))}
    </ul>
  );
}
