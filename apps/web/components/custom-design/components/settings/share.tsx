"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe, Copy, X, Loader2 } from "lucide-react";
import { useUserStore } from "@/store/use-user-store";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import useSWR from "swr";
type RoomPermission = {
  id: string;
  room_id: string;
  user_id: string | null;
  access_level: "read-only" | "full";
  created_at: string;
  users: {
    id: string;
    username: string;
  } | null;
};

const Share = () => {
  const { user } = useUserStore();
  const supabase = createClient();
  const { mutate } = useSWRConfig();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const urlParams = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : "",
  );
  const currentRoomId = urlParams.get("roomId");
  const isOwner = user?.id === currentRoomId || !currentRoomId;

  const queryKey = user?.id ? `room-permissions-${user.id}` : null;

  const { data: permissions, isLoading: permissionsLoading } = useSWR<
    RoomPermission[]
  >(queryKey, async () => {
    const { data, error } = await supabase
      .from("room_permissions")
      .select(
        `
          *,
          users!user_id (
            id,
            username
          )
        `,
      )
      .eq("room_id", user?.id);

    if (error) throw error;
    return data as RoomPermission[];
  });

  const roomUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/custom-design/?roomId=${user?.id}`
      : "";

  const publicPermission = permissions?.find((p) => p.user_id === null);
  const isPublic = !!publicPermission;
  const privatePermissions =
    permissions?.filter((p) => p.user_id !== null) || [];

  if (!isOwner) return null;

  const handleInvite = async () => {
    if (!email || !user) return;
    if (email.includes(user.email as string)) {
      return toast.error(`You can't invite yourself`);
    }

    setLoading(true);
    try {
      const emailList = email
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);

      for (const emailAddress of emailList) {
        const { data: targetUserId, error: rpcError } = await supabase.rpc(
          "get_user_id_by_email",
          { email_address: emailAddress },
        );

        if (rpcError || !targetUserId) {
          toast.error(`User not found: ${emailAddress}`);
          continue;
        }

        const alreadyInvited = privatePermissions.some(
          (p) => p.user_id === targetUserId,
        );
        if (alreadyInvited) {
          toast.error(`${emailAddress} already has access`);
          continue;
        }

        await supabase.from("room_permissions").insert({
          room_id: user.id,
          user_id: targetUserId,
          access_level: "read-only",
        });

        toast.success(`Invited ${emailAddress}`);
      }

      mutate(queryKey);
      setEmail("");
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const togglePublic = async (makePublic: boolean) => {
    if (!user) return;
    setLoading(true);
    try {
      if (makePublic) {
        await supabase.from("room_permissions").upsert({
          room_id: user.id,
          user_id: null,
          access_level: "read-only",
        });
        toast.success("Room is now public");
      } else {
        await supabase
          .from("room_permissions")
          .delete()
          .eq("room_id", user.id)
          .is("user_id", null);
        toast.success("Removed public access");
      }
      mutate(queryKey);
    } catch (error) {
      toast.error("Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  const changeAccessLevel = async (
    permissionId: string,
    newLevel: "read-only" | "full",
  ) => {
    setLoading(true);
    try {
      await supabase
        .from("room_permissions")
        .update({ access_level: newLevel })
        .eq("id", permissionId);
      toast.success(`Access level updated`);
      mutate(queryKey);
    } catch (error) {
      toast.error("Failed to update access level");
    } finally {
      setLoading(false);
    }
  };

  const removeUser = async (permId: string) => {
    setLoading(true);
    try {
      await supabase.from("room_permissions").delete().eq("id", permId);
      toast.success("User removed");
      mutate(queryKey);
    } catch (error) {
      toast.error("Failed to remove user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={!user} variant="outline">
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#1E1E1E] border-none text-white max-w-md overflow-hidden">
        <div className="p-4 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-medium">Share Room</h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-400"
              onClick={() => {
                navigator.clipboard.writeText(roomUrl);
                toast.success("Link copied!");
              }}
            >
              <Copy className="h-4 w-4 mr-2" /> Copy link
            </Button>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Add emails..."
              className="bg-[#2C2C2C] border-blue-500/50 text-sm h-10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleInvite()}
              disabled={loading}
            />
            <Button
              onClick={handleInvite}
              disabled={loading || !email}
              className="bg-[#3C3C3C] text-gray-300"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
            </Button>
          </div>

          <div className="mt-2">
            <p className="text-xs text-gray-500 font-semibold mb-4">
              Who has access
            </p>
            {permissionsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : (
              <div className="space-y-4 max-h-[300px] overflow-y-auto">
                {/* Public Access Row */}
                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                      <Globe className="h-4 w-4 text-gray-400" />
                    </div>
                    <p className="text-sm">Anyone with the link</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {isPublic ? (
                      <Select
                        value={publicPermission?.access_level}
                        onValueChange={(v: "read-only" | "full") =>
                          changeAccessLevel(publicPermission!.id, v)
                        }
                      >
                        <SelectTrigger className="bg-transparent border-none text-xs text-gray-400 hover:text-white w-auto h-auto p-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#2C2C2C] border-gray-700">
                          <SelectItem value="read-only">can view</SelectItem>
                          <SelectItem value="full">can edit</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <button
                        onClick={() => togglePublic(true)}
                        className="text-xs text-gray-400 hover:text-white"
                      >
                        no access
                      </button>
                    )}
                    {isPublic && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100"
                        onClick={() => togglePublic(false)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Specific Users List */}
                {privatePermissions.map((perm) => (
                  <div
                    key={perm.id}
                    className="flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold uppercase">
                        {perm.users?.username?.[0] || "?"}
                      </div>
                      <div className="truncate max-w-[150px]">
                        <p className="text-sm truncate">
                          {perm.users?.username}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={perm.access_level}
                        onValueChange={(v: "read-only" | "full") =>
                          changeAccessLevel(perm.id, v)
                        }
                      >
                        <SelectTrigger className="bg-transparent border-none text-xs text-gray-400 hover:text-white w-auto h-auto p-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#2C2C2C] border-gray-700">
                          <SelectItem value="read-only">can view</SelectItem>
                          <SelectItem value="full">can edit</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100"
                        onClick={() => removeUser(perm.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Share;
