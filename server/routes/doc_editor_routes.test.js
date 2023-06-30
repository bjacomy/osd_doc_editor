import Hapi from '@hapi/hapi'
import docEditorRoutes from './doc_editor_routes'
import sample1 from '../../sample_data/sample1.json'
import sample2 from '../../sample_data/sample1.json'
import sample3 from '../../sample_data/sample1.json'
import mapping1 from '../../sample_data/mapping1.json'
import mapping2 from '../../sample_data/mapping2.json'
import mapping3 from '../../sample_data/mapping3.json'

// BEGIN Init elasticsearc client
import { Client } from '@elastic/opensearch'

const esClient = new Client({node: 'http://localhost:9200'})

async function esHealth () {
  const result = await esClient.cat.health({format: 'json', v: true})

  return result
}

esHealth().then((health) => {
  console.log('es health status: ', health.body[0].status)
})
// END Init elasticsearc client

// BEGIN Init Hapi server
const MockDataCluster = {
  callWithRequest (req, esParams, esBody) {
    const splitEsParams = esParams.split('.')
    if (splitEsParams.length > 1) {
      return  esClient[splitEsParams[0]][splitEsParams[1]](esBody)
    }
    return esClient[splitEsParams[0]](esBody)
  }
}

const server = Hapi.server({
    port: 3000,
    host: 'localhost'
})

docEditorRoutes(server, {}, MockDataCluster)

const init = async () => {

    await server.initialize()
    return server
}

const start = async () => {

    await server.start()
    return server
}

process.on('unhandledRejection', (err) => {

    process.exit(1)
})
// END Init Hapi server

let serverTest

beforeAll(async () => {
  try {
    await esClient.indices.delete({index: 'melvis-stacks'})
    await esClient.indices.delete({index: 'melvis-platforms'})
    await esClient.indices.delete({index: 'melvis-index-stats'})  
  } catch (err) {
    // nothing
  }

  try {
    await esClient.indices.create({
      index: 'melvis-stacks',
      body: mapping1
    })
    await esClient.indices.create({
      index: 'melvis-platforms',
      body: mapping2
    })
    await esClient.indices.create({
      index: 'melvis-index-stats',
      body: mapping3
    })
  } catch(err) {
    console.log('failed create melvis-stacks: ', err)
  }

  try {
    await esClient.bulk({
      refresh: 'wait_for',
      body: sample1
    })
      
    await esClient.bulk({
      refresh: 'wait_for',
      body: sample2
    })
    await esClient.bulk({
      refresh: 'wait_for',
      body: sample3
    })
  } catch (err) {
    console.log('error bulk')
  }
  serverTest = await init()
})

afterAll(async () => {
  await serverTest.stop()
})

describe('Another example GET /api/doc-editor/example', () => {
  it('responds with 200 and a time property', async () => {
      const res = await serverTest.inject({
          method: 'get',
          url: '/api/doc-editor/example'
      })
      expect(res.result).toHaveProperty('time')
      expect(res.statusCode).toBe(200)
  })
})

describe('Retrieve index list. GET /api/doc-editor/indices', () => {
  MockDataCluster.callWithRequest = jest.fn(() => {return Promise.resolve({
      metadata: {indices: {"melvi-platforms": {}, "melvis-stacks": {}, "melvis-index-stats": {}}}
    })
  })
  it('responds with 200 and an array of es index name.', async () => {
    const res = await serverTest.inject({
        method: 'get',
        url: '/api/doc-editor/indices'
    })
    expect(res.statusCode).toBe(200)
    expect(res.result).toEqual(expect.arrayContaining(["melvis-platforms", "melvis-stacks", "melvis-index-stats"]))
  })
})

describe('Search for documents in index. POST /api/doc-editor/{name}/_search', () => {
  it('responds with es request result.', async () => {
    const res = await serverTest.inject({
      method: 'post',
      url: '/api/doc-editor/melvis-stacks/_search'
    })
    expect(res.result.body).toHaveProperty('took', 'time_out', '_shard', 'hits.total.value', 'hits.total.relation', 'hits.max_score', 'hits.hits')
  })
  it('responds with error 500 when index parameter in url do not exist.', async () => {
    const res = await serverTest.inject({
      method: 'post',
      url: '/api/doc-editor/i_do_not_exist/_search'
    })
    expect(res.statusCode).toBe(500)
    expect(res.result).toEqual({"error": "Internal Server Error", "message": "An internal server error occurred", "statusCode": 500})
  })
})

describe('Search for completion. POST /api/doc-editor/{name}/_hits/{field}', () => {
  it('responds with top 10 (max) cardinality for field platformId', async () => {
    const res = await serverTest.inject({
      method: 'get',
      url: '/api/doc-editor/melvis-stacks/_hits/platformId'
    })
    expect(res.statusCode).toBe(200)
    expect(res.result).toEqual(expect.arrayContaining([expect.objectContaining({key: expect.any(String), doc_count: expect.any(Number)})]))
  })
  it('responds with top 10 (max) cardinality for field platformId begining with "ref"', async () => {
    const res = await serverTest.inject({
      method: 'get',
      url: '/api/doc-editor/melvis-stacks/_hits/platformId?beginwith=ref'
    })
    expect(res.statusCode).toBe(200)
    expect(res.result).toEqual(expect.arrayContaining([expect.objectContaining({key: expect.stringMatching(/^ref.*/), doc_count: expect.any(Number)})]))
  })
  it('responds with empty array if field do not exist or field is a nested one.', async () => {
    const res = await serverTest.inject({
      method: 'get',
      url: '/api/doc-editor/melvis-stacks/_hits/contacts.mail'
    })
    expect(res.statusCode).toBe(200)
    expect(res.result).toEqual([])
  })
  it('responds with error 500 when index parameter in url do not exist.', async () => {
    const res = await serverTest.inject({
      method: 'get',
      url: '/api/doc-editor/i_do_not_exist/_hits/platformId'
    })
    expect(res.statusCode).toBe(500)
    expect(res.result).toEqual({"error": "Internal Server Error", "message": "An internal server error occurred", "statusCode": 500})
  })
})

describe('Get mapping /api/doc-editor/{index}/_mapping', () => {
  it('responds with an es mapping.', async () => {
    const res = await serverTest.inject({
      method: 'get',
      url: '/api/doc-editor/melvis-stacks/_mapping'
    })
    expect(res.statusCode).toBe(200)
    expect(res.result.body).toHaveProperty('melvis-stacks.mappings')
  })
  it('responds with error 500 when index parameter in url do not exist.', async () => {
    const res = await serverTest.inject({
      method: 'get',
      url: '/api/doc-editor/i_do_not_exist/_mapping'
    })
    expect(res.statusCode).toBe(500)
    expect(res.result).toEqual({"error": "Internal Server Error", "message": "An internal server error occurred", "statusCode": 500})
  })
})

describe('Put mapping on one existing index /api/doc-editor/{index}/_mapping', () => {
  beforeAll(async () => {
    await esClient.indices.create({index: 'test-api'})
  })

  afterAll(async () => {
    await esClient.indices.delete({index: 'test-api'})
  })

  // // mapping type is no longer used in es 7.x
  // see https://www.elastic.co/guide/en/opensearch/reference/7.x/removal-of-types.html
  const mappingTest = {
    "properties": {
      "title":  { "type": "text"}
    }
  }

  it('Responds with statusCode 200 and ', async () => {
    const res = await serverTest.inject({
      method: 'put',
      url: '/api/doc-editor/test-api/_mapping',
      payload: mappingTest
    })
    expect(res.statusCode).toBe(200)
    expect(res.result.body).toEqual({ acknowledged: true })
  })
  it('responds with error 500 when index parameter in url do not exist.', async () => {
    const res = await serverTest.inject({
      method: 'put',
      url: '/api/doc-editor/i_do_not_exist/_mapping',
      payload: mappingTest
    })
    expect(res.statusCode).toBe(500)
    expect(res.result).toEqual({"error": "Internal Server Error", "message": "An internal server error occurred", "statusCode": 500})
  })
})

describe('Update one or multiple documents by ids /api/doc-editor/{index}/_doc/{ids}/_update', () => {
  beforeAll(async () => {
    await esClient.indices.create({
      "index": "test-api",
      "body": {
        "settings": {
            "number_of_shards": 1
        },
        "mappings": {
            "properties": {
                "isbn": {"type": "keyword"},
                "title" : {"type": "text" }
            }
        }
      }
    })
    await esClient.index({"id": "abc", "index": "test-api", "type": "_doc", "body": {"isbn": "abc", "title": "book abc"}})
    await esClient.index({"id": "def", "index": "test-api", "type": "_doc", "body": {"isbn": "def", "title": "book def"}})
  })

  afterAll(async () => {
    await esClient.indices.delete({index: 'test-api'})
  })

  it('Responds with statusCode 200 and ', async () => {
    const res = await serverTest.inject({
      method: 'post',
      url: '/api/doc-editor/test-api/_doc/abc,def/_update',
      payload: {title: 'same'}
    })
    expect(res.statusCode).toBe(200)
    // expect(res.result).toEqual([
    //   {
    //     "_id": "abc", "_index": "test-api", "_primary_term": 1, "_seq_no": expect.any(Number),
    //     "_shards": {"failed": 0, "successful": 1, "total": 2},
    //     "_type": "_doc", "_version": 2, "forced_refresh": true, "result": "updated"
    //   },
    //   {
    //     "_id": "def", "_index": "test-api", "_primary_term": 1, "_seq_no": expect.any(Number),
    //   "_shards": {"failed": 0, "successful": 1, "total": 2},
    //   "_type": "_doc", "_version": 2, "forced_refresh": true, "result": "updated"
    //   }
    // ])
  })
  it('responds with error 500 when index parameter in url do not exist.', async () => {
    const res = await serverTest.inject({
      method: 'put',
      url: '/api/doc-editor/i_do_not_exist/_doc/abc,def/_update'
    })
    expect(res.statusCode).toBe(404)
    expect(res.result).toEqual({"error": "Not Found", "message": "Not Found", "statusCode": 404})
  })
})

describe('Update documents by query /api/doc-editor/{index}/_doc/_update_by_query', () => {
  beforeAll(async () => {
    await esClient.indices.create({
      "index": "test-api2",
      "body": {
        "settings": {
            "number_of_shards": 1
        },
        "mappings": {
            "properties": {
                "isbn": {"type": "keyword"},
                "title" : {"type": "text" },
                "likes": {"type": "integer"}
            }
        }
      }
    })
    await esClient.index({"id": "abc", "index": "test-api2", "type": "_doc", "refresh": "wait_for", "body": {"isbn": "abc", "title": "book abc", "likes": 0}})
    await esClient.index({"id": "def", "index": "test-api2", "type": "_doc", "refresh": "wait_for", "body": {"isbn": "def", "title": "book def", "likes": 0}})
  })

  const payload = {
    "script": {
      "source": "ctx._source.likes++",
      "lang": "painless"
    },
    "query": {
      "term": {
        "isbn": {"value": "abc", "boost": 1.0}
      }
    }
  }

  afterAll(async () => {
    await esClient.indices.delete({index: 'test-api2'})
  })

  it('Responds with statusCode 200 and a result report.', async () => {
    const res = await serverTest.inject({
      method: 'post',
      url: '/api/doc-editor/test-api2/_doc/_update_by_query',
      payload
    })
    expect(res.statusCode).toBe(200)
    expect(res.result.body).toEqual(
      {
        "batches": expect.any(Number), "deleted": expect.any(Number), "failures": [], "noops": expect.any(Number), "requests_per_second": expect.any(Number),
        "retries": {"bulk": expect.any(Number), "search": expect.any(Number)},
        "throttled_millis": expect.any(Number), "throttled_until_millis": expect.any(Number),
        "timed_out": false, "took": expect.any(Number), "total": expect.any(Number), "updated": expect.any(Number), "version_conflicts": expect.any(Number)
      }
    )
  })
  it('responds with error 500 when index parameter in url do not exist.', async () => {
    const res = await serverTest.inject({
      method: 'post',
      url: '/api/doc-editor/i_do_not_exist/_doc/_update_by_query',
      payload
    })
    expect(res.statusCode).toBe(500)
    expect(res.result).toEqual({"error": "Internal Server Error", "message": "An internal server error occurred", "statusCode": 500})
  })
})

describe('Add new document /api/doc-editor/{index}/_doc', () => {
  beforeAll(async () => {
    await esClient.indices.create({
      "index": "test-api3",
      "body": {
        "settings": {
            "number_of_shards": 1
        },
        "mappings": {
            "properties": {
                "isbn": {"type": "keyword"},
                "title" : {"type": "text" },
                "likes": {"type": "integer"}
            }
        }
      }
    })
    await esClient.index({"id": "abc", "index": "test-api3", "type": "_doc", "refresh": "wait_for", "body": {"isbn": "abc", "title": "book abc", "likes": 0}})
    await esClient.index({"id": "def", "index": "test-api3", "type": "_doc", "refresh": "wait_for", "body": {"isbn": "def", "title": "book def", "likes": 0}})
  })

  afterAll(async () => {
    await esClient.indices.delete({index: 'test-api3'})
  })

  const payload = {"id": "ghi", "index": "test-api3", "type": "_doc", "refresh": "wait_for", "body": {"isbn": "ghi", "title": "book ghi", "likes": 0}}
  
  it('Responds with a report that the document was created.', async () => {
    const res = await serverTest.inject({
      method: 'post',
      url: '/api/doc-editor/test-api3/_doc',
      payload
    })
    expect(res.result.body).toEqual(
      { _index: 'test-api3',
        _type: '_doc',
        _id: expect.any(String),
        _version: 1,
        result: 'created',
        forced_refresh: true,
        _shards: { total: 2, successful: 1, failed: 0 },
        _seq_no: expect.any(Number),
        _primary_term: 1
      }
    )
  })
  it('responds with error 500 when index parameter in url do not exist.', async () => {
    const res = await serverTest.inject({
      method: 'put',
      url: '/api/doc-editor/i_do_not_exist/_doc',
      payload
    })
    expect(res.statusCode).toBe(404)
    expect(res.result).toEqual({"error": "Not Found", "message": "Not Found", "statusCode": 404})
  })
})

describe('Delete one or multiple document by ids /api/doc-editor/{index}/_doc/{ids}', () => {
  beforeAll(async () => {
    await esClient.indices.create({
      "index": "test-api3",
      "body": {
        "settings": {
            "number_of_shards": 1
        },
        "mappings": {
            "properties": {
                "isbn": {"type": "keyword"},
                "title" : {"type": "text" },
                "likes": {"type": "integer"}
            }
        }
      }
    })
    await esClient.index({"id": "abc", "index": "test-api3", "type": "_doc", "refresh": "wait_for", "body": {"isbn": "abc", "title": "book abc", "likes": 0}})
    await esClient.index({"id": "def", "index": "test-api3", "type": "_doc", "refresh": "wait_for", "body": {"isbn": "def", "title": "book def", "likes": 0}})
  })

  afterAll(async () => {
    await esClient.indices.delete({index: 'test-api3'})
  })

  it('Responds with a report that the document was created.', async () => {
    const res = await serverTest.inject({
      method: 'delete',
      url: '/api/doc-editor/test-api3/_doc/abc,def'
    })
    expect(res.result[0]).toEqual(
      { body:
        { _index: 'test-api3',
          _type: '_doc',
          _id: 'abc',
          _version: 2,
          result: 'deleted',
          forced_refresh: expect.any(Boolean),
          _shards: expect.any(Object),
          _seq_no: expect.any(Number),
          _primary_term: 1 },
       statusCode: 200,
       headers:
        { 'content-type': 'application/json; charset=UTF-8',
          'content-length': '181' },
       warnings: null,
       meta:
        { context: null,
          request: expect.any(Object),
          name: 'opensearch-js',
          connection: expect.any(Object),
          attempts: expect.any(Number),
          aborted: expect.any(Boolean) } }
    )
  })
  it('Responds with an error 500 when the document was not found.', async () => {
    const res = await serverTest.inject({
      method: 'delete',
      url: '/api/doc-editor/test-api3/_doc/xyz'
    })
    expect(res.statusCode).toBe(500)
    expect(res.result).toEqual({"error": "Internal Server Error", "message": "An internal server error occurred", "statusCode": 500})
  })
  it('responds with error 500 when index parameter in url do not exist.', async () => {
    const res = await serverTest.inject({
      method: 'delete',
      url: '/api/doc-editor/i_do_not_exist/_doc/abc,def'
    })
    expect(res.statusCode).toBe(500)
    expect(res.result).toEqual({"error": "Internal Server Error", "message": "An internal server error occurred", "statusCode": 500})
  })
})

describe('Delete documents by query /api/doc-editor/{index}/_doc/_delete_by_query', () => {
  beforeAll(async () => {
    await esClient.indices.create({
      "index": "test-api2",
      "body": {
        "settings": {
            "number_of_shards": 1
        },
        "mappings": {
            "properties": {
                "isbn": {"type": "keyword"},
                "title" : {"type": "text" },
                "likes": {"type": "integer"}
            }
        }
      }
    })
    await esClient.index({"id": "abc", "index": "test-api2", "type": "_doc", "refresh": "wait_for", "body": {"isbn": "abc", "title": "book abc", "likes": 0}})
    await esClient.index({"id": "def", "index": "test-api2", "type": "_doc", "refresh": "wait_for", "body": {"isbn": "def", "title": "book def", "likes": 0}})
    await esClient.index({"id": "defo", "index": "test-api2", "type": "_doc", "refresh": "wait_for", "body": {"isbn": "def", "title": "book def", "likes": 0}})
  })

  const payload = {
    "query": {
      "term": {
        "isbn": {"value": "def", "boost": 1.0}
      }
    }
  }

  afterAll(async () => {
    await esClient.indices.delete({index: 'test-api2'})
  })

  it('Responds with statusCode 200 and a result reporting 2 deleted documents.', async () => {
    const res = await serverTest.inject({
      method: 'post',
      url: '/api/doc-editor/test-api2/_doc/_delete_by_query',
      payload
    })
    expect(res.statusCode).toBe(200)
    expect(res.result.body).toEqual(
      {
        "took" : expect.any(Number),
        "timed_out": false,
        "total": expect.any(Number),
        "deleted": 2,
        "batches": 1,
        "version_conflicts": 0,
        "noops": 0,
        "retries": {
          "bulk": 0,
          "search": 0
        },
        "throttled_millis": 0,
        "requests_per_second": -1.0,
        "throttled_until_millis": 0,
        "failures" : [ ]
      }
    )
  })
  it('Responds with statusCode 200 and a result reporting 0 deleted documents.', async () => {
    const res = await serverTest.inject({
      method: 'post',
      url: '/api/doc-editor/test-api2/_doc/_delete_by_query',
      payload: {
        "query": {
          "term": {
            "isbn": {"value": "zyz", "boost": 1.0}
          }
        }
      }
    })
    expect(res.statusCode).toBe(200)
    expect(res.result.body).toEqual(
      {
        "took" : expect.any(Number),
        "timed_out": false,
        "total": expect.any(Number),
        "deleted": 0,
        "batches": 0,
        "version_conflicts": 0,
        "noops": 0,
        "retries": {
          "bulk": 0,
          "search": 0
        },
        "throttled_millis": 0,
        "requests_per_second": -1.0,
        "throttled_until_millis": 0,
        "failures" : [ ]
      }
    )
  })
  it('responds with error 500 when index parameter in url do not exist.', async () => {
    const res = await serverTest.inject({
      method: 'post',
      url: '/api/doc-editor/i_do_not_exist/_doc/_delete_by_query',
      payload
    })
    expect(res.statusCode).toBe(500)
    expect(res.result).toEqual({"error": "Internal Server Error", "message": "An internal server error occurred", "statusCode": 500})
  })
})