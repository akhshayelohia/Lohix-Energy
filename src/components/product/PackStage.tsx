import { PackRender } from "./PackRender";

// Placeholder showcase for 2W models until product photography is uploaded.
export function PackStage({ voltage, capacity }: { voltage: string; capacity: string }) {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 flex items-center justify-center px-6">
        <div className="animate-float aspect-[420/500] h-full max-h-[720px] max-w-full">
          <PackRender
            voltage={voltage}
            capacity={capacity}
            className="h-full w-full drop-shadow-[0_60px_80px_rgba(0,0,0,0.6)]"
          />
        </div>
      </div>
    </div>
  );
}
