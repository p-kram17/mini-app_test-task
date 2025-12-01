import { z } from "zod";

export const formStatusEnum = z.enum(["draft", "active", "archived"]);

export const formSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().nullable().optional(),
  fieldsCount: z.number().int().min(0).max(50),
  status: formStatusEnum,
  updatedAt: z.string().refine((s) => !Number.isNaN(Date.parse(s)), {
    message: "updatedAt must be an ISO date string",
  }),
});

export type Form = z.infer<typeof formSchema>;

export const formListSchema = z.array(formSchema);
