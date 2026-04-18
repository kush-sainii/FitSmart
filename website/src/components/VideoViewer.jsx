import React from 'react'
import './VideoViewer.css'

function VideoViewer({ exerciseName, videoUrl, onClose }) {
  if (!videoUrl) {
    return null
  }

  // Extract YouTube video ID from URL
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return ''
    
    // Handle various YouTube URL formats
    let videoId = ''
    
    if (url.includes('youtube.com/watch')) {
      videoId = url.split('v=')[1]?.split('&')[0]
    } else if (url.includes('youtu.be')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0]
    } else if (url.match(/^[a-zA-Z0-9_-]{11}$/)) {
      // Direct video ID
      videoId = url
    }
    
    return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`
  }

  return (
    <div className="video-viewer-overlay" onClick={onClose}>
      <div className="video-viewer-modal" onClick={(e) => e.stopPropagation()}>
        <div className="video-viewer-header">
          <h3>{exerciseName}</h3>
          <button className="video-close-btn" onClick={onClose} aria-label="Close video">
            ✕
          </button>
        </div>
        
        <div className="video-container">
          <iframe
            width="100%"
            height="400"
            src={getYouTubeEmbedUrl(videoUrl)}
            title={`${exerciseName} demonstration`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        <div className="video-info">
          <p className="video-tip">💡 Watch this video to learn proper form for <strong>{exerciseName}</strong></p>
        </div>

        <button className="btn btn-primary" onClick={onClose}>
          Got It! Start Exercise
        </button>
      </div>
    </div>
  )
}

export default VideoViewer
