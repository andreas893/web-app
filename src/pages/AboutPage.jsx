export default function AboutPage() {
  return (
    <section className="page">
      <div className="about-container">
        <h1>Om Os</h1>
        <div className="about-content">
          <div className="about-text">
            <h2>Vores Historie</h2>
            <p>
              Vi er et passioneret team af udviklere der elsker at bygge moderne web applikationer med de nyeste
              teknologier.
            </p>
            <h2>Vores Mission</h2>
            <p>
              At levere de bedste web løsninger ved hjælp af cutting-edge teknologier som React, Vite og moderne web
              standards.
            </p>
          </div>
          <div className="about-stats">
            <div className="stat">
              <h3>10+</h3>
              <p>Projekter</p>
            </div>
            <div className="stat">
              <h3>5+</h3>
              <p>Team Members</p>
            </div>
            <div className="stat">
              <h3>100%</h3>
              <p>Tilfredse kunder</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}