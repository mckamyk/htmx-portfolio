import * as elements from 'typed-html'

export const Main = () => (
  <div class="flex justify-center gap-8">
    <div class="border-2 border-gray-500 rounded-md p-2 w-[250px]">
      <div class="text-center">Reth Version</div>
      <div hx-trigger="load" hx-get="/reth/version" hx-ext="debug">
        <div class="h-6 animate-pulse bg-gray-600 rounded-md" />
      </div>
    </div>

    <div class="border-2 border-gray-500 rounded-md p-2 w-[250px]">
      <div class="text-center">Prysm Version</div>
      <div hx-trigger="load" hx-get="/prysm/version" hx-ext="debug">
        <div class="h-6 animate-pulse bg-gray-600 rounded-md" />
      </div>
    </div>

  </div>
)

