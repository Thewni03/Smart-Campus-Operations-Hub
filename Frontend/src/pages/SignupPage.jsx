import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const SignupPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: 'Student',
    password: '',
    confirmPassword: '',
    agree: false,
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

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setMessage('Please complete all required fields.')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match.')
      return
    }

    if (!formData.agree) {
      setMessage('Please accept the terms to continue.')
      return
    }

    setMessage(`Account created for ${formData.fullName}. You can now log in.`)
  }

  return (
    <section className="auth-shell auth-shell--signup">
      <div className="auth-panel auth-panel--form">
        <div className="auth-card auth-card--wide">
          <div className="auth-card__header">
            <p className="auth-kicker">Create account</p>
            <h2>Sign up for campus access</h2>
            <p>Set up your profile and start managing daily operations.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-grid">
              <label className="auth-field">
                <span>Full name</span>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </label>

              <label className="auth-field">
                <span>Campus role</span>
                <select name="role" value={formData.role} onChange={handleChange}>
                  <option>Student</option>
                  <option>Lecturer</option>
                  <option>Administrator</option>
                  <option>Operations Staff</option>
                </select>
              </label>
            </div>

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

            <div className="auth-grid">
              <label className="auth-field">
                <span>Password</span>
                <input
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </label>

              <label className="auth-field">
                <span>Confirm password</span>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Repeat your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </label>
            </div>

            <label className="auth-check auth-check--stacked">
              <input
                type="checkbox"
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
              />
              <span>I agree to the terms and privacy policy.</span>
            </label>

            <button type="submit" className="auth-button">
              Create Account
            </button>
          </form>

          {message && <p className="auth-message">{message}</p>}

          <p className="auth-switch">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>

      <div className="auth-panel auth-panel--brand auth-panel--brand-alt">
        <p className="auth-eyebrow">Campus ready</p>
        <h1>Bring people, places, and processes into sync.</h1>
        <p className="auth-copy">
          From service requests to emergency coordination, your team can stay
          aligned with a faster and clearer operational view.
        </p>

        <div className="auth-stat-grid">
          <div className="auth-stat-card">
            <strong>24/7</strong>
            <span>Visibility across support operations</span>
          </div>
          <div className="auth-stat-card">
            <strong>1 hub</strong>
            <span>Shared workflow for every department</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SignupPage
