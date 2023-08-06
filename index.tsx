import {Elysia, t} from 'elysia'
import {html} from '@elysiajs/html'
import {swagger} from '@elysiajs/swagger'
import * as elements from 'typed-html'

export const app = new Elysia()
  .use(swagger())
  .use(html())
  .get('/', ({ html }) => html(
  <BaseHtml>
    <body
      class="flex w-full h-screen justify-center items-center"
    />
  </BaseHtml>
)).listen(4000)

const BaseHtml = ({children}: elements.Children) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="widget=device-width, initial-scale=1.0">
  <title>Test Portfolio</title>
  <script src="https://unpkg.com/htmx.org@1.9.3"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/hyperscript.org"></script>
</head>
${children}
`
