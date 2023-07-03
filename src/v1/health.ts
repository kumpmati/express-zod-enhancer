import { endpoint } from "../../lib/builder"

export const healthEndpoint = endpoint()
  .meta({ title: "Get health", description: "returns ok", tags: ["health"] })
  .handle((req, res) => res.status(200).json({ ok: true }))
  .build()
