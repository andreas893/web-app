import { useState } from "react";
import StepGenre from "../components/StepGenre";
import StepMood from "../components/StepMood";
import StepDiscover from "../components/StepDiscover";
import StepSummary from "../components/StepSummary";
import StepAge from "../components/StepAge";
import StepIntro from "../components/StepIntro";
import "../onboarding.css";
import { useNavigate } from "react-router-dom";

export default function OnboardingPage() {
 const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div className="onboarding">
      {step === 1 && <StepIntro onNext={nextStep} />}
      {step === 2 && <StepGenre onNext={nextStep} />}
      {step === 3 && <StepMood onNext={nextStep} onPrev={prevStep} />}
      {step === 4 && <StepAge onNext={nextStep} onPrev={prevStep} />}
      {step === 5 && <StepDiscover onNext={nextStep} onPrev={prevStep} />}
      {step === 6 && <StepSummary onNext={() => navigate("/mood-select")} />}
    </div>
  );
}