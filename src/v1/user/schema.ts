import { z } from "zod"

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.number().min(0),
  role: z.enum(["admin", "dog"]),
})
