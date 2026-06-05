import type { ReactNode } from "react";

export function ToolCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="tool-card">
      <h1>{title}</h1>
      <p className="subtitle">{description}</p>
      <div className="tool-body">{children}</div>
    </section>
  );
}
