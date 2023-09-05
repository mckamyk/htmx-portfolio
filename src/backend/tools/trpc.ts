import {initTRPC} from '@trpc/server'
import { SiweMessage, generateNonce } from 'siwe'
import {z} from 'zod';

const t = initTRPC.create()

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
  nonce: t.procedure.query(() => generateNonce()),
  verify: t.procedure.input(verifyInput).query(async ({input, ctx}) => {
    const {message, signature} = input
    const siweMessage = new SiweMessage(message)
    const fields = siweMessage.verify(signature)
  })
})

export type AppRouter = typeof trpcRouter
