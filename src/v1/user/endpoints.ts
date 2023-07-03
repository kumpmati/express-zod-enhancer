import { z } from "zod"
import { endpoint } from "../../../lib/builder"
import { userSchema } from "./schema"
import { AppError } from "../../utils/AppError"

const users: z.infer<typeof userSchema>[] = []

export const createUser = endpoint<"/users/new">()
  .meta({
    title: "Create",
    description: "Adds a new user to the list of users",
    tags: ["User"],
  })
  .schema({
    body: z.object({ name: z.string() }),
    params: z.object({}),
    query: z.object({}),
    response: userSchema,
  })
  .handle(async (req, res) => {
    const user = {
      id: Math.random().toString(),
      name: req.body.name,
      createdAt: Date.now(),
      role: "dog",
    } as const

    users.push(user)

    return res.status(200).json(user)
  })
  .build()

export const getUsers = endpoint<"/users">()
  .meta({ title: "Get all", description: "Lists all users", tags: ["User"] })
  .response(z.array(userSchema))
  .handle(async (_, res) => res.status(200).json(users))
  .build()

export const deleteUser = endpoint<"/users/:id">()
  .meta({ title: "Delete", description: "Removes an user from the system", tags: ["User"] })
  .response(z.never())
  .params(z.object({ id: z.string() }))
  .handle((req, res, next) => {
    const i = users.findIndex((i) => i.id === req.params.id)
    if (i === -1) {
      return next(new AppError(404, "not found"))
    }

    users.splice(i, 1)

    return res.status(201).end()
  })
  .build()

export const getMe = endpoint<"/users/me">()
  .meta({ title: "Me", description: "Returns the current user", tags: ["User"] })
  .response(userSchema)
  .handle((req, res, next) => {
    if (users.length === 0) return next(new AppError(404, "user not found"))

    return res.status(200).json(users[0])
  })
  .build()
