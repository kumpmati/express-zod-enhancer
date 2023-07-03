import { Router } from "express"
import { createUser, deleteUser, getMe, getUsers } from "./endpoints"

export const userRouter = Router()

userRouter.post("/new", ...createUser)
userRouter.get("/", ...getUsers)
userRouter.get("/me", ...getMe)
userRouter.delete("/:id", ...deleteUser)
