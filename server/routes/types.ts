export type Body = {
  aggs: {
    suggest: {
      terms: {
        field: string,
        size: number
      }
    }
  },
  size: number,
  query?: {
    prefix: {
      [key: string]: string
    }
  }
}
