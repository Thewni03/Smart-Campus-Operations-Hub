import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import heroImage from "../assets/sliitagram-619276202_18039022040734074_5635538980131848963_n.jpg";
import classImage from "../assets/2.jpg";
import labImage from "../assets/4.jpg";
import studyImage from "../assets/sliitagram-623143488_18166588825395153_8535186816980959188_n.jpg";

const HomePage = () => {
  const { user, isAdmin } = useAuth();
  const spotlightCards = [
    {
      title: "Smart Classrooms",
      text: "Track room issues, screens, lights, and day to day support.",
      image: classImage,
      to: "/tickets",
      action: "View issues",
    },
    {
      title: "Lab Support",
      text: "Create a ticket when devices, systems, or lab tools need help.",
      image: labImage,
      to: "/tickets/create",
      action: "Create ticket",
    },
    {
      title: "Study Spaces",
      text: "Keep learning areas clean, open, and ready for students.",
      image: studyImage,
      to: "/dashboard",
      action: "Open dashboard",
    },
  ];

  const featureList = [
    "Easy ticket reporting",
    "Fast updates for students",
    "One place for campus support",
  ];

  return (
    <section className="home-page">
      <div className="home-shell">
        <section className="home-showcase">
          <div className="home-showcase__copy">
            <p className="home-eyebrow">Smart Campus Support</p>
            <h1>
              A better way to care
              <br />
              for your campus.
            </h1>
            <p className="home-copy">
              Welcome {user?.name || user?.email || "student"}. Report issues,
              check progress, and keep learning spaces ready every day.
            </p>

            <div className="home-actions">
              <Link to="/tickets/create" className="home-button home-button--primary">
                Create Ticket
              </Link>
              <Link to="/tickets" className="home-button home-button--secondary">
                View Tickets
              </Link>
              <Link to="/dashboard" className="home-button home-button--ghost">
                Dashboard
              </Link>
              {isAdmin() && (
                <Link to="/admin" className="home-button home-button--ghost">
                  Admin
                </Link>
              )}
            </div>
          </div>

          <div className="home-showcase__visual">
            <img src={heroImage} alt="Campus entrance" className="home-hero-image" />
            <div className="home-hero-badge home-hero-badge--top">
              <strong>Campus ready</strong>
              <span>Fast reporting for daily issues</span>
            </div>
            <div className="home-hero-badge home-hero-badge--bottom">
              <strong>One smart hub</strong>
              <span>{featureList.join(" • ")}</span>
            </div>
          </div>
        </section>

        <section className="home-feature-band">
          <article className="home-band-card">
            <span>01</span>
            <h2>Easy Start</h2>
            <p>Open the page you need and begin in seconds.</p>
          </article>
          <article className="home-band-card">
            <span>02</span>
            <h2>Live Progress</h2>
            <p>See ticket status clearly from open to done.</p>
          </article>
          <article className="home-band-card">
            <span>03</span>
            <h2>Student Friendly</h2>
            <p>Simple words, clean pages, and quick actions.</p>
          </article>
        </section>

        <section className="home-card-grid">
          {spotlightCards.map((card) => (
            <Link key={card.title} to={card.to} className="home-media-card">
              <img src={card.image} alt={card.title} className="home-media-card__image" />
              <div className="home-media-card__content">
                <span className="home-media-card__tag">{card.action}</span>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </div>
            </Link>
          ))}
        </section>

        <section className="home-bottom-panel">
          <div className="home-bottom-panel__copy">
            <p className="home-panel__eyebrow">Why this page works</p>
            <h2>Clean design with real campus photos</h2>
            <p>
              This home page uses your own images, simple text, and clear action
              buttons so students and staff can quickly know where to go.
            </p>
          </div>
          <div className="home-bottom-panel__actions">
            <Link to="/tickets/create" className="home-inline-action">
              Report a new issue
            </Link>
            <Link to="/tickets" className="home-inline-action">
              Browse all tickets
            </Link>
          </div>
        </section>
      </div>
    </section>
  );
};

export default HomePage;
