export default function BadgeCard({ title, description, type, progress, goal }) {
  const percentage = Math.min((progress / goal) * 100, 100);

  return (
    <div className={`badge-card ${type.toLowerCase()} ${progress >= goal ? "completed" : ""}`}>
      <h4>{title}</h4>

      <div className={`badge-icon ${type.toLowerCase()}`}></div>

      <p className="badge-desc">{description}</p>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${percentage}%` }} />
      </div>

      <span className="progress-text">
        {progress}/{goal}
      </span>
    </div>
  );
}
