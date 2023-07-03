import { EndpointBuilder } from "../../lib/endpoint"

export const healthEndpoint = new EndpointBuilder()
  .method("get")
  .handle((req, res) => res.status(200).json({ ok: true }))
