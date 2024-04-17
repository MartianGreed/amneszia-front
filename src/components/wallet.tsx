import { useAccount, useBalance } from "@starknet-react/core";
import BN from "bn.js";
import { useEffect, useMemo, useState } from "react";

export const STARKNET_ID_INDEXER_TESTNET = "https://goerli.indexer.starknet.id";
export const STARKNET_ID_INDEXER_MAINNET = "https://app.starknet.id/api/indexer";

export default function Wallet() {
  const [starknetId, setStarknetId] = useState(undefined);
  const { account, address, status } = useAccount();
  const { data: lordsBalance } = useBalance({ token: "0x0124aeb495b947201f5fac96fd1138e326ad86195b98df6dec9009158a533b49", address });
  useEffect(() => {
    if (starknetId === null) {
      getStarknetId(address, "mainnet").then((id) => {
        console.log(id);
      });
    }
  }, [address])

  return (
    <div className="self-end flex flex-row items-center mb-6">
      <div className="text-base font-bold mr-6 text-yellow">{lordsBalance?.formatted.split(".")[0]} {lordsBalance?.symbol} = {lordsBalance ? Math.floor(1 + Math.log(parseFloat(lordsBalance.formatted))) : "0"} extra moves</div>
      <div className="pb-10 button text-xs">{minifyAddressOrStarknetId(address, starknetId)}</div>
    </div>
  )
}

export function minifyAddressOrStarknetId(address: string | undefined, starknetId: string | undefined): string {
  const input = starknetId !== undefined ? starknetId : address;
  if (input === undefined) { return ""; }

  return input.length > 24 ? `${input.substring(0, 7)} ... ${input.substring(input.length - 7, input.length)}` : input;
}
export async function getStarknetId(address: string | undefined, network: any): Promise<string | undefined> {
  // If no wallet is connected
  if (address === undefined) {
    return undefined;
  }

  // Transform address to BN
  const feltAddr = new BN(address.slice(2), 16).toString(10);

  // Select indexer
  const indexer = network.id === "mainnet" ? STARKNET_ID_INDEXER_MAINNET : STARKNET_ID_INDEXER_TESTNET;

  // Call inddexer and check if there is a prefered domain
  try {
    const domain = await fetch(indexer + "/addr_to_domain?addr=" + feltAddr);
    const domainJSON = await domain.json();
    if (domainJSON.domain) {
      return domainJSON.domain;
    }

    // If no prefered domain, check if there are non prefered domains
    const domains = await fetch(indexer + "/addr_to_full_ids?addr=" + feltAddr);
    const domainsJSON = await domains.json();

    return domainsJSON.full_ids.length === 0 ? undefined : domainsJSON.full_ids[0].domain;
  } catch (e) {
    console.error(e);
    return undefined;
  }
}
