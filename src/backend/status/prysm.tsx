import * as elements from 'typed-html'
import { getLatestConsensusVersion, getPrysmSync } from '../connectors/prysm'

export const PrysmInfo = async () => {
  const [version, syncInfo] = await Promise.all([
    getLatestConsensusVersion(),
    getPrysmSync()
  ])

  const {head_slot, sync_distance} = syncInfo
  const total = sync_distance + head_slot;
  const pct = Math.round((head_slot/total)*100)

  return (
    <div class="w-full">
      <PrysmVersion version={version} />
      <PrysmSync pct={pct} />
    </div>
  )
}

const PrysmVersion = ({version}: {version: string}) => {
  return (
    <div class="text-center mb-2">{version}</div>
  )
}

const PrysmSync = ({pct}: {pct: number}) => {
  return (
    <div class={`relative rounded-md overflow-clip h-6 w-full]`}>
      <div class={`bg-gray-600 w-full h-6`} />
      <div class={`absolute left-0 top-0 w-[${pct}%] bg-sky-600 h-6 animate-pulse`} />
      <div class="absolute left-0 top-0 w-full text-center">{`${pct}%`}</div>
    </div>
  )
}

