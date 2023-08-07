import { Elysia, t } from 'elysia'
import { html } from '@elysiajs/html'
import { swagger } from '@elysiajs/swagger'
import * as elements from 'typed-html'
import { Main } from './src/App'
import { SearchHeader } from './src/SearchHeader'
import { getBalance, getHistoricalBalances } from './src/search'

const app = new Elysia()
  .use(swagger())
  .use(html())
  .get('/', ({ html }) => html(
    <BaseHtml>
      <body class="bg-slate-800">
        <SearchHeader />
        <div class="flex justify-center">
          <div hx-get="/main" hx-trigger="load" class="w-[1200px] mt-8" id="main" />
        </div>
      </body>
    </BaseHtml>
  )).get("/main", () => <Main />)
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

app.listen(3000)

const BaseHtml = ({ children }: elements.Children) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="widget=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark">
  <title>Test Portfolio</title>
  <script src="https://unpkg.com/htmx.org@1.9.3"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/hyperscript.org"></script>
</head>
${children}
`
