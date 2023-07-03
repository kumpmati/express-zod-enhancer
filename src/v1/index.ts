import { Router } from "express"
import { healthEndpoint, healthPostEndpoint } from "./health"
import { userRouter } from "./user/router"

export const v1 = Router()

v1.get("/", ...healthEndpoint)
v1.post("/:test", ...healthPostEndpoint)
v1.use("/users", userRouter)
