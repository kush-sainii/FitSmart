import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/LandingPage.css'

function LandingPage() {
  const features = [
    {
      icon: '🏋️',
      title: 'Smart Workouts',
      description: 'AI-powered workout plans tailored to your fitness level'
    },
    {
      icon: '📊',
      title: 'Track Progress',
      description: 'Monitor your improvements with detailed analytics'
    },
    {
      icon: '🍎',
      title: 'Nutrition',
      description: 'Track meals and manage your daily calories'
    },
    {
      icon: '🔔',
      title: 'Smart Reminders',
      description: 'Never miss a workout with personalized notifications'
    }
  ]

  const plans = [
    {
      icon: '🔥',
      name: 'Weight Loss',
      description: 'Burn calories and lose weight effectively',
      level: 'Intermediate'
    },
    {
      icon: '💪',
      name: 'Muscle Building',
      description: 'Build strength and muscle mass',
      level: 'Advanced'
    },
    {
      icon: '🧘',
      name: 'Flexibility',
      description: 'Improve flexibility and range of motion',
      level: 'Beginner'
    },
    {
      icon: '🏃',
      name: 'Cardio',
      description: 'Build cardiovascular strength',
      level: 'Intermediate'
    }
  ]

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Transform Your Body, <span className="gradient-text">Transform Your Life</span></h1>
            <p>Your personal AI fitness coach is ready to help you achieve your goals. Start your journey today.</p>
            <div className="hero-buttons">
              <Link to="/workouts" className="btn-primary">Get Started</Link>
              <Link to="/progress" className="btn-secondary">View Progress</Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-emoji">💪</div>
            <div className="floating-cards">
              <div className="floating-card card-1">
                <span className="card-emoji">🔥</span>
                <p>500 cal</p>
              </div>
              <div className="floating-card card-2">
                <span className="card-emoji">⚡</span>
                <p>7 Streak</p>
              </div>
              <div className="floating-card card-3">
                <span className="card-emoji">🎯</span>
                <p>10/10</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2>Why Choose FitSmart?</h2>
          <p>Everything you need to succeed in your fitness journey</p>
        </div>
        <div className="features-grid">
          {features.map((feature, idx) => (
            <div key={idx} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Workout Plans Section */}
      <section className="plans-section">
        <div className="section-header">
          <h2>Choose Your Workout Plan</h2>
          <p>Pick a program that matches your fitness level</p>
        </div>
        <div className="plans-grid">
          {plans.map((plan, idx) => (
            <div key={idx} className={`plan-card plan-${idx + 1}`}>
              <div className="plan-icon">{plan.icon}</div>
              <h3>{plan.name}</h3>
              <p className="plan-description">{plan.description}</p>
              <span className="plan-level">{plan.level}</span>
              <Link to="/workouts" className="plan-cta">Explore →</Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Start Your Fitness Journey?</h2>
          <p>Join thousands of people transforming their bodies and minds</p>
          <Link to="/workouts" className="btn-large">Start Now - It's Free</Link>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
