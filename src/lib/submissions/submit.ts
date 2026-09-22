import { createServerFn } from "@tanstack/react-start";
import { handleDealer, handleWarranty, type Payload } from "@/server/submissions.handlers";
import type { SubmitResult } from "./schemas";

// Form endpoints. The browser gets an RPC stub; the handler bodies (and the
// server-only code they call) are compiled into the server bundle only.

export const submitWarranty = createServerFn({ method: "POST" })
  .inputValidator((data: Payload) => data)
  .handler(({ data }): Promise<SubmitResult> => handleWarranty(data));

export const submitDealerEnquiry = createServerFn({ method: "POST" })
  .inputValidator((data: Payload) => data)
  .handler(({ data }): Promise<SubmitResult> => handleDealer(data));
