"use client"
import { useAccount, useConnect } from "@starknet-react/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import Image from 'next/image'
import logo from '../../public/logo.svg'
import Game from "../components/game";
import Wallet from "../components/wallet";

function saveName(name: string) {
  localStorage.setItem("name", name);
}
function loadName() {
  return localStorage.getItem("name") || "";
}


export default function Home() {
  const { status } = useAccount();
  const [name, setName] = useState<string>("");
  const [isReady, setIsReady] = useState(false);
  const [isAnon, setIsAnon] = useState<boolean>(false);

  const onClick = useCallback(() => {
    saveName(name);
    setIsReady(true);
  }, [name]);

  const handleInputChange = useCallback((e: any) => {
    const n = e.target.value;
    setName(n.startsWith("0x") ? n : "0x" + n);
  }, []);

  useEffect(() => {
    if (name === "") {
      setName(loadName());
    }
  }, [name]);


  const hasValidName = useMemo(() => {
    return name.length > 2;
  }, [name]);

  const buttonClass = hasValidName ? "button" : "button disabled";

  if (status === "connected" || isAnon) {
    return (
      <main className="flex min-h-screen flex-col items-center p-20 pt-10 relative">
        <Wallet name={name} />
        <Game name={name} />
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-20">

      <div className="relative flex place-items-center">
        <Image src={logo} alt="Amneszia" />
      </div>
      <div className="flex place-items-center mt-24 flex-col gap-6">
        {!isReady && <div><input type="text" onChange={handleInputChange} placeholder="Enter your name" value={name} className="button input" /></div>}
        {!isReady && <button onClick={onClick} disabled={!hasValidName} className={buttonClass}>Ready?</button>}
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
