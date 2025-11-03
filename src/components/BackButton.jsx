import { useNavigate } from "react-router-dom";

export default function BackButton({ label = "Tilbage", to }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) navigate(to);      // Gå til en bestemt route hvis angivet
    else navigate(-1);         // Ellers gå tilbage i historikken
  };

  return (
    <button className="back-btn" onClick={handleClick}>
      {label}
    </button>
  );
}