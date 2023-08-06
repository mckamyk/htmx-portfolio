import {Elysia} from 'elysia'
import {html} from '@elysiajs/html'
import {swagger} from '@elysiajs/swagger'
import * as elements from 'typed-html'
import { Main } from './src/App'

const app = new Elysia()
  .use(swagger())
  .use(html())
  .get('/', ({ html }) => html(
  <BaseHtml>
    <body
      class="flex w-full h-screen bg-slate-800"
      hx-get="/main"
      hx-trigger="load"
      hx-swap="outerHTML"
    />
  </BaseHtml>
)).get("/main", () => <Main />)

app.listen(3000)

const BaseHtml = ({children}: elements.Children) => `
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
