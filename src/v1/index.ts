import { Router } from "express"
import { helloRouter } from "./name"
import { healthEndpoint, healthPostEndpoint } from "./health"
import { userRouter } from "./user/router"

export const v1 = Router()

v1.get("/", ...healthEndpoint)
v1.post("/", ...healthPostEndpoint)
v1.use("/hello", helloRouter)
v1.use("/users", userRouter)
