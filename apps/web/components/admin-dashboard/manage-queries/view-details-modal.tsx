"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CornerUpLeft, Mail, Calendar, User, Hash } from "lucide-react";
import { formatTimestamp } from "@/lib/utils";

interface ViewDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  query: {
    id: string | number;
    name: string;
    email: string;
    message: string;
    created_at: string;
  } | null;
}

export default function ViewDetailsModal({
  isOpen,
  onClose,
  query,
}: ViewDetailsModalProps) {
  if (!query) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl  border-white/10 text-white p-0 overflow-hidden shadow-2xl">
        <div className="p-6 space-y-6">
          {/* Header */}
          <DialogHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-4">
            <div className="space-y-1">
              <DialogTitle className="text-sm font-medium text-white/50 flex items-center gap-2">
                <Hash size={14} />
                Reference ID: {query.id}
              </DialogTitle>
              <h2 className="text-xl font-semibold tracking-tight">
                Customer Query
              </h2>
            </div>
          </DialogHeader>

          {/* Contact Info Grid */}
          <div className="grid grid-cols-2 gap-y-6 gap-x-4">
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                <User size={12} /> Name
              </p>
              <p className="text-sm font-medium text-white/90">{query.name}</p>
            </div>

            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                <Mail size={12} /> Email Address
              </p>
              <a
                href={`mailto:${query.email}`}
                className="text-sm font-medium text-secondary hover:underline underline-offset-4"
              >
                {query.email}
              </a>
            </div>

            <div className="col-span-2 space-y-1.5">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                <Calendar size={12} /> Received On
              </p>
              <p className="text-sm font-medium text-white/90">
                {formatTimestamp(query.created_at)}
              </p>
            </div>
          </div>

          {/* Message Content */}
          <div className="space-y-3">
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
              Message
            </p>
            <div className="bg-white/[0.03] border border-white/10 text-white/80 p-5 rounded-lg leading-relaxed text-sm min-h-[100px] whitespace-pre-wrap shadow-inner">
              {query.message}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-white/5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                Status
              </p>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-xs text-white/70">Awaiting Response</span>
              </div>
            </div>

            <a
              href={`mailto:${query.email}?subject=Re: Your Inquiry - ${query.name}`}
              className="no-underline"
            >
              <Button
                variant="secondary"
                className="bg-secondary hover:opacity-90 text-black font-bold h-10 px-6 rounded-md text-xs flex items-center gap-2 transition-all active:scale-95"
              >
                <CornerUpLeft size={16} />
                Send Reply
              </Button>
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
