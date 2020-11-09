import { IRouter } from '../../../../src/core/server';
import { schema } from '@kbn/config-schema';

export function defineRoutes(router: IRouter) {
  router.get(
    {
      path: '/api/doc_editor/example',
      validate: false,
    },
    async (context, request, response) => {
      return response.ok({
        body: {
          time: new Date().toISOString(),
        },
      });
    }
  );

    // GET indices
    router.get(
      {
        path: '/api/doc-editor/indices',
        validate: false
      },
      async (context, request, response) => {
        try {
          const data = await context.core.elasticsearch.legacy.client.callAsInternalUser('cluster.state')
            // Return just the names of all indices to the client.
            return response.ok({
              body: {
                data: Object.keys(data.metadata.indices)
              }
            })
        } catch (err) {
          console.log('error _search request: ', err)
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
          body: schema.any()
        }
      },
      async (context, request, response) => {
        try {
          const data = await context.core.elasticsearch.legacy.client.callAsInternalUser('search', {
            index: request.params.name,
            body: request.body
          })
          return response.ok({body: data})
        } catch (err) {
          console.log('error _search request: ', err)
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
        let body = {
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
          const data = (await context.core.elasticsearch.legacy.client.callAsInternalUser('search', {
            index: request.params.name,
            body: request.body
          })).body.aggregations.suggest.buckets
          return response.ok({body: data})
        } catch (err) {
          console.log('error _search request: ', err)
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
          const data = await context.core.elasticsearch.legacy.client.callAsInternalUser('indices.getMapping', {
            index: request.params.index
          })
          return response.ok({body: data})
        } catch (err) {
          console.log('error mapping data ', err)
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
          const data = await context.core.elasticsearch.legacy.client.callAsInternalUser('indices.putMapping', {
            index: request.params.index,
            body: request.body
          })
          return response.ok({body: data})
        } catch (err) {
          console.log('error mapping data ', err)
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
          const updateAll = Promise.all(
            ids.map(async id => {
              return await context.core.elasticsearch.legacy.client.callAsInternalUser('update', {
                index: request.params.index,
                body: request.body,
                refresh: true,
                id
              })
            })
          )
          return response.ok({body: updateAll})
        } catch (err) {
          console.log('error mapping data ', err)
          return response.notFound()
        }
      }
   )

    // server.route({
    //   path: '/api/doc-editor/{index}/_doc/{ids}/_update',
    //   method: 'POST',
    //   async handler(req) {
    //     const ids = req.params.ids.split(",")
    //     return Promise.all(
    //       ids.map(async id => {
    //         return await call(req, 'update', {
    //           index: req.params.index,
    //           body: {
    //             doc: req.payload
    //           },
    //           refresh: true,
    //           id
    //         })
    //       })
    //     )
    //   }
    // })


    /*
    // Update by query
    server.route({
      path: '/api/doc-editor/{index}/_doc/_update_by_query',
      method: 'POST',
      async handler(req) {
        return await call(req, 'updateByQuery', {
          index: req.params.index,
          body: JSON.stringify(req.payload),
          conflicts: 'proceed',
          refresh: true
        })
      }
    })

    // Add new document
    server.route({
      path: '/api/doc-editor/{index}/_doc',
      method: 'POST',
      async handler(req) {
        return await call(req, 'index', {
          index: req.params.index,
          body: req.payload,
          refresh: true
        })
      }
    })

    // Delete one or multiple document by ids
    server.route({
      path: '/api/doc-editor/{index}/_doc/{ids}',
      method: 'DELETE',
      async handler(req) {
        const ids = req.params.ids.split(",")
        return Promise.all(
          ids.map(async id => {
            return await call(req, 'delete', {
              index: req.params.index,
              id: id,
              refresh: true
            })
          })
        )
      }
    })

    // Delete documents by query
    server.route({
      path: '/api/doc-editor/{index}/_doc/_delete_by_query',
      method: 'POST',
      async handler(req) {
        return await call(req, 'deleteByQuery', {
          index: req.params.index,
          body: req.payload,
          conflicts: 'proceed',
          refresh: true
        })
      }
    })
    */
}
