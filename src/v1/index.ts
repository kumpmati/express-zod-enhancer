import { z } from "zod"
import { ApiBuilder } from "../../lib"

export const v1 = new ApiBuilder()

v1.endpoint("/")
  .method("get")
  .body(z.object({ a: z.string() }))
  .query(z.object({ c: z.string() }))
  .handle((req, res) => {
    res.status(200).json({ ok: true })
  })

v1.endpoint("/hello")
  .method("get")
  .query(z.object({ name: z.string() }))
  .handle((req, res) => res.status(200).json({ hello: req.params }))

v1.endpoint("/hello/:name")
  .method("get")
  .handle((req, res) => res.status(200).json({ hello: req.params.name }))
