export default function (server, adminCluster, dataCluster) {

  // Route example from the opensearchDashboards generate plugin
  server.route({
    path: '/api/doc-editor/example',
    method: 'GET',
    handler() {
      return { time: (new Date()).toISOString() }
    }
  })

  const call = dataCluster.callWithRequest

  // The server is actually an HAPI server and the complete documentation of the "route" method can be
  // found in the official documentation: http://hapijs.com/api#serverrouteoptions

  // GET indices
  server.route({
    path: '/api/doc-editor/indices',
    method: 'GET',
    async handler(req) {
      // Return just the names of all indices to the client.
      return await call(req, 'cluster.state').then((response) => {
        if(response.metadata) {
          return Object.keys(response.metadata.indices)
        } 
        // for es client : "@elastic/opensearch": "^7.4.0"
        return Object.keys(response.body.metadata.indices)
      })
    }
  })

  // POST search
  server.route({
    path: '/api/doc-editor/{name}/_search',
    method: 'POST',
    async handler(req) {
      return await call(req, 'search', {
        index: req.params.name,
        body: req.payload
      })
    }
  })

  // POST search for completion
  // Return top 10 cardinality for {field} begining optionaly with <req.query.beginwith> in index <req.params.name>
  // This endpoint do not permit aggregation on nested field
  server.route({
    path: '/api/doc-editor/{name}/_hits/{field}',
    method: 'GET',
    async handler(req) {
      let body = {
        aggs: {
          suggest: {
            terms: {
              field: req.params.field,
              size: 10
            }
          }
        },
        size: 0
      }
      
      // Search for a prefix in the query string is given
      let prefixValue = req.query.beginwith
      if (prefixValue) {
        body = {
          ...body,
          query: {
            prefix: { 
              [req.params.field]: prefixValue 
            }
          }
        }
      }

      return (await call(req, 'search', {
        index: req.params.name,
        body
      })).body.aggregations.suggest.buckets
    }
  })

  //GET mapping
  server.route({
    path: '/api/doc-editor/{index}/_mapping',
    method: 'GET',
    async handler(req) {
      let getMappingParams = {
        index: req.params.index
      }
      return await call(req, 'indices.getMapping', getMappingParams)
    }
  })

  //PUT mapping. Adds new fields to an existing index or changes the search settings of existing fields.
  server.route({
    path: '/api/doc-editor/{index}/_mapping',
    method: 'PUT',
    async handler(req) {
      return await call(req, 'indices.putMapping', {
        index: req.params.index,
        body: req.payload
      })
    }
  })

  // Update one or multiple documents by ids
  server.route({
    path: '/api/doc-editor/{index}/_doc/{ids}/_update',
    method: 'POST',
    async handler(req) {
      const ids = req.params.ids.split(",")
      return Promise.all(
        ids.map(async id => {
          return await call(req, 'update', {
            index: req.params.index,
            body: {
              doc: req.payload
            },
            refresh: true,
            id
          })
        })
      )
    }
  })

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
}