'use client';

import { Providers } from '@/providers/providers';
import { FC, ReactNode } from 'react';

interface ClientWrapperProps {
  children: ReactNode;
}

export const ClientWrapper: FC<ClientWrapperProps> = ({ children }) => {
  return <Providers>{children}</Providers>;
};
