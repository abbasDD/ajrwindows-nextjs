import { createClient } from "@/lib/supabase/server";
import { Liveblocks } from "@liveblocks/node";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { room } = await request.json();

  if (!user) {
    if (room.startsWith("guest-")) {
      const session = liveblocks.prepareSession(room, {
        userInfo: {
          name: "Guest",
          avatar: "",
        },
      });

      session.allow(room, session.FULL_ACCESS);
      const { body, status } = await session.authorize();
      return new Response(body, { status });
    }

    return new Response("Unauthorized: Guests cannot join shared rooms", {
      status: 403,
    });
  }

  const session = liveblocks.prepareSession(user.id, {
    userInfo: {
      name: user.email || "Anonymous User",
      avatar: user.user_metadata?.avatar_url || "",
    },
  });

  const isOwner = room === user.id;

  if (isOwner) {
    session.allow(room, session.FULL_ACCESS);
  } else {
    const { data: hasAccess } = await supabase
      .from("room_permissions")
      .select("*")
      .eq("room_id", room)
      .eq("user_id", user.id)
      .single();

    if (!hasAccess) {
      return new Response("Forbidden: You do not have access to this room", {
        status: 403,
      });
    }
    session.allow(room, session.FULL_ACCESS);
  }
  const { body, status } = await session.authorize();
  return new Response(body, { status });
}
