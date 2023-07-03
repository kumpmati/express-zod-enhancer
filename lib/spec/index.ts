import { type Express } from "express"
import { oas30 } from "openapi3-ts"
import { listAllRoutes } from "./traverser"
import { zodToJsonSchema } from "zod-to-json-schema"
import { z } from "zod"
import { zodSchemaToOpenApiParams } from "./zod"
import { createFixture } from "zod-fixture"

/**
 * Given an express application, generates an OpenAPI specification from all endpoints built using the
 * endpoint builder.
 * @param app
 * @param info
 * @returns
 */
export const generateSpec = (app: Express, info?: oas30.InfoObject) => {
  const doc = new oas30.OpenApiBuilder()

  doc.addInfo(info ?? { title: "API", version: "0.0.1" })

  const routes = listAllRoutes(app)

  for (const route of routes) {
    const item: oas30.PathItemObject = {}

    const op: oas30.OperationObject = {
      summary: route.info?.meta.title,
      description: route.info?.meta.description,
      tags: route.info?.meta.tags,
      deprecated: route.info.meta.deprecated,
      parameters: [
        ...zodSchemaToOpenApiParams("query", route.info.querySchema),
        ...zodSchemaToOpenApiParams("path", route.info.paramsSchema),
      ],
      requestBody: route.info.bodySchema
        ? {
            content: {
              "application/json": {
                schema: zodToJsonSchema(route.info?.bodySchema ?? z.any()) as any,
                example: createFixture(route.info.bodySchema),
              },
            },
          }
        : undefined,
      responses: {
        "200": {
          description: route.info.meta.responseDescription,
          content: route.info.responseSchema
            ? {
                "application/json": {
                  schema: zodToJsonSchema(route.info?.responseSchema ?? z.any()) as any,
                },
              }
            : undefined,
        },
        "400": {
          description: route.info.meta.errorDescription,
          content: {
            "application/json": {
              schema: zodToJsonSchema(z.object({ error: z.string() })),
            },
          },
        },
      },
    }

    ;(item as any)[route.method] = op
    doc.addPath("/" + route.path, item)
  }

  return doc
}
