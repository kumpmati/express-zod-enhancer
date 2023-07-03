import { z } from "zod"
import { endpoint } from "../../lib/builder"

export const healthEndpoint = endpoint<"/health">()
  .meta({
    title: "Get health",
    description: "returns ok",
    tags: ["Health"],
    responseDescription: "vastaa ok jos kaikki ok",
    errorDescription: "kaikki ei ole ok",
  })
  .response(z.object({ ok: z.boolean() }))
  .handle((req, res) => res.status(200).json({ ok: true }))
  .build()

export const healthPostEndpoint = endpoint<"/health/:b">()
  .meta({ title: "Post Health", description: "does stuff but POST", tags: ["Health"] })
  .schema({
    body: z.object({ status: z.number().min(5).max(100) }),
    query: z.object({}),
    params: z.object({ b: z.string() }),
    response: z.object({
      a: z.boolean(),
      helloWorldEndpoint: z.object({ version: z.string(), name: z.string() }),
      dogs: z.array(z.string()),
    }),
  })
  .handle(async (req, res) =>
    res.status(200).json({
      a: true,
      helloWorldEndpoint: { version: "0.0.1", name: "boing" },
      dogs: ["moi", "hei"],
    })
  )
  .build()
