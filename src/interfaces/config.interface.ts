import { z } from "zod";
import { Version } from "../classes/version";

export const Config = z.object({
  deleteIfExists: z.boolean().optional(),
  write: z
    .object({
      fileName: z.string(),
      getContent: z.function().args(z.instanceof(Version)).returns(z.string()),
    })
    .optional(),
  patch: z.instanceof(RegExp).optional(),
  minor: z.instanceof(RegExp).optional(),
  major: z.instanceof(RegExp).optional(),
});

export type Config = z.infer<typeof Config>;
