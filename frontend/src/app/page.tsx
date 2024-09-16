'use client'

import { HomeSection } from '@/components/landing/home-page'
import { NavBar } from '@/components/shared/nav-bar'
import { SparklesCore } from '@/components/ui/sparkles'

export default function HomePage() {

  return (
    <>
      <NavBar />
      <div className="blob  relative flex grow flex-col items-center justify-center ">
        {/* Title */}
        <div className="w-full absolute overflow-hidden inset-0 h-screen">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>

        <HomeSection  />
      </div>
      {/* <Footer /> */}
    </>
  )
}
