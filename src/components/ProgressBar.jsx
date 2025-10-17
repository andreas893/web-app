export default function ProgressBar({ step, totalSteps = 4 }) {
  return (
    <div className="progress-dots">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <span
          key={index}
          className={`dot ${index + 1 === step ? "active" : ""}`}
        ></span>
      ))}
    </div>
  );
}