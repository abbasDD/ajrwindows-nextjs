"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link2, Check } from "lucide-react";
import { useUserStore } from "@/store/use-user-store";

const Share = () => {
  const { user } = useUserStore();
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (!user) return;
    const shareUrl = `${window.location.origin}/?roomId=${user.id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-3 px-5 py-4 border-t border-primary-grey-200">
      <h3 className="text-xs uppercase">Collaboration</h3>

      <Button
        className="w-full bg-primary-blue-100 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleCopyLink}
        disabled={!user}
      >
        {copied ? (
          <Check className="mr-2 h-4 w-4" />
        ) : (
          <Link2 className="mr-2 h-4 w-4" />
        )}
        {user ? "Copy Invite Link" : "Login to Share"}
      </Button>

      {!user && (
        <p className="text-[10px] text-primary-grey-300 italic">
          Guests cannot share rooms.
        </p>
      )}
    </div>
  );
};

export default Share;
