import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
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
    if (!formData.email || !formData.password) {
      setMessage("Please enter your email and password.");
      return;
    }

    setSubmitting(true);
    setMessage("");

    loginUser({
      email: formData.email,
      password: formData.password,
    })
      .then((response) => {
        const authUser = response.data.data;

        login(
          {
            userId: authUser.userId,
            name: authUser.fullName,
            email: authUser.email,
            role: authUser.role,
          },
          "session-active"
        );

        navigate(authUser.role === "ADMIN" ? "/admin" : "/home");
      })
      .catch((error) => {
        setMessage(
          error.response?.data?.message || "Login failed. Please try again."
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
        gridTemplateColumns: '1.1fr 0.9fr',
        background: `radial-gradient(circle at top left, rgba(255, 196, 112, 0.28), transparent 32%),
                     linear-gradient(135deg, #f5efe4 0%, #f7f9fc 45%, #eef4f6 100%)`,
      }}
    >
      <div
        style={{
          padding: '56px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '24px',
          background: 'linear-gradient(180deg, rgba(18, 51, 76, 0.9), rgba(14, 34, 53, 0.96)), #12334c',
          color: '#f4f7fb',
        }}
      >
        <p style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '0.16em', fontSize: '0.78rem', fontWeight: 700 }}>Smart Campus Operations Hub</p>
        <h1 style={{ margin: 0, fontSize: 'clamp(2.4rem, 5vw, 4.6rem)', lineHeight: 0.98, letterSpacing: '-0.06em' }}>Keep your campus moving from one dashboard.</h1>
        <p style={{ margin: 0, maxWidth: '34rem', fontSize: '1.05rem', color: 'rgba(244,247,251,0.8)' }}>
          Track facilities, incidents, student services, and operations with a single secure workspace built for busy teams.
        </p>

        <div style={{ display: 'grid', gap: '16px', marginTop: '12px' }}>
          <div style={{ padding: '18px 20px', borderRadius: '20px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)' }}>
            <span style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'rgba(244,247,251,0.65)' }}>Live status</span>
            <strong style={{ color: '#fff', fontSize: '1.03rem', lineHeight: 1.4 }}>Facilities, transport, and support queues in one place.</strong>
          </div>
          <div style={{ padding: '18px 20px', borderRadius: '20px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)' }}>
            <span style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'rgba(244,247,251,0.65)' }}>Fast coordination</span>
            <strong style={{ color: '#fff', fontSize: '1.03rem', lineHeight: 1.4 }}>Move from report to response without losing context.</strong>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '56px' }}>
        <div style={{
          width: 'min(100%, 30rem)',
          padding: '36px',
          borderRadius: '28px',
          background: 'rgba(255,255,255,0.82)',
          border: '1px solid rgba(18,51,76,0.12)',
          boxShadow: '0 24px 60px rgba(26,44,65,0.12)',
          backdropFilter: 'blur(16px)',
        }}>
          <div style={{ marginBottom: '28px', textAlign: 'left' }}>
            <p style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '0.16em', fontSize: '0.78rem', fontWeight: 700, color: '#9a5d10' }}>Welcome back</p>
            <h2 style={{ margin: '8px 0', color: '#13283a', fontSize: 'clamp(1.9rem,3vw,2.5rem)', lineHeight: 1.05 }}>
              Log in to your account
            </h2>
            <p style={{ color: '#556574' }}>
              Use your campus email to continue. Admin accounts will open the admin dashboard automatically.
            </p>
          </div>

          <form style={{ display: 'grid', gap: '18px' }} onSubmit={handleSubmit}>
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

            <label style={{ display: 'grid', gap: '8px', textAlign: 'left' }}>
              <span style={{ fontWeight: 600, fontSize: '0.95rem', color: '#243746' }}>Password</span>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
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

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', color: '#52606d', fontSize: '0.94rem' }}>
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                  style={{ width: '16px', height: '16px', accentColor: '#c46f00' }}
                />
                <span>Remember me</span>
              </label>
              <Link to="/signup" style={{ color: '#9a5d10', textDecoration: 'none', fontWeight: 600 }}>Need an account?</Link>
            </div>

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
              {submitting ? "Logging in..." : "Log In"}
            </button>
          </form>

          {message && <p style={{ margin: '18px 0 0', padding: '12px 14px', borderRadius: '14px', background: '#eef7f1', color: '#205236', textAlign: 'left' }}>{message}</p>}

          <p style={{ margin: '18px 0 0', textAlign: 'center', color: '#556574' }}>
            New here? <Link to="/signup" style={{ color: '#9a5d10', fontWeight: 600, textDecoration: 'none' }}>Create an account</Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
