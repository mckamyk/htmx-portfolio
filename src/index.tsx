import { Elysia, t } from 'elysia'
import { html } from '@elysiajs/html'
import { swagger } from '@elysiajs/swagger'
import * as elements from 'typed-html'
import { Main } from './App'
import { SearchHeader } from './SearchHeader'
import { getBalance, getHistoricalBalances } from './search'
import {logger} from './logger'
import * as reth from './components/reth'
import * as prysm from './components/prysm'

export const app = new Elysia()
  .use(swagger())
  .use(logger())
  .use(html())
  .on('beforeHandle', (ctx) => {
    ctx.log.info(ctx.request)
  })
  .get('/', ({html, log, request}) => {
  return html(
    <BaseHtml>
      <body class="bg-slate-800">
        <SearchHeader />
        <div class="flex justify-center">
          <div hx-get="/main" hx-trigger="load" class="w-[1200px] mt-8" id="main" />
        </div>
      </body>
    </BaseHtml>
  )}).get("/main", () => <Main />)
  .post("/search", ({ body }) => getBalance(body.search), {
    body: t.Object({
      search: t.String()
    })
  })
  .post("/historical", ({ body }) => getHistoricalBalances(body.address), {
    body: t.Object({
      address: t.String()
    })
  })

reth.registerRouter(app)
prysm.registerRouter(app)

app.listen(3000)

console.log(`Listening at ${app.server?.hostname} on ${app.server?.port}`)


const BaseHtml = ({ children }: elements.Children) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="widget=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark">
  <title>Test Portfolio</title>
  <script src="https://unpkg.com/htmx.org@1.9.3"></script>
  <script src="https://unpkg.com/htmx.org/dist/ext/debug.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/hyperscript.org"></script>
</head>
${children}
`
