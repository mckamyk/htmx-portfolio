import * as elements from 'typed-html'

export const Main = () => (
  <div class="flex justify-center gap-8">
    <div class="border-2 border-gray-500 rounded-md p-2 w-[250px]">
      <div class="text-center">Reth</div>
      <div hx-trigger="load" hx-get="/reth/version" hx-ext="debug">
        <div class="flex flex-col w-full items-center">
          <div class="animate-pulse rounded-md bg-gray-600 h-6 w-2/3 mb-2" />
          <div class="animate-pulse rounded-md bg-gray-600 h-6 w-full" />
        </div>
      </div>
    </div>

    <div class="border-2 border-gray-500 rounded-md p-2 w-[250px]">
      <div class="text-center">Prysm</div>
      <div hx-trigger="load" hx-get="/prysm/info" hx-ext="debug">
        <div class="flex flex-col items-center">
          <div class="animate-pulse rounded-md bg-gray-600 h-6 w-2/3 mb-2" />
          <div class="animate-pulse rounded-md bg-gray-600 h-6 w-full" />
        </div>
      </div>
    </div>
  </div>
)

