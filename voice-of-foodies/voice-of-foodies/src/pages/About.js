import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

export default function About() {
  return (
    <div className="about-page page-enter">
      {/* HERO */}
      <section className="about-hero">
        <div className="container about-hero__content">
          <div className="about-hero__badge">🍴 About the Platform</div>
          <h1 className="about-hero__title">
            Voice of Foodies
          </h1>
          <p className="about-hero__sub">
            A community-driven restaurant review platform built for food lovers in Pakistan —
            honest reviews, genuine experiences, better dining decisions.
          </p>
        </div>
      </section>

      {/* MISSION */}
      <section className="about-section">
        <div className="container about-two-col">
          <div className="about-text">
            <h2 className="about-section-title">Our Mission</h2>
            <p>
              Voice of Foodies was created to solve a simple problem: food lovers in Pakistan lack
              a reliable, community-driven, and easy-to-use restaurant review platform.
            </p>
            <p>
              Most general-purpose review apps are cluttered with advertisements, unreliable
              reviews, or simply aren't designed with the local dining scene in mind.
            </p>
            <p>
              We believe food brings people together — and every review helps someone make a
              better choice. Whether it's street food or fine dining, every opinion matters here.
            </p>
          </div>
          <div className="about-visual">
            <div className="mission-card">
              <div className="mission-icon">🎯</div>
              <h3>Our Goal</h3>
              <p>Empower food lovers to discover and share authentic dining experiences.</p>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="about-values">
        <div className="container">
          <h2 className="about-section-title centered">What We Stand For</h2>
          <div className="values-grid">
            {[
              { icon: '🤝', title: 'Community First',   desc: 'Built by foodies, for foodies. Real people sharing real experiences.' },
              { icon: '✅', title: 'Authentic Reviews', desc: 'No paid promotions. No fake reviews. Just honest feedback from real diners.' },
              { icon: '🔒', title: 'Your Data, Your Reviews', desc: 'You own your reviews. Edit or delete them any time you want.' },
              { icon: '📱', title: 'Simple & Accessible', desc: 'A clean, fast interface that works on any device, anywhere.' },
            ].map((v) => (
              <div key={v.title} className="value-card">
                <div className="value-icon">{v.icon}</div>
                <h3 className="value-title">{v.title}</h3>
                <p className="value-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="about-section about-section--alt">
        <div className="container">
          <h2 className="about-section-title centered">The Team</h2>
          <p className="team-intro">
            Voice of Foodies is a Final Year Project at <strong>SZABIST University, Karachi</strong>.
            Developed by two software engineering students with a shared love for food and technology.
          </p>
          <div className="team-grid">
            {[
              { name: 'Hameedullah Khan', id: '2212352', role: 'UI/UX · Frontend · Backend · Database', emoji: '👨‍💻' },
              { name: 'Abbad Maqbool',   id: '2280173', role: 'UI/UX · Frontend · Backend · Research & Docs', emoji: '👨‍💻' },
            ].map((m) => (
              <div key={m.id} className="team-card">
                <div className="team-avatar">{m.emoji}</div>
                <h3 className="team-name">{m.name}</h3>
                <p className="team-id">ID: {m.id}</p>
                <p className="team-role">{m.role}</p>
              </div>
            ))}
          </div>
          <p className="team-supervisor">
            Supervised by Faculty of Computing & Engineering Sciences,<br />
            <strong>SZABIST University, Karachi Campus — June 2026</strong>
          </p>
        </div>
      </section>

      {/* TECH STACK */}
      <section className="about-section">
        <div className="container">
          <h2 className="about-section-title centered">Built With</h2>
          <div className="tech-grid">
            {[
              { label: 'React 18',       icon: '⚛️',  desc: 'Frontend framework' },
              { label: 'React Router 6', icon: '🗺',  desc: 'Client-side routing' },
              { label: 'LocalStorage',   icon: '💾',  desc: 'Data persistence' },
              { label: 'CSS3',           icon: '🎨',  desc: 'Custom styling' },
              { label: 'JavaScript ES6+',icon: '📜',  desc: 'Core language' },
              { label: 'VS Code',        icon: '🖊',  desc: 'Development IDE' },
              { label: 'Git / GitHub',   icon: '🔧',  desc: 'Version control' },
            ].map((t) => (
              <div key={t.label} className="tech-chip">
                <span className="tech-chip__icon">{t.icon}</span>
                <div>
                  <div className="tech-chip__label">{t.label}</div>
                  <div className="tech-chip__desc">{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="container about-cta__inner">
          <h2>Ready to share your dining experience?</h2>
          <div className="about-cta__btns">
            <Link to="/signup" className="cta-btn">Join Now</Link>
            <Link to="/reviews" className="cta-btn cta-btn--outline">Browse Reviews</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
