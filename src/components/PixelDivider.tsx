export function PixelDivider() {
  return (
    <div className="w-full bg-paper py-10">
      <div className="max-w-6xl mx-auto px-6 flex items-center gap-4">
        <div className="flex-1 h-px bg-line" />
        <div className="flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-lohix-green" />
          <span className="w-1 h-1 rounded-full bg-lohix-green/60" />
          <span className="w-1 h-1 rounded-full bg-lohix-green/30" />
        </div>
        <div className="flex-1 h-px bg-line" />
      </div>
    </div>
  );
}
