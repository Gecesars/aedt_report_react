interface Props {
  error: string | undefined;
}

export default function ErrorMessage({ error }: Props) {
  if (!error) return null;
  return <p className="text-red-400">{error}</p>;
}
