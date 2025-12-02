export default function Loader({ message = "Carregando" }: { message?: string }) {
  return <p className="text-slate-400 animate-pulse">{message}...</p>;
}
