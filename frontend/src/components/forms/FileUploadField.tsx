interface FileUploadFieldProps {
  onFileSelected: (file: File | null) => void;
  accept?: string;
}

export default function FileUploadField({ onFileSelected, accept = ".aedt,.aedtz" }: FileUploadFieldProps) {
  return (
    <label className="flex flex-col gap-2 text-sm">
      <span>Projeto HFSS (.aedt/.aedtz)</span>
      <input
        type="file"
        accept={accept}
        className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white"
        onChange={(event) => onFileSelected(event.target.files?.[0] ?? null)}
      />
    </label>
  );
}
