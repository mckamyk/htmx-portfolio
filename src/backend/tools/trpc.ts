import {initTRPC} from '@trpc/server'
import { SiweMessage, generateNonce } from 'siwe'
import type { TrpcContext } from '../..';
import {z} from 'zod';
import { serverLog } from '../../logger';

const t = initTRPC.context<TrpcContext>().create()

const verifyInput = z.object({
  message: z.string(),
  signature: z.object({
    signature: z.string(),
    time: z.string().optional(),
    domain: z.string().optional(),
    nonce: z.string().optional(),
  })
})

export const trpcRouter = t.router({
  nonce: t.procedure.output(z.string()).query(({ctx}) => {
    const nonce = generateNonce()
    ctx.setCookie('nonce', nonce)
    return nonce
  }),
  verify: t.procedure.input(verifyInput).query(async ({ctx}) => {
    const nonce = ctx.getCookies().nonce
    if (!nonce) serverLog.error("No nonce found!")

    return `Got nonce ${nonce} from cookie`
  })
})

export type AppRouter = typeof trpcRouter
