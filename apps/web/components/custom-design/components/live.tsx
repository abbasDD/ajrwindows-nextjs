"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Minus, RotateCcw } from "lucide-react";

import {
  useBroadcastEvent,
  useEventListener,
  useMyPresence,
  useOthers,
  useSelf,
} from "@/liveblocks.config";
import useInterval from "@/hooks/use-interval";
import {
  CursorMode,
  CursorState,
  Reaction,
  ReactionEvent,
} from "@/types/canva-types";
import { shortcuts } from "@/constant/canva";

import { Comments } from "./comments/comments";
import {
  CursorChat,
  FlyingReaction,
  LiveCursors,
  ReactionSelector,
} from "./index";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

type Props = {
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
  undo: () => void;
  redo: () => void;
  fabricRef: React.MutableRefObject<fabric.Canvas | null>;
};

const Live = ({ canvasRef, undo, redo, fabricRef }: Props) => {
  const others = useOthers();
  const [{ cursor }, updateMyPresence] = useMyPresence() as any;
  const broadcast = useBroadcastEvent();
  const self = useSelf();
  const canWrite = self?.canWrite ?? true;

  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [zoom, setZoom] = useState(1);
  const [cursorState, setCursorState] = useState<CursorState>({
    mode: CursorMode.Hidden,
  });

  const setReaction = useCallback((reaction: string) => {
    setCursorState({ mode: CursorMode.Reaction, reaction, isPressed: false });
  }, []);

  const handleZoomChange = useCallback(
    (type: "in" | "out" | "reset") => {
      if (!fabricRef.current) return;

      let newZoom = fabricRef.current.getZoom();
      if (type === "in") newZoom += 0.1;
      if (type === "out") newZoom -= 0.1;
      if (type === "reset") newZoom = 1;

      newZoom = Math.min(Math.max(0.1, newZoom), 5);

      const center = fabricRef.current.getVpCenter();
      fabricRef.current.zoomToPoint({ x: center.x, y: center.y }, newZoom);

      setZoom(newZoom);
    },
    [fabricRef],
  );

  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const handleWheel = () => setZoom(canvas.getZoom());
    canvas.on("mouse:wheel", handleWheel);

    return () => {
      canvas.off("mouse:wheel", handleWheel);
    };
  }, [fabricRef]);

  useInterval(() => {
    setReactions((reactions) =>
      reactions.filter((reaction) => reaction.timestamp > Date.now() - 4000),
    );
  }, 1000);

  useInterval(() => {
    if (
      cursorState.mode === CursorMode.Reaction &&
      cursorState.isPressed &&
      cursor
    ) {
      setReactions((reactions) =>
        reactions.concat([
          {
            point: { x: cursor.x, y: cursor.y },
            value: cursorState.reaction,
            timestamp: Date.now(),
          },
        ]),
      );

      broadcast({
        x: cursor.x,
        y: cursor.y,
        value: cursorState.reaction,
      });
    }
  }, 100);

  useEventListener((eventData) => {
    const event = eventData.event as ReactionEvent;
    setReactions((reactions) =>
      reactions.concat([
        {
          point: { x: event.x, y: event.y },
          value: event.value,
          timestamp: Date.now(),
        },
      ]),
    );
  });

  useEffect(() => {
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "/") {
        setCursorState({
          mode: CursorMode.Chat,
          previousMessage: null,
          message: "",
        });
      } else if (e.key === "Escape") {
        updateMyPresence({ message: "" });
        setCursorState({ mode: CursorMode.Hidden });
      } else if (e.key === "e") {
        setCursorState({ mode: CursorMode.ReactionSelector });
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/") e.preventDefault();
    };

    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [updateMyPresence]);

  const handlePointerMove = useCallback(
    (event: React.PointerEvent) => {
      event.preventDefault();

      if (cursor == null || cursorState.mode !== CursorMode.ReactionSelector) {
        const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
        const y = event.clientY - event.currentTarget.getBoundingClientRect().y;

        updateMyPresence({ cursor: { x, y } });
      }
    },
    [cursor, cursorState.mode, updateMyPresence],
  );

  const handlePointerLeave = useCallback(() => {
    setCursorState({ mode: CursorMode.Hidden });
    updateMyPresence({ cursor: null, message: null });
  }, [updateMyPresence]);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent) => {
      const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
      const y = event.clientY - event.currentTarget.getBoundingClientRect().y;

      updateMyPresence({ cursor: { x, y } });

      setCursorState((state: CursorState) =>
        cursorState.mode === CursorMode.Reaction
          ? { ...state, isPressed: true }
          : state,
      );
    },
    [cursorState.mode, updateMyPresence],
  );

  const handlePointerUp = useCallback(() => {
    setCursorState((state: CursorState) =>
      cursorState.mode === CursorMode.Reaction
        ? { ...state, isPressed: false }
        : state,
    );
  }, [cursorState.mode]);

  const handleContextMenuClick = useCallback(
    (key: string) => {
      switch (key) {
        case "Chat":
          setCursorState({
            mode: CursorMode.Chat,
            previousMessage: null,
            message: "",
          });
          break;
        case "Reactions":
          setCursorState({ mode: CursorMode.ReactionSelector });
          break;
        case "Undo":
          undo();
          break;
        case "Redo":
          redo();
          break;
        default:
          break;
      }
    },
    [undo, redo],
  );

  return (
    <ContextMenu>
      <ContextMenuTrigger
        className="canvas-grid relative flex h-full w-full flex-1 items-center justify-center"
        id="canvas"
        style={{
          cursor: cursorState.mode === CursorMode.Chat ? "none" : "auto",
        }}
        disabled={!canWrite}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <canvas ref={canvasRef} />

        <div className="absolute bottom-20 left-10 z-50 flex items-center gap-1 rounded-lg bg-card p-1.5 shadow-xl border border-primary-grey-100">
          <button
            onClick={() => handleZoomChange("out")}
            className="p-2 hover:bg-primary-grey-200 rounded-md transition-all text-primary-grey-300"
          >
            <Minus size={16} />
          </button>

          <span className="min-w-[60px] text-center text-xs font-bold text-primary-grey-300 select-none">
            {Math.round(zoom * 100)}%
          </span>

          <button
            onClick={() => handleZoomChange("in")}
            className="p-2 hover:bg-primary-grey-200 rounded-md transition-all text-primary-grey-300"
          >
            <Plus size={16} />
          </button>
        </div>

        {reactions.map((reaction) => (
          <FlyingReaction
            key={reaction.timestamp.toString()}
            x={reaction.point.x}
            y={reaction.point.y}
            timestamp={reaction.timestamp}
            value={reaction.value}
          />
        ))}

        {cursor && (
          <CursorChat
            cursor={cursor}
            cursorState={cursorState}
            setCursorState={setCursorState}
            updateMyPresence={updateMyPresence}
          />
        )}

        {cursorState.mode === CursorMode.ReactionSelector && (
          <ReactionSelector setReaction={(reaction) => setReaction(reaction)} />
        )}

        <LiveCursors others={others} />
        <Comments />
      </ContextMenuTrigger>

      <ContextMenuContent className="right-menu-content ">
        {shortcuts.map((item) => (
          <ContextMenuItem
            key={item.key}
            className="right-menu-item"
            onClick={() => handleContextMenuClick(item.name)}
          >
            <p>{item.name}</p>
            <p className="text-xs text-primary-grey-300">{item.shortcut}</p>
          </ContextMenuItem>
        ))}
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default Live;
