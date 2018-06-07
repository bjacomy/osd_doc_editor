export default function (server) {

  // We can use this method, since we have set the require in the index.js to
  // elasticsearch. So we can access the elasticsearch plugins safely here.
  const call = server.plugins.elasticsearch.getCluster('data').callWithRequest

  // Register a GET API at /api/elasticsearch_status/indices that returns
  // an array of all indices in the elasticsearch. The server is actually an
  // HAPI server and the complete documentation of the "route" method can be
  // found in the official documentation: http://hapijs.com/api#serverrouteoptions
  server.route({
    path: '/api/label/indices',
    method: 'GET',
    // The handler method will be called with the request that was made to this
    // API and a reply method as 2nd parameter, that must be called with the
    // content, that should be returned to the client.
    handler(req, reply) {

      // The call method that we just got from elasticsearch has the following
      // syntax: the first parameter should be the request that actually came
      // from the client. The callWithRequest method will take care about
      // passing authentication data from kibana to elasticsearch or return
      // authorization requests, etc.
      // Second parameter to the function is the name of the javascript method
      // you would like to call, as you can find it here in the documentation:
      // https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/
      // The third parameter will be passed as a parameter to the javascript method
      // (it should contain the data you would have also passed to the client directly).
      // The method returns a promise, which will be resolved with the data returned
      // from Elasticsearch.
      call(req, 'cluster.state').then(function (response) {
        // Return just the names of all indices to the client.
        reply(
          Object.keys(response.metadata.indices)
        );
      });
    }
  });

  // Add a route to retrieve the status of an index by its name
  server.route({
    // We can use path variables in here, that can be accessed on the request
    // object in the handler.
    //path: '/api/label/index/{name}',
    path: '/api/label/search/{name}',
    method: 'GET',
    handler(req, reply) {
       call(req, 'search', {
           index: req.params.name,
           q:'*:*'
       }).then(function (response) {
             reply(response);
       });
    }
  });

  //GET /transactions/_search?q=type:sale
  server.route({
    // We can use path variables in here, that can be accessed on the request
    // object in the handler.
    //path: '/api/label/index/{name}',
    path: '/api/label/{name}/_search',
    method: 'POST',
    handler(req, reply) {
       call(req, 'search', {
           index: req.params.name,
           body: req.payload
       }).then(function (response) {
             reply(response);
       });
    }
  });

  /*server.route({
    // We can use path variables in here, that can be accessed on the request
    // object in the handler.
    //path: '/api/label/index/{name}',
    path: '/api/label/{name}/_search',
    method: 'POST',
    handler(req, reply) {
       call(req, 'search', {
          index: req.params.name,
          scroll: '1m',
          body: req.payload
       }).then(function (response) {
             reply(response);
       });
    }
  });*/


  //GET mapping
  server.route({
        path: '/api/label/{index}/_mapping',
        method: 'GET',
        handler(req, reply) {
            call(req, 'indices.getMapping', {
                index: req.params.index,
                type: req.params.type,
            })
            .then(function (err, response) {
                if(err)
                    reply(err);
                else
                    reply(response);
            });
        }
    });

  //PUT mapping
  server.route({
        path: '/api/label/{index}/_mapping/{type}',
        method: 'PUT',
        handler(req, reply) {
            call(req, 'indices.putMapping', {
                index: req.params.index,
                type: req.params.type,
                body: req.payload
            })
            .then(function (err, response) {
                if(err)
                    reply(err);
                else
                    reply(response);
            });
        }
    });

  //Add label value
  server.route({
        path: '/api/label/{index}/{type}/{id}/_update',
        method: 'POST',
        handler(req, reply) {
            call(req, 'update', {
                index: req.params.index,
                type: req.params.type,
                id: req.params.id,
                body: req.payload
            })
            .then(function (err, response) {
                if(err)
                    reply(err);
                else
                    reply(response);
            });
        }
    });

    //Add label value update by query
    server.route({
          path: '/api/label/{index}/_update_by_query',
          method: 'POST',
          handler(req, reply) {
              call(req, 'updateByQuery', {
                  index: req.params.index,
                  body: req.payload,
                  conflicts:'proceed'
              })
              .then(function (err, response) {
                  if(err)
                      reply(err);
                  else
                      reply(response);
              });
          }
      });

};
