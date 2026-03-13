import { Link } from "react-router-dom";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-gradient-to-b from-[#2563EB]/5 to-transparent px-4 py-12">
      <div className="w-full max-w-[450px]">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-block text-2xl font-bold">
            <span className="text-[#2563EB]">Smile</span>
            <span className="text-foreground">Fit</span>
          </Link>
        </div>

        <div className="rounded-xl bg-white p-8 shadow-lg dark:bg-card">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
