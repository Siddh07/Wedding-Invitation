'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function IntroSequence() {
  const [showVideo, setShowVideo] = useState(false);
  const [isClickable, setIsClickable] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();

  const handleClick = async () => {
    if (!isClickable) return;
    setIsClickable(false);
    setShowVideo(true);

    // Wait for next tick to ensure video is mounted
    await new Promise(resolve => setTimeout(resolve, 0));
    
    const video = videoRef.current;
    if (video) {
      // Set playback speed to 0.8x
      video.playbackRate = 0.8;
      
      // Start muted for mobile autoplay compatibility, then unmute
      video.muted = true;
      const playPromise = video.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Unmute after playback starts successfully
            video.muted = false;
          })
          .catch(err => {
            console.error('Video play error:', err);
            // If unmuted play fails, keep it muted
            video.muted = true;
            video.play();
          });
      }
    }
  };

  const handleVideoEnd = () => {
    // Redirect to home page after video ends
    router.push('/home');
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {!showVideo ? (
        // Image Display - Click anywhere to start
        <div
          className="relative w-full h-full cursor-pointer"
          onClick={handleClick}
        >
          <Image
            src="/assets/Intro-image.png"
            alt="Introduction"
            fill
            className="object-cover"
            priority
          />
        </div>
      ) : (
        // Video Display - Single video element with optimized settings
        <div className="relative w-full h-full flex items-center justify-center bg-black">
          <video
            ref={videoRef}
            src="/assets/intro-video.mp4"
            className="w-full h-full object-cover"
            poster="/assets/Intro-image.png"
            playsInline
            preload="metadata"
            onEnded={handleVideoEnd}
          />
        </div>
      )}
    </div>
  );
}
