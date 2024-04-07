"use client";

import { useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { Tile, TileItem } from './tile';
import { InferGetStaticPropsType, GetStaticProps } from 'next';

export const getStaticProps = (() => {
  return {
    props: {
      domain: process.env.BACKEND_DOMAIN ?? "ws://localhost:8000",
    }
  };

}) satisfies GetStaticProps<{ domain: string }>

export default function Game({ domain }: InferGetStaticPropsType<typeof getStaticProps>) {
  const [d, setDomain] = useState<string>("ws://localhost:8000");
  const [grid, setGrid] = useState<Array<Array<Tile>>>([[]]);
  const [hovered, setHovered] = useState<Array<Array<boolean>>>([[]]);
  const [messageHistory, setMessageHistory] = useState<MessageEvent<any>[]>([]);
  const { sendMessage, lastMessage } = useWebSocket(`${d}/ws`);
  useEffect(() => {
    if (undefined !== domain) {
      setDomain(domain)
    }
  }, [domain]);

  useEffect(() => {
    if (lastMessage !== null) {
      const msg = handleReceiveMessage(lastMessage)
      if (msg.hasOwnProperty('revealed')) {
        setGrid(msg.revealed)
        setHovered(generateHoverFromGid(msg.revealed))
      }
      if (msg.hasOwnProperty('Event')) {
        switch (msg.Event) {
          case "system.hover-card":
            setHovered((prev) => {
              prev[msg.X][msg.Y] = true;
              return prev;
            });
            break;
          case "system.leave-card":
            setHovered((prev) => {
              prev[msg.X][msg.Y] = false;
              return prev;
            });
            break;
          case "system.reveal-card":
            if (msg.X === -1 && msg.Y === -1) {
              break;
            }
            setGrid((prev) => {
              prev[msg.X][msg.Y] = { ...msg.Attribute };
              return prev;
            })
            break;
          case "system.hide-card":
            if (msg.X === -1 && msg.Y === -1) {
              break;
            }
            setGrid((prev) => {
              prev[msg.X][msg.Y] = { ...msg.Attribute };
              return prev;
            })
            break;
          default:
        }
      }

      setMessageHistory((prev) => prev.concat(msg));
    }
  }, [lastMessage, setGrid, setHovered]);

  return (
    <>
      <div className="grid w-full gap-4 grid-cols-10 grid-rows-6">
        {grid.map((row, idxP) => {
          return row.map((tile, idx) => {
            return <TileItem key={`${idxP}_${idx}`} tile={tile} x={idxP} y={idx} isHovered={hovered[idxP][idx]} sendMessage={sendMessage} />
          })
        })}
      </div>
    </>
  )
}

function handleReceiveMessage(message: MessageEvent<any>) {
  return JSON.parse(message.data)
}

function generateHoverFromGid(grid: Array<Array<Tile>>) {
  return grid.map((row) => {
    return row.map(() => {
      return false
    })
  })
}
