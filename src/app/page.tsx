"use client";


import SearchUser from '@/components/SearchUser';

const SEARCH_FRAME_COUNT = 3;
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col p-16">
      <div className={`grid grid-cols-1 gap-16 lg:grid-cols-3 lg:gap-8`}>
        {Array.from(Array(SEARCH_FRAME_COUNT).keys()).map(index => <SearchUser key={index} />)}
      </div>
    </main>
  )
}
