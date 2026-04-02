import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  })
  const [message, setMessage] = useState('')

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target

    setFormData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!formData.email || !formData.password) {
      setMessage('Please enter your email and password.')
      return
    }

    setMessage(`Welcome back. ${formData.email} is ready to sign in.`)
  }

  return (
    <section className="auth-shell">
      <div className="auth-panel auth-panel--brand">
        <p className="auth-eyebrow">Smart Campus Operations Hub</p>
        <h1>Keep your campus moving from one dashboard.</h1>
        <p className="auth-copy">
          Track facilities, incidents, student services, and operations with a
          single secure workspace built for busy teams.
        </p>

        <div className="auth-feature-list">
          <div className="auth-feature-card">
            <span>Live status</span>
            <strong>Facilities, transport, and support queues in one place.</strong>
          </div>
          <div className="auth-feature-card">
            <span>Fast coordination</span>
            <strong>Move from report to response without losing context.</strong>
          </div>
        </div>
      </div>

      <div className="auth-panel auth-panel--form">
        <div className="auth-card">
          <div className="auth-card__header">
            <p className="auth-kicker">Welcome back</p>
            <h2>Log in to your account</h2>
            <p>Use your campus email to continue.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="auth-field">
              <span>Email address</span>
              <input
                type="email"
                name="email"
                placeholder="name@campus.edu"
                value={formData.email}
                onChange={handleChange}
              />
            </label>

            <label className="auth-field">
              <span>Password</span>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </label>

            <div className="auth-row">
              <label className="auth-check">
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                />
                <span>Remember me</span>
              </label>

              <a href="/" className="auth-link">
                Forgot password?
              </a>
            </div>

            <button type="submit" className="auth-button">
              Log In
            </button>
          </form>

          {message && <p className="auth-message">{message}</p>}

          <p className="auth-switch">
            New here? <Link to="/signup">Create an account</Link>
          </p>
        </div>
      </div>
    </section>
  )
}

export default LoginPage
