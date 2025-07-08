'use client'

import Content from "@/components/Content";
import Navbar from "@/components/ui/Navbar";


export default function Home() {


  return (
    <>
      <div className="flex flex-col border border-black shadow-md bg-background m-2 sm:m-3 lg:m-6 xl:m-11 h-[calc(100vh-1rem)] sm:h-[calc(100vh-1.5rem)] lg:h-[calc(100vh-3rem)] xl:h-[calc(100vh-5.5rem)] font-mono md:overflow-hidden">
        <Navbar />
        {/* Main content area */}
        <Content />
      </div>
    </>
  );
}