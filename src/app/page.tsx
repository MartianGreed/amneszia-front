"use client"
import { useAccount, useConnect, Connector } from "@starknet-react/core";
import { useCallback, useState } from "react";
import Image from 'next/image'
import logo from '../../public/logo.svg'
import Game from "../components/game";
import Wallet from "../components/wallet";


export default function Home() {
  const { status } = useAccount();
  const [isReady, setIsReady] = useState(false);
  const [isAnon, setIsAnon] = useState<boolean>(false);
  const onClick = useCallback(() => {
    setIsReady(true);
  }, []);

  if (status === "connected" || isAnon) {
    return (
      <main className="flex min-h-screen flex-col items-center p-20 pt-10 relative">
        <Wallet />
        <Game />
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-20">

      <div className="relative flex place-items-center">
        <Image src={logo} alt="Amneszia" />
      </div>
      <div className="flex place-items-center mt-24">
        {!isReady && <button onClick={onClick} className="button">Ready?</button>}
        {isReady && <WalletList setIsAnon={setIsAnon} />}
      </div>
    </main>
  );
}

interface WalletListProps {
  setIsAnon(data: boolean): void;
}

function WalletList(props: WalletListProps) {
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
      <li key="anon" className="pr-12 inline-block">
        <button className="button" onClick={() => props.setIsAnon(true)}>
          anon
        </button>
      </li>
    </ul >
  );
}
