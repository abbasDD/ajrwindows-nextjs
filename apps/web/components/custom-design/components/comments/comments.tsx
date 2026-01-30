"use client";

import { ClientSideSuspense } from "@liveblocks/react";
import { CommentsOverlay } from "./comments-overlay";

export const Comments = () => (
  <ClientSideSuspense fallback={null}>
    {() => <CommentsOverlay />}
  </ClientSideSuspense>
);
