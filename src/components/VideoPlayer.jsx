import React, { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX, Maximize2, Play, Pause } from 'lucide-react';

export default function VideoPlayer({ src, poster, title }) {
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const p = (video.currentTime / video.duration) * 100;
      setProgress(p || 0);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, []);

  const toggleMute = (e) => {
    e.stopPropagation();
    if(videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  const togglePlay = () => {
    if(videoRef.current) {
      if(playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  const toggleFullscreen = (e) => {
    e.stopPropagation();
    if(videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.msRequestFullscreen) {
        videoRef.current.msRequestFullscreen();
      }
    }
  };

  const handleProgressClick = (e) => {
    e.stopPropagation();
    if(!videoRef.current || !progressRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * videoRef.current.duration;
  };

  return (
    <div 
      className="video-player-wrap relative group w-full max-w-[1100px] mx-auto rounded overflow-hidden aspect-video cursor-pointer shadow-[0_0_50px_rgba(212,98,42,0.08)] bg-charcoal"
      onClick={togglePlay}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover"
        title={title}
      />
      
      {/* Play/Pause Overlay indicator */}
      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 pointer-events-none ${!playing || isHovering ? 'opacity-100 bg-void/20' : 'opacity-0'}`}>
         <div className={`bg-void/70 backdrop-blur-sm text-cream p-4 lg:p-5 rounded-full transition-transform duration-300 ${!playing ? 'scale-100' : 'scale-90 opacity-0'}`}>
            {!playing ? <Play size={36} className="ml-1 text-ember" /> : <Pause size={36} className="text-ember" />}
         </div>
      </div>

      {/* Controls Overlay */}
      <div className={`absolute bottom-0 left-0 right-0 p-4 lg:p-6 bg-gradient-to-t from-void via-void/80 to-transparent transition-opacity duration-500 ${(isHovering || !playing) ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex justify-between items-center relative z-10 w-full mb-3 px-2 lg:px-4">
          <button onClick={toggleMute} className="text-cream hover:text-ember transition-colors p-2 bg-charcoal/50 backdrop-blur-md rounded-full relative z-20 border border-silver/10 hover:border-ember/50">
            {muted ? <VolumeX size={22} /> : <Volume2 size={22} />}
          </button>
          
          <button onClick={toggleFullscreen} className="text-cream hover:text-ember transition-colors p-2 bg-charcoal/50 backdrop-blur-md rounded-full relative z-20 border border-silver/10 hover:border-ember/50">
            <Maximize2 size={22} />
          </button>
        </div>
        
        {/* Custom Progress Bar */}
        <div 
          ref={progressRef}
          className="mx-2 lg:mx-4 h-1.5 lg:h-2 bg-silver/20 rounded-full cursor-pointer overflow-hidden backdrop-blur-sm relative z-20"
          onClick={handleProgressClick}
        >
          <div 
            className="h-full bg-ember transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(212,98,42,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
