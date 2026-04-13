import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "../api/authApi";
import { ROLES } from "../utils/constants";

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: ROLES.STUDENT,
    password: "",
    confirmPassword: "",
    agree: false,
  });
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      setMessage("Please complete all required fields.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    if (!formData.agree) {
      setMessage("Please accept the terms to continue.");
      return;
    }

    setSubmitting(true);
    setMessage("");

    signupUser({
      fullName: formData.fullName,
      email: formData.email,
      role: formData.role,
      oauthProvider: "LOCAL",
      oauthId: formData.email,
      password: formData.password,
    })
      .then((response) => {
        setMessage(response.data.message || "Account created successfully.");
        window.setTimeout(() => navigate("/login"), 900);
      })
      .catch((error) => {
        setMessage(
          error.response?.data?.message || "Signup failed. Please try again."
        );
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <section
      style={{
        minHeight: '100svh',
        display: 'grid',
        gridTemplateColumns: '0.95fr 1.05fr',
        background: `radial-gradient(circle at top left, rgba(255, 196, 112, 0.28), transparent 32%),
                     linear-gradient(135deg, #f5efe4 0%, #f7f9fc 45%, #eef4f6 100%)`,
      }}
    >
      {/* Left panel - form */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '56px',
        }}
      >
        <div
          style={{
            width: 'min(100%, 38rem)',
            padding: '36px',
            borderRadius: '28px',
            background: 'rgba(255,255,255,0.82)',
            border: '1px solid rgba(18,51,76,0.12)',
            boxShadow: '0 24px 60px rgba(26,44,65,0.12)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div style={{ marginBottom: '28px', textAlign: 'left' }}>
            <p style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '0.16em', fontSize: '0.78rem', fontWeight: 700, color: '#9a5d10' }}>Create account</p>
            <h2 style={{ margin: '8px 0', color: '#13283a', fontSize: 'clamp(1.9rem,3vw,2.5rem)', lineHeight: 1.05 }}>Sign up for campus access</h2>
            <p style={{ color: '#556574' }}>Set up your profile and start managing daily operations.</p>
          </div>

          <form style={{ display: 'grid', gap: '18px' }} onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: '18px' }}>
              <label style={{ display: 'grid', gap: '8px', textAlign: 'left' }}>
                <span style={{ fontWeight: 600, fontSize: '0.95rem', color: '#243746' }}>Full name</span>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '14px 15px',
                    borderRadius: '14px',
                    border: '1px solid #d4dde5',
                    background: 'rgba(255,255,255,0.92)',
                    color: '#163042',
                    font: 'inherit',
                    boxSizing: 'border-box',
                  }}
                />
              </label>

              <label style={{ display: 'grid', gap: '8px', textAlign: 'left' }}>
                <span style={{ fontWeight: 600, fontSize: '0.95rem', color: '#243746' }}>Campus role</span>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '14px 15px',
                    borderRadius: '14px',
                    border: '1px solid #d4dde5',
                    background: 'rgba(255,255,255,0.92)',
                    color: '#163042',
                    font: 'inherit',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value={ROLES.STUDENT}>Student</option>
                  <option value={ROLES.TECHNICIAN}>Technician</option>
                  <option value={ROLES.ADMIN}>Admin</option>
                </select>
              </label>
            </div>

            <label style={{ display: 'grid', gap: '8px', textAlign: 'left' }}>
              <span style={{ fontWeight: 600, fontSize: '0.95rem', color: '#243746' }}>Email address</span>
              <input
                type="email"
                name="email"
                placeholder="name@campus.edu"
                value={formData.email}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '14px 15px',
                  borderRadius: '14px',
                  border: '1px solid #d4dde5',
                  background: 'rgba(255,255,255,0.92)',
                  color: '#163042',
                  font: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: '18px' }}>
              <label style={{ display: 'grid', gap: '8px', textAlign: 'left' }}>
                <span style={{ fontWeight: 600, fontSize: '0.95rem', color: '#243746' }}>Password</span>
                <input
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '14px 15px',
                    borderRadius: '14px',
                    border: '1px solid #d4dde5',
                    background: 'rgba(255,255,255,0.92)',
                    color: '#163042',
                    font: 'inherit',
                    boxSizing: 'border-box',
                  }}
                />
              </label>

              <label style={{ display: 'grid', gap: '8px', textAlign: 'left' }}>
                <span style={{ fontWeight: 600, fontSize: '0.95rem', color: '#243746' }}>Confirm password</span>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Repeat your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '14px 15px',
                    borderRadius: '14px',
                    border: '1px solid #d4dde5',
                    background: 'rgba(255,255,255,0.92)',
                    color: '#163042',
                    font: 'inherit',
                    boxSizing: 'border-box',
                  }}
                />
              </label>
            </div>

            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', color: '#52606d', fontSize: '0.94rem' }}>
              <input
                type="checkbox"
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
                style={{ width: '16px', height: '16px', accentColor: '#c46f00' }}
              />
              <span>I agree to the terms and privacy policy.</span>
            </label>

            <button
              type="submit"
              disabled={submitting}
              style={{
                border: 'none',
                borderRadius: '16px',
                padding: '15px 18px',
                background: 'linear-gradient(135deg, #d47a0c, #a84f00)',
                color: '#fff',
                font: 'inherit',
                fontWeight: 700,
                cursor: submitting ? "not-allowed" : 'pointer',
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {message && <p style={{ margin: '18px 0 0', padding: '12px 14px', borderRadius: '14px', background: '#eef7f1', color: '#205236', textAlign: 'left' }}>{message}</p>}

          <p style={{ margin: '18px 0 0', textAlign: 'center', color: '#556574' }}>
            Already have an account? <Link to="/login" style={{ color: '#9a5d10', fontWeight: 600, textDecoration: 'none' }}>Log in</Link>
          </p>
        </div>
      </div>

      {/* Right panel - brand */}
      <div
        style={{
          padding: '56px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '24px',
          background: `radial-gradient(circle at top right, rgba(255, 184, 77, 0.24), transparent 26%),
                       linear-gradient(180deg, rgba(32, 70, 52, 0.94), rgba(17, 43, 31, 0.98))`,
          color: '#fff',
        }}
      >
        <p style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '0.16em', fontSize: '0.78rem', fontWeight: 700 }}>Campus ready</p>
        <h1 style={{ margin: 0, fontSize: 'clamp(2.4rem,5vw,4.6rem)', lineHeight: 0.98, letterSpacing: '-0.06em' }}>Bring people, places, and processes into sync.</h1>
        <p style={{ margin: 0, maxWidth: '34rem', fontSize: '1.05rem', color: 'rgba(244,247,251,0.8)' }}>
          From service requests to emergency coordination, your team can stay aligned with a faster and clearer operational view.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: '16px', marginTop: '12px' }}>
          <div style={{ padding: '18px 20px', borderRadius: '20px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)' }}>
            <strong style={{ color: '#fff', fontSize: '1.03rem', lineHeight: 1.4 }}>24/7</strong>
            <span style={{ display: 'block', marginTop: '8px', fontSize: '0.9rem', color: 'rgba(244,247,251,0.65)' }}>Visibility across support operations</span>
          </div>
          <div style={{ padding: '18px 20px', borderRadius: '20px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)' }}>
            <strong style={{ color: '#fff', fontSize: '1.03rem', lineHeight: 1.4 }}>1 hub</strong>
            <span style={{ display: 'block', marginTop: '8px', fontSize: '0.9rem', color: 'rgba(244,247,251,0.65)' }}>Shared workflow for every department</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignupPage;
