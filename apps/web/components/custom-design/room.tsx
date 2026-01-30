"use client";

import { LiveMap } from "@liveblocks/client";
import { ClientSideSuspense } from "@liveblocks/react";

import Loader from "./components/loader";
import { RoomProvider } from "@/liveblocks.config";
import { useUserStore } from "@/store/use-user-store";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const Room = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUserStore();
  const [roomId, setRoomId] = useState<string | null>(null);
  console.log(user);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedRoomId = urlParams.get("roomId");

    if (sharedRoomId) {
      setRoomId(sharedRoomId);
      return;
    }
    if (user?.id) {
      setRoomId(user.id);
      return;
    }

    let guestId = localStorage.getItem("guest_room_id");
    if (!guestId) {
      guestId = `guest-${uuidv4()}`;
      localStorage.setItem("guest_room_id", guestId);
    }
    setRoomId(guestId);
  }, [user]);
  console.log(roomId);

  if (!roomId) return <Loader />;
  return (
    <RoomProvider
      id={roomId}
      initialPresence={{ cursor: null, cursorColor: null, editingText: null }}
      initialStorage={{
        canvasObjects: new LiveMap(),
      }}
    >
      <ClientSideSuspense fallback={<Loader />}>
        {() => children}
      </ClientSideSuspense>
    </RoomProvider>
  );
};

export default Room;
