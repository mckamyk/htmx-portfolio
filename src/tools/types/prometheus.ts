export type PrometheusReturn = {
  results: {
    [key: string]: {
      status: number,
      frames: PrometheusReturnFrame[]
    }
  }
}

type PrometheusReturnFrame = {
  schema: {
    refId: string,
    meta: {
      typeVersion: number[],
      executedQueryString: string,
    },
    fields: any[]
  },
  data: {
    values: [number[], number[]]; // timestamps, returned metrics
  }
}
