import * as elements from 'typed-html';

export const SearchHeader = () => {
  return (
    <div class="flex w-full items-center justify-center">
      <input class="px-4 py-2 w-[800px] rounded-full mt-4 border-slate-700 border-2 focus:border-sky-700 transition-colors focus:outline-none"
        type="text" hx-post="/search" name="search" id="searchId" hx-target="#main" hx-trigger="keyup changed 500ms"
        placeholder="0xabc123..." />
    </div>
  )
}
