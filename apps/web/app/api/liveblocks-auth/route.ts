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
    const { data: publicAccess } = await supabase
      .from("room_permissions")
      .select("access_level")
      .eq("room_id", room)
      .is("user_id", null)
      .single();

    const session = liveblocks.prepareSession(`guest-${Date.now()}`, {
      userInfo: { name: "Guest", avatar: "" },
    });

    if (publicAccess) {
      const access =
        publicAccess.access_level === "full"
          ? session.FULL_ACCESS
          : session.READ_ACCESS;
      session.allow(room, access);
    } else {
      session.allow(room, session.FULL_ACCESS);
    }

    const { body, status } = await session.authorize();
    return new Response(body, { status });
  }

  const session = liveblocks.prepareSession(user.id, {
    userInfo: {
      name: user.email || "User",
      avatar: user.user_metadata?.avatar_url || "",
    },
  });

  if (room === user.id) {
    session.allow(room, session.FULL_ACCESS);
  } else {
    const { data: userPermission } = await supabase
      .from("room_permissions")
      .select("access_level")
      .eq("room_id", room)
      .eq("user_id", user.id)
      .single();

    if (userPermission) {
      const access =
        userPermission.access_level === "full"
          ? session.FULL_ACCESS
          : session.READ_ACCESS;
      session.allow(room, access);
    } else {
      session.allow(room, session.FULL_ACCESS);
    }
  }

  const { body, status } = await session.authorize();
  return new Response(body, { status });
}
