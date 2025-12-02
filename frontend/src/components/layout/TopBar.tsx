import { ReactNode } from "react";

interface TopBarProps {
  rightSlot?: ReactNode;
}

export default function TopBar({ rightSlot }: TopBarProps) {
  return (
    <header className="h-16 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-900/80">
      <div>
        <p className="text-sm uppercase tracking-widest text-slate-500">HFSS Dashboard</p>
        <p className="text-lg font-semibold">Monitoramento e Controle</p>
      </div>
      <div>{rightSlot}</div>
    </header>
  );
}
