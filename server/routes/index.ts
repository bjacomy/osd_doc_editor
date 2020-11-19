import { IRouter } from '../../../../src/core/server'
import { schema } from '@kbn/config-schema'
import { Body } from './types'

// Pattern for a simple route
export function defineRoutes(router: IRouter) {
  router.get(
    {
      path: '/api/doc_editor/example',
      validate: false
    },
    async (context, request, response) => {
      return response.ok({
        body: {
          time: new Date().toISOString(),
        }
      })
    }
  )

    // GET indices
    router.get(
      {
        path: '/api/doc-editor/indices',
        validate: false
      },
      async (context, request, response) => {
        try {
          const data = await context.core.elasticsearch.legacy.client.callAsCurrentUser('cluster.state')
            // Return just the names of all indices to the client.
            return response.ok({
              body: {
                data: Object.keys(data.metadata.indices)
              }
            })
        } catch (err) {
          console.log('Error getting indices: ', err)
          return response.notFound()
        }
      }
    )

    // POST search
    router.post(
      {
        path: '/api/doc-editor/{name}/_search',
        validate: {
          params: schema.object(
            {name: schema.string()}
          ),
          body: schema.object(
            {from: schema.maybe(schema.number()),
              size:  schema.maybe(schema.number()),
              sort: schema.maybe(schema.any()),
              query: schema.maybe(schema.any())}
          )
        }
      },
      async (context, request, response) => {
        try {
          const data = await context.core.elasticsearch.legacy.client.callAsCurrentUser('search', {
            index: request.params.name,
            body: request.body
          })
          return response.ok({body: data})
        } catch (err) {
          console.log('Error searching: ', err)
          return response.notFound()
        }
    })

    // POST search for completion
    // Return top 10 cardinality for {field} begining optionaly with <req.query.beginwith> in index <req.params.name>
    // This endpoint do not permit aggregation on nested field
    router.get(
      {
        path: '/api/doc-editor/{name}/_hits/{field}',
        validate: {
          params: schema.object(
            {
              name: schema.string(),
              field: schema.string()
            }
          ),
          query: schema.any()
        }
      },
      async (context, request, response) => {

        let body: Body = {
          aggs: {
            suggest: {
              terms: {
                field: request.params.field,
                size: 10
              }
            }
          },
          size: 0
        }

        // Search for a prefix in the query string is given
        let prefixValue = request.query.beginwith
        if (prefixValue) {
          body = {
            ...body,
            query: {
              prefix: {
                [request.params.field]: prefixValue
              }
            }
          }
        }

        try {
          const data = (await context.core.elasticsearch.legacy.client.callAsCurrentUser('search', {
            index: request.params.name,
            body
          })).aggregations.suggest.buckets
          return response.ok({body: data})
        } catch (err) {
          console.log('Error searching top 10: ', err)
          return response.notFound()
        }
      }
    )

    //GET mapping
    router.get(
      {
        path: '/api/doc-editor/{index}/_mapping',
        validate: {
          params: schema.object(
            {index: schema.string()}
          )
        }
      },
      async (context, request, response) => {
        try {
          const data = await context.core.elasticsearch.legacy.client.callAsCurrentUser('indices.getMapping', {
            index: request.params.index
          })
          return response.ok({body: data})
        } catch (err) {
          console.log('Error getting mapping: ', err)
          return response.notFound()
        }
      }
    )

    //PUT mapping. Adds new fields to an existing index or changes the search settings of existing fields.
    router.put(
      {
        path: '/api/doc-editor/{index}/_mapping',
        validate: {
          params: schema.object(
            {index: schema.string()}
          ),
          body: schema.any()
        }
      },
      async (context, request, response) => {
        try {
          const data = await context.core.elasticsearch.legacy.client.callAsCurrentUser('indices.putMapping', {
            index: request.params.index,
            body: request.body
          })
          return response.ok({body: data})
        } catch (err) {
          console.log('Error putting mapping: ', err)
          return response.notFound()
        }
      }
    )

    // Update one or multiple documents by ids
    router.post(
      {
        path: '/api/doc-editor/{index}/_doc/{ids}/_update',
        validate: {
          params: schema.object(
            {ids: schema.string(), index: schema.string()}
          ),
          body: schema.any()
        }
      },
      async (context, request, response) => {
        try {
          const ids = request.params.ids.split(",")
          const updateAllResult = await Promise.all(
            ids.map(async id => {
              return context.core.elasticsearch.legacy.client.callAsCurrentUser('update', {
                index: request.params.index,
                body: {doc: request.body},
                refresh: true,
                id
              })
            })
          )
          return response.ok({body: updateAllResult})
        } catch (err) {
          console.log('Error updating any document by id: ', err)
          return response.notFound()
        }
      }
   )

    // Update by query
    router.post(
      {
        path: '/api/doc-editor/{index}/_doc/_update_by_query',
        validate: {
          params: schema.object(
            {index: schema.string()}
          ),
           body: schema.any()
        }
      },
      async (context, request, response) => {
        try {
          const data = await context.core.elasticsearch.legacy.client.callAsCurrentUser('updateByQuery', {
            index: request.params.index,
            body: JSON.stringify(request.body),
            conflicts: 'proceed',
            refresh: true
          })
          return response.ok({body: data})
        } catch (err) {
          console.log('Error update by query: ', err)
          return response.notFound()
        }
      }
    )

    // Add new document
    router.post(
      {
        path: '/api/doc-editor/{index}/_doc',
        validate: {
          params: schema.object(
            {index: schema.string()}
          ),
           body: schema.any()
        }
      },
      async (context, request, response) => {
        try {
          const data = await context.core.elasticsearch.legacy.client.callAsCurrentUser('index', {
            index: request.params.index,
            body: request.body,
            refresh: true
          })
          return response.ok({body: data})
        } catch (err) {
          console.log('Error adding document: ', err)
          return response.notFound()
        }
      }
    )

    // Delete one or multiple document by ids
    router.delete(
      {
        path: '/api/doc-editor/{index}/_doc/{ids}',
        validate: {
          params: schema.object(
            {ids: schema.string(), index: schema.string()}
          )
        }
      },
      async (context, request, response) => {
        try {
          const ids = request.params.ids.split(",")
          const deleteAll = await Promise.all(
            ids.map(async id => {
              return context.core.elasticsearch.legacy.client.callAsCurrentUser('delete', {
                index: request.params.index,
                refresh: true,
                id
              })
            })
          )
          return response.ok({body: deleteAll})
        } catch (err) {
          console.log('Error deleting any document by id: ', err)
          return response.notFound()
        }
      }
    )

    // Delete documents by query
    router.post(
      {
        path: '/api/doc-editor/{index}/_doc/_delete_by_query',
        validate: {
          params: schema.object(
            {index: schema.string()}
          ),
           body: schema.any()
        }
      },
      async (context, request, response) => {
        try {
          const data = await context.core.elasticsearch.legacy.client.callAsCurrentUser('deleteByQuery', {
            index: request.params.index,
            body: request.body,
            refresh: true,
            conflicts: 'proceed'
          })
          return response.ok({body: data})
        } catch (err) {
          console.log('Error deleting documents by query: ', err)
          return response.notFound()
        }
      }
    )

}
