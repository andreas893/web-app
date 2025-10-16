// components/BackButton.jsx
export default function BackButton({ onPrev }) {
  return (
    <button className="back-btn" onClick={onPrev}>
      ← Tilbage
    </button>
  );
}
