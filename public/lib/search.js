

export function getQueryDslBySearchText(query) {

  return query.trim() ?  
    { query_string: { query }} :
    { match_all: {} }
}