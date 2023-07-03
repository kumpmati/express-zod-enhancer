import { Router } from "express"
import { endpoint } from "../../lib/builder"
import { z } from "zod"

export const helloRouter = Router()

helloRouter.get(
  "/",
  ...endpoint()
    .meta({ title: "hello with query params", tags: ["Hello"] })
    .query(z.object({ name: z.string(), lastName: z.string().optional() }))
    .response(z.object({ hello: z.string() }))
    .handle((req, res) =>
      res.status(200).json({ hello: req.query.name + req.query.lastName ?? "" })
    )
    .build()
)

helloRouter.get(
  "/name/:num",
  ...endpoint<"/name/:num">()
    .meta({ title: "hello with name param", description: "does stuff", tags: ["Hello"] })
    .params(z.object({ num: z.string() }))
    .response(z.object({ world: z.string() }))
    .handle((req, res) => res.status(200).json({ world: req.params.num }))
    .build()
)
