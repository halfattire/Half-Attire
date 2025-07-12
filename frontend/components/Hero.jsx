"use client"

import { useEffect, useRef } from "react"

function Hero() {
  const videoRef = useRef(null)

  // Ensure video plays automatically when component mounts
  useEffect(() => {
    if (videoRef.current) {
      // Some browsers require user interaction before autoplay
      // This is a workaround to try to play the video automatically
      const playVideo = async () => {
        try {
          await videoRef.current.play()
          console.log("Video playing automatically")
        } catch (error) {
          console.error("Autoplay prevented:", error)
          // Fallback: show a static image or handle gracefully
        }
      }

      // Attempt to play video
      playVideo()

      // Fallback: Try to play on user interaction
      const handleUserInteraction = () => {
        if (videoRef.current && videoRef.current.paused) {
          videoRef.current.play().catch(console.error)
        }
      }

      document.addEventListener('click', handleUserInteraction, { once: true })
      document.addEventListener('touchstart', handleUserInteraction, { once: true })

      return () => {
        document.removeEventListener('click', handleUserInteraction)
        document.removeEventListener('touchstart', handleUserInteraction)
      }
    }
  }, [])

  return (
    <section className="hero-video-container relative h-[60vh] sm:h-[70vh] md:h-[75vh] lg:h-[80vh] w-full max-w-full overflow-hidden bg-black">
      {/* Full-screen responsive background video */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full max-w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{
          width: '100%',
          height: '100%',
          maxWidth: '100%',
          objectFit: 'cover',
          objectPosition: 'center'
        }}
      >
        <source src="/assets/video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

      {/* Optional: Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white drop-shadow-lg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}

export default Hero
