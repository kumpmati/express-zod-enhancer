import { z } from "zod"
import { ApiBuilder } from "../../lib"

export const helloRouter = new ApiBuilder()

helloRouter.get("/:name").handle((req, res) => res.status(200).json({ hello1: req.params.name }))

helloRouter
  .get("/")
  .query(z.object({ name: z.string() }))
  .handle((req, res) => res.status(200).json({ hello2: req.query.name }))
