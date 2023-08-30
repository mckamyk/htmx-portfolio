import { getLatestRethVersion } from '../connectors/reth'
import React from 'react';

export const RethInfo = async () => {
  const version = await getLatestRethVersion()

  return (
    <div className="w-full">
      <div className="text-center mb-2">{version}</div>
      <RethSync />
    </div>
  )
}

const RethSync = () => {
  // Reth has 13 Sync stages
  // Progress should be 0 -> Current block

  return (
    <div className="text-center bg-gray-600 rounded-md">
      Waiting on Prysm Sync
    </div>
  )
}

