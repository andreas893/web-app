import "../login.css";

export default function StepIntro({ onNext }) {
  
  
    return (
    <div className="intro-container">
        <div className="heading-intro">
            <h1>Liiiiige inden vi slipper dig løs</h1>
        </div>
        
        <div className="content-intro">
            <p>Vi har 4 spørgsmål så vi kan lære dig og dine musikvaner bedre at kende.</p>
            <button onClick={onNext}>Fortsæt</button>
        </div>

    </div>
  )
}

