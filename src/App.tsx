import * as elements from 'typed-html'

export const Main = () => (
  <div class="flex justify-center gap-8">
    <div class="border-2 border-gray-500 rounded-md p-2 w-[250px]">
      <div class="text-center">Reth</div>
      <div hx-trigger="load" hx-get="/reth/version" hx-ext="debug">
        <div class="flex flex-col w-full items-center">
          <div class="h-6 w-full animate-pulse bg-gray-600 rounded-md" />
        </div>
      </div>
    </div>

    <div class="border-2 border-gray-500 rounded-md p-2 w-[250px]">
      <div class="text-center">Prysm</div>
      <div hx-trigger="load" hx-get="/prysm/info" hx-ext="debug">
        <div class="flex flex-col items-center">
          <div class="animate-pulse rounded-t-md bg-gray-500 w-2/3  h-6" />
          <div class="animate-pulse rounded-md bg-gray-500 w-full h-6" />
        </div>
      </div>
    </div>
  </div>
)

