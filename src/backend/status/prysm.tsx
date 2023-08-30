import React from 'react';
import { getAltPrysmSync, getLatestConsensusVersion, getPrysmSync } from '../connectors/prysm'

export const PrysmInfo = async () => {
  const [version, syncInfo, altSyncInfo] = await Promise.all([
    getLatestConsensusVersion(),
    getPrysmSync(),
    getAltPrysmSync()
  ])

  const calculatePrysmSync = (info: typeof syncInfo) => {
    const {head_slot, sync_distance} = info
    const total = sync_distance + head_slot;
    return Math.round((head_slot/total)*100)
  }

  const pct = calculatePrysmSync(syncInfo)
  const altpct = calculatePrysmSync(altSyncInfo)

  return (
    <div className="w-full">
      <PrysmVersion version={version} />
      <PrysmSync pct={pct} />
      <PrysmSync pct={altpct} />
    </div>
  )
}

const PrysmVersion = ({version}: {version: string}) => {
  return (
    <div className="text-center mb-2">{version}</div>
  )
}

const PrysmSync = ({pct}: {pct: number}) => {
  return (
    <div className={`relative rounded-md overflow-clip h-6 w-full]`}>
      <div className={`bg-gray-600 w-full h-6`} />
      <div className={`absolute left-0 top-0 w-[${pct}%] bg-sky-600 h-6 animate-pulse`} />
      <div className="absolute left-0 top-0 w-full text-center">{`${pct}%`}</div>
    </div>
  )
}

