import React, { useState } from 'react'
import './BotChat.css'

function BotChat({ botUrl }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const isValidUrl = botUrl && botUrl !== 'https://your-bot-url-here.com'

  const handleIframeLoad = () => {
    setIsLoaded(true)
  }

  const handleIframeError = () => {
    setIsLoaded(false)
  }

  return (
    <div className="bot-chat-container" role="dialog" aria-label="FitSmart Assistant">
      <div className="bot-chat-header">
        <h3>FitSmart Assistant</h3>
        <p className="bot-subtitle">Your personal fitness coach</p>
      </div>
      <div className="bot-chat-body">
        {isValidUrl ? (
          <>
            <iframe
              src={botUrl}
              title="FitSmart Bot"
              className="bot-iframe"
              allow="microphone; camera; clipboard-read; clipboard-write"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
            />
            {!isLoaded && (
              <div className="bot-loading">
                <div className="loading-spinner"></div>
                <p>Loading assistant...</p>
              </div>
            )}
          </>
        ) : (
          <div className="bot-placeholder">
            <div className="placeholder-content">
              <div className="placeholder-icon">🤖</div>
              <p>Bot Not Connected</p>
              <small>Configure your bot URL to get started</small>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BotChat
