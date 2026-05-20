"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Button } from "./button";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

const Dialog: React.FC<DialogProps> = ({ open, onClose, title, description, children, className }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in"
        onClick={onClose}
      />
      {/* Content */}
      <div
        className={cn(
          "relative z-50 w-full max-w-lg scale-100 rounded-lg border bg-background p-6 shadow-lg animate-in fade-in zoom-in-95",
          className
        )}
      >
        <div className="flex items-center justify-between mb-4">
          {title && <h2 className="text-lg font-semibold">{title}</h2>}
          <Button variant="ghost" size="icon" onClick={onClose} className="ml-auto">
            <X className="h-4 w-4" />
          </Button>
        </div>
        {description && <p className="text-sm text-muted-foreground mb-4">{description}</p>}
        <div>{children}</div>
      </div>
    </div>
  );
};

export { Dialog };