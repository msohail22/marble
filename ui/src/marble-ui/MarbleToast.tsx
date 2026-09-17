import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle2, Info, AlertCircle } from "lucide-react";

export type ToastVariant = "success" | "error" | "info";

{
  /*
   open: for the user to tell is open or not 
   onOpenChange: for the user to tell if the onopenwhat to keep here 
   message: message for the toast 
   variant: so like we have ToastVariant type here right so like for that type, just success or failure or something 
   duration: how much time in ms do you want the toast to appear for here 
   */
}

export interface ToastProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: string;
  variant?: ToastVariant;
  duration?: number;
}
