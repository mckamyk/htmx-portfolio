import {z} from 'zod'

const promTimeFieldType = z.object({
  name: z.string(),
  type: z.literal("time"),
  typeInfo: z.object({
    frame: z.literal('time.Time'),
  }),
  config: z.object({
    interval: z.number()
  })
})

const promNumberFieldType = z.object({
  name: z.string(),
  type: z.literal('number'),
  typeInfo: z.object({
    frame: z.literal('float64')
  }),
  labels: z.record(z.string()),
  config: z.object({
    displayNameFromDS: z.string()
  })
})

const promTypes = z.union([promNumberFieldType, promTimeFieldType])

export type PrometheusReturn = {
  results: {
    [key: string]: {
      status: number,
      frames: PrometheusReturnFrame[]
    }
  }
}

const promReturnFrame = z.object({
  schema: z.object({
    refId: z.string(),
    meta: z.object({
      typeVersion: z.array(z.number()),
      executedQueryString: z.string(),
    }),
    fields: z.array(promTypes)
  }),
  data: z.object({
    values: z.tuple([
      z.array(z.number().transform(n => new Date(n))),
      z.array(z.any())
    ]).transform(timeValPairs => {
      const newVals: [Date, any][] = []
      const [ts, vs] = timeValPairs
      ts.forEach((t, i) => {
        newVals.push([t, vs[i]])
      })
      return newVals;
    })
  })
})

export const promReturn = z.object({
  results: z.record(z.object({
    status: z.number(),
    frames: z.array(promReturnFrame)
  }))
})


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
