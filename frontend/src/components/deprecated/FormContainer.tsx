import type { FormHTMLAttributes, ReactNode } from 'react';

interface FormContainerProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
  title?: string;
}

export default function FormContainer({ children, title, className = '', ...props }: FormContainerProps) {
  return (
    <form
      className={`mx-auto max-w-md space-y-4 p-6 ${className}`}
      {...props}
    >
      {title && <h1 className="text-2xl font-semibold text-white mb-6">{title}</h1>}
      {children}
    </form>
  );
}
