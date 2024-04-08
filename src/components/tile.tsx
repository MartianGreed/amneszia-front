import { useCallback, useMemo } from "react";

export type Tile = {
  attr: any;
  revealed: boolean;
}

export type TileItemProps = {
  tile: Tile;
  x: number;
  y: number;
  isHovered: boolean
  sendMessage: (message: any) => void;
}

export function TileItem({ tile, x, y, isHovered, sendMessage }: TileItemProps) {
  const handleMouseEnter = useCallback(() => {
    sendMessage(buildMessage(HOVERED, x, y))
  }, [x, y])

  const handleMouseLeave = useCallback(() => {
    sendMessage(buildMessage(LEAVE, x, y))
  }, [x, y])

  const handleReveal = useCallback(() => {
    sendMessage(buildMessage(REVEALED, x, y))
  }, [x, y])

  const className = useMemo(() => {
    return `tile  transform transition duration-75 ${isHovered ? " hovered scale-105" : ""}`;
  }, [isHovered]);


  const imgSrc = useMemo(() => {
    if (!tile.revealed) {
      return "";
    }
    return tile.attr.image
  }, [tile]);

  return (
    <button
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleReveal}
    >
      {tile.revealed && <div><img src={imgSrc} alt={tile.attr.name} /></div>}
    </button >
  )
}

const HOVERED = "user.hover-card";
const LEAVE = "user.leave-card";
const REVEALED = "user.reveal-card";

function buildMessage(event: string, x: number, y: number): string {
  return JSON.stringify({
    event,
    x,
    y,
  });
}
