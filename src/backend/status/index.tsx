import React from 'react'

export const Status = () => (
  <div className="mt-8 flex justify-center gap-8">
    <div className="border-2 border-gray-500 rounded-md p-2 w-[250px]">
      <div className="text-center">Reth</div>
      <div hx-trigger="load" hx-get="/status/reth" hx-ext="debug">
        <div className="flex flex-col w-full items-center">
          <div className="animate-pulse rounded-md bg-gray-600 h-6 w-2/3 mb-2" />
          <div className="animate-pulse rounded-md bg-gray-600 h-6 w-full" />
        </div>
      </div>
    </div>

    <div className="border-2 border-gray-500 rounded-md p-2 w-[250px]">
      <div className="text-center">Prysm</div>
      <div hx-trigger="load" hx-get="/status/prysm" hx-ext="debug">
        <div className="flex flex-col items-center">
          <div className="animate-pulse rounded-md bg-gray-600 h-6 w-2/3 mb-2" />
          <div className="animate-pulse rounded-md bg-gray-600 h-6 w-full" />
        </div>
      </div>
    </div>
  </div>
)
