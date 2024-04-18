"use client";

import { useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { Tile, TileItem } from './tile';


export type GameProps = {
  name: string;
};

export default function Game({ name }: GameProps) {
  const [grid, setGrid] = useState<Array<Array<Tile>>>([[]]);
  const [hovered, setHovered] = useState<Array<Array<{ hover: boolean, names: string[] }>>>([[]]);
  const [messageHistory, setMessageHistory] = useState<MessageEvent<any>[]>([]);
  const [hasSayHello, setHasSayHello] = useState(false);
  const { sendMessage, lastMessage, readyState } = useWebSocket(`${undefined !== process.env.NEXT_PUBLIC_BACKEND_DOMAIN ? process.env.NEXT_PUBLIC_BACKEND_DOMAIN : "ws://localhost:8000"}/ws`);

  useEffect(() => {
    if (readyState === ReadyState.CONNECTING && !hasSayHello) {
      sendMessage(JSON.stringify({ event: "user.say-hello", name: name }));
      setHasSayHello(true);
    }
  }, [readyState, hasSayHello, sendMessage, name]);

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
              const names = prev[msg.X][msg.Y].names;
              if (names.includes(msg.Name)) {
                return prev;
              }
              prev[msg.X][msg.Y] = { hover: true, names: [...names, msg.Name] };
              return prev;
            });
            break;
          case "system.leave-card":
            setHovered((prev) => {
              prev[msg.X][msg.Y] = { hover: false, names: prev[msg.X][msg.Y].names.filter((name) => name !== msg.Name) };
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
      <div className="grid w-full gap-1 !grid-cols-10">
        {grid.map((row, idxP) => {
          return row.map((tile, idx) => {
            return <TileItem key={`${idxP}_${idx}`} tile={tile} x={idxP} y={idx} isHovered={hovered[idxP][idx].hover} names={hovered[idxP][idx].names} sendMessage={sendMessage} />
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
      return { hover: false, names: [] }
    })
  })
}
