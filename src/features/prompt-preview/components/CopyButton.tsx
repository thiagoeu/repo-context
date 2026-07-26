interface CopyButtonProps {
  copied: boolean;
  disabled: boolean;
  onCopy: () => void;
}

export default function CopyButton({
  copied,
  disabled,
  onCopy,
}: CopyButtonProps) {
  return (
    <button
      type="button"
      onClick={onCopy}
      disabled={disabled}
      className={`flex items-center gap-2 rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${
        copied
          ? "bg-green-600 text-white"
          : "bg-zinc-100 text-zinc-950 hover:bg-white disabled:opacity-50"
      }`}
    >
      {copied ? "COPIADO! ✅" : "COPIAR"}
    </button>
  );
}
