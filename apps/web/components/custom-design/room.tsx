"use client";

import { LiveMap } from "@liveblocks/client";
import { ClientSideSuspense } from "@liveblocks/react";

import Loader from "./components/loader";
import { RoomProvider } from "@/liveblocks.config";
import { useUserStore } from "@/store/use-user-store";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@/lib/supabase/client";

const Room = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUserStore();
  const [roomId, setRoomId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const checkAccessAndSetRoom = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const sharedRoomId = urlParams.get("roomId");
      if (sharedRoomId && user?.id) {
        const isOwner = user.id === sharedRoomId;
        if (isOwner) {
          setRoomId(sharedRoomId);
          return;
        }
        const { data: permission, error } = await supabase
          .from("room_permissions")
          .select("id")
          .eq("room_id", sharedRoomId)
          .eq("user_id", user.id)
          .single();

        if (permission && !error) {
          setRoomId(sharedRoomId);
          return;
        } else {
          setRoomId(user.id);
          return;
        }
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
    };

    checkAccessAndSetRoom();
  }, [user, supabase]);
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
