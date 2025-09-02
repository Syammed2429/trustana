"use client";

import { Providers } from "@/providers/providers";

interface ClientWrapperProps {
  children: React.ReactNode;
}

export function ClientWrapper({ children }: ClientWrapperProps) {
  return <Providers>{children}</Providers>;
}
