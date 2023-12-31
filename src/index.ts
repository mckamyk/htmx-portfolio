import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'
import { staticPlugin } from '@elysiajs/static'
import { logger, serverLog } from './logger'
import { Main, registerRoute } from './backend/main'
import {renderToString} from 'react-dom/server'
import { registerNonceRoute } from './backend/tools/nonce'
import {cookie as elysiaCookie} from '@elysiajs/cookie'
import {trpc} from '@elysiajs/trpc'
import { trpcRouter, createContext } from './backend/tools/trpc'

export const rootPage = (MainComponent: () => React.JSX.Element) => () => {
  const content = BaseHtml.replace("REPLACE_ME", renderToString(MainComponent()))
  return new Response(content, {headers: {'content-type': 'text/html'}})
}

export const childPage = (MainComponent: () => (React.JSX.Element | Promise<React.JSX.Element>)) => async () => {
  return new Response(renderToString(await MainComponent()), {headers: {'content-type': 'text/html; charset=utf-8'}})
}

export const app = new Elysia()
  .use(swagger())
  .use(logger())
  .use(elysiaCookie({

  }))
  .use(staticPlugin({
    assets: 'dist',
    alwaysStatic: true,
  }))
  .use(trpc(trpcRouter, {
    createContext
  }))
  .on('beforeHandle', ctx => {
    ctx.log.info(ctx.request)
  })
  .on('error', ctx => {
    serverLog.error(`${ctx.code} - ${ctx.request.url}`)
  })
  .get('/', rootPage(Main))
  
export type App = typeof app

registerRoute(app);
registerNonceRoute(app);

app.listen(3000)

console.log(`Listening at ${app.server?.hostname} on ${app.server?.port}`)

const BaseHtml = `
  <!DOCTYPE html> 
  <html lang="en">
    <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="color-scheme" content="dark" />
      <title>HTMX + Preact</title>
      <script src="https://unpkg.com/htmx.org@1.9.3"></script>
      <script src="https://unpkg.com/htmx.org/dist/ext/debug.js"></script>
      <script src="https://cdn.tailwindcss.com"></script>
      <script src="https://unpkg.com/hyperscript.org"></script>
      <script src="/public/wrapper.js" type="module"></script>
    </head>
    <body>
      REPLACE_ME
    </body>
  </html>
`
