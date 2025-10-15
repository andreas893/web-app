import { useState } from "react";
import StepGenre from "../components/StepGenre";
import StepMood from "../components/StepMood";
import StepDiscover from "../components/StepDiscover";
import StepSummary from "../components/StepSummary";
import StepAge from "../components/StepAge";
import StepIntro from "../components/StepIntro";

export default function OnboardingPage() {
 const [step, setStep] = useState(1);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div className="onboarding">
      {step === 1 && <StepIntro onNext={nextStep} />}
      {step === 2 && <StepGenre onNext={nextStep} />}
      {step === 3 && <StepMood onNext={nextStep} onBack={prevStep} />}
      {step === 4 && <StepAge onNext={nextStep} onBack={prevStep} />}
      {step === 5 && <StepDiscover onNext={nextStep} onBack={prevStep} />}
      {step === 6 && <StepSummary onBack={prevStep} />}
    </div>
  );
}