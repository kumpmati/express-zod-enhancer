import { Router } from "express"
import { helloRouter } from "./name"
import { healthEndpoint } from "./health"
import { endpoint } from "../../lib/builder"

export const v1 = Router()

v1.get("/health", healthEndpoint)
v1.use("/hello", helloRouter)

v1.post(
  "/health",
  endpoint()
    .meta({ title: "Post Health", description: "does stuff but POST", tags: ["health"] })
    .handle((req, res) => res.status(200).json({ ok: true }))
    .build()
)
