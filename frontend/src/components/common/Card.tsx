import { ReactNode } from "react";

interface CardProps {
  title?: string;
  children: ReactNode;
}

export default function Card({ title, children }: CardProps) {
  return (
    <section className="card">
      {title && <h2 className="text-sm uppercase tracking-wide text-slate-400 mb-2">{title}</h2>}
      {children}
    </section>
  );
}
