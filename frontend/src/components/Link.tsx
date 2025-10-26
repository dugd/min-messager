import type { ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';

interface LinkProps {
  to: string;
  children: ReactNode;
  className?: string;
}

export default function Link({ to, children, className = '' }: LinkProps) {
  return (
    <RouterLink
      to={to}
      className={`text-[#0088cc] hover:text-[#0077b3] transition-colors ${className}`}
    >
      {children}
    </RouterLink>
  );
}
