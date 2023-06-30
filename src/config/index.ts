import "dotenv/config"
import { z } from "zod"

const envSchema = z.object({
  PORT: z.string(),
})

export const ENV = envSchema.parse(process.env)
