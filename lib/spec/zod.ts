import { oas30 } from "openapi3-ts"
import { ZodObject, ZodRawShape } from "zod"
import zodToJsonSchema from "zod-to-json-schema"

export const zodSchemaToOpenApiParams = <T extends ZodRawShape>(
  _in: oas30.ParameterLocation,
  schema: ZodObject<T>
) => {
  if (!schema) return []

  const arr: oas30.ParameterObject[] = []

  const keys = Object.keys(schema.keyof().Values)

  for (const key of keys) {
    arr.push({
      in: _in,
      name: key,
      schema: zodToJsonSchema(schema.shape[key]) as any,
      required: !schema.shape[key].isOptional(),
    })
  }

  return arr
}
