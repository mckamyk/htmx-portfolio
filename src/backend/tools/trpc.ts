import {initTRPC} from '@trpc/server'
import { SiweMessage, generateNonce } from 'siwe'
import {z} from 'zod';
import { serverLog } from '../../logger';
import { FetchCreateContextFn, FetchCreateContextFnOptions} from '@trpc/server/adapters/fetch';
import cookie from 'cookie'
import jwt from 'jsonwebtoken'
import {config} from 'dotenv'
config();

const jwtSecret = Bun.env.JWT_SECRET
if (!jwtSecret) throw new Error("No JWT_SECRET found")

type TrpcContext = {
  appCookie: AppCookie,
  setCookie: (cookie: AppCookie) => void,
  resetCookie: () => void,
  jot: string,
}

const t = initTRPC.context<TrpcContext>().create()

const verifyInput = z.object({
  message: z.any(),
  signature: z.string().startsWith("0x")
})

export const trpcRouter = t.router({
  nonce: t.procedure.output(z.string()).query(({ctx}) => {
    const {appCookie, setCookie} = ctx
    appCookie.nonce = generateNonce();
    setCookie(appCookie)
    return appCookie.nonce
  }),
  verify: t.procedure.input(verifyInput).output(z.boolean()).query(async ({ctx, input}) => {
    const {appCookie, setCookie, resetCookie} = ctx
    const {message, signature} = input
    const siweMessage = new SiweMessage(message)
    const fields = await siweMessage.verify({signature})
    if (fields.data.nonce !== appCookie.nonce) {
      resetCookie()
      return false
    } else if (fields.success) {
      appCookie.address = fields.data.address
      setCookie(appCookie)
      return true
    } else {
      resetCookie()
      return false
    }
  }),
  isVerified: t.procedure.output(z.boolean()).query(({ctx}) => {
    return isJwtValid(ctx.jot)
  })
})

export type AppRouter = typeof trpcRouter

export const createContext: FetchCreateContextFn<AppRouter> = ({req, resHeaders}) => {
  const jot = req.headers.get("cookie") || ""
  const appCookie = parseCookies(jot)

  const setCookie = (cookie: AppCookie) => {
    try {
      appCookieStruct.parse(cookie)
      setAppCookies(resHeaders, cookie)
    } catch (e) {
      serverLog.error(`Tried to set invalid app cookie ${e}`)
    }
  }

  const resetCookie = () => {
    resHeaders.set("Set-Cookie", cookie.serialize('app', '{}'))
  }

  return {
    appCookie,
    setCookie,
    resetCookie,
    jot
  }
}

const appCookieStruct = z.object({
  address: z.string().startsWith("0x").optional(),
  nonce: z.string().optional(),
})

type AppCookie = z.infer<typeof appCookieStruct>

const getAppCookie = (cookieHeader?: string | null)  => {
  const cookies = cookie.parse(cookieHeader || "")
  return cookies.app
}

const parseCookies = (cookieString?: string | null) => {
  const appCookie = getAppCookie(cookieString);
  const token = jwt.verify(appCookie, jwtSecret)

  if (typeof token === 'string') return {} as AppCookie

  try {
    return appCookieStruct.parse(token.payload)
  } catch {
    return {} as AppCookie
  }
}

const isJwtValid = (jot: string) => {
  try {
    jwt.verify(jot, jwtSecret)
    return true
  } catch {
    return false
  }
}

const setAppCookies = (res: FetchCreateContextFnOptions['resHeaders'], appCookie: AppCookie) => {
  const jot = jwt.sign(appCookie, jwtSecret)
  res.set("Set-Cookie", cookie.serialize('app', jot))
}

