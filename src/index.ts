import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'
import { staticPlugin } from '@elysiajs/static'
import { logger } from './logger'
import { Main, registerRoute } from './backend/main'
import ReactDomServer from 'react-dom/server'
import { makePromise } from './backend/tools/typeGuards'

export const app = new Elysia()
  .use(swagger())
  .use(logger())
  .use(staticPlugin({
    assets: 'dist',
    alwaysStatic: true,
  }))
  .on('beforeHandle', ctx => {
    ctx.log.info(ctx.request)
  })
  .get('/', () => {
    const content = BaseHtml.replace("REPLACE_ME", ReactDomServer.renderToString(Main()))
    return new Response(content, {headers: {'content-type': 'text/html'}})
  })

app.group("", app => {
  app.on('afterHandle', async (_, foo ) => {
    const content = await foo
    const rsp = (content: string) => new Response(content, {headers: {'content-type': 'text/html'}})
    if (typeof foo === typeof "") return rsp(content)
    return rsp(ReactDomServer.renderToString(content))
  })
  registerRoute(app as unknown as Elysia);
  return app
})

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
    </head>
    <body>
      REPLACE_ME
    </body>
  </html>
`
