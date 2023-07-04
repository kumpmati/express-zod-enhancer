# Express Zod Enhancer

Enhance your express routes with OpenAPI metadata and typesafe request-responses using [Zod](https://zod.dev/).

## Examples

## Basic usage

To enhance a route, wrap a normal express handler in the `enhance` function.

```ts
const mySchema = z.object({ a: z.array(z.string()) })

const myHandler = (req, res) => res.status(200).json({ a: ["b", "c"] })

// you can give the handler directly inside the enhance function ...
const enhancedHandler = enhance(myHandler)
  .meta({
    /* ...OpenAPI spec metadata */
  })
  .response(mySchema)
  .build() // make sure to call .build() last

// ... or you can provide it using the `.handle` function.
const enhancedHandler = enhance()
  .meta({
    /* ...OpenAPI spec metadata */
  })
  .response(mySchema)
  .handle(myHandler)
  .build() // make sure to call .build() last

// The enhanced handler can be used like a normal express handler
app.get("/some/route/1", enhancedHandler)

// Sometimes you need to spread the handler to fix type errors
app.get("/some/route/2", ...enhancedHandler)
```

## Path parameter

You can give the `enhance` function the express route path that it will be mounted on to give additional type safety.
This allows the enhance function to infer which route parameters are possible to have, and will throw an error if you
try and include route parameters that are not possible.

```ts
// works
const enhancedHandler = enhance<"/:id">(myHandler)
  .meta({ title: "my handler" })
  .params(z.object({ id: z.string() }))
  .build()

// won't work
const enhancedHandler = enhance<"/:id">(myHandler)
  .meta({ title: "my handler" })
  .params(z.object({ name: z.string() })) // name doesn't match the `id` param in the route
  .build()
```

## OpenAPI

All enhanced routes must have at least some OpenAPI metadata. This decision was made to try and ensure the APIs made using it would have sufficient documentation.
