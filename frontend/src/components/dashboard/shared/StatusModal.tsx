"use client";
import { useMemo, useEffect } from "react";
import { useStepper } from "headless-stepper";

export function StatusComponent({
  compiling,
  deploying,
  verifying,
}: {
  compiling: boolean;
  deploying: boolean;
  verifying: boolean;
}) {
  const steps = useMemo(
    () => [
      { id: "compiling", label: "Compiling" },
      { id: "deploying", label: "Deploying" },
      { id: "verifying", label: "Verifying" },
    ],
    []
  );

  const {
    nextStep,
    prevStep,
    setStep,
    state,
  } = useStepper({
    steps
  });

  useEffect(() => {
    if (verifying) {
      setStep(2);
    } else if (deploying) {
      setStep(1);
    } else if (compiling) {
      setStep(0);
    }
  }, [compiling, deploying, verifying, setStep]);

  const progress = useMemo(() => {
    const currentIndex = steps.findIndex((step, index) => index  === state.currentStep);
    return Math.ceil((currentIndex / (steps.length - 1)) * 100);
  }, [state.currentStep, steps]);

  return (
    <div className="fixed top-0 z-[2000] inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
      <nav className="my-4 w-[50%] grid grid-cols-6">
        <ol className="col-span-full flex flex-row">
          {steps.map((step, index) => (
            <li className="text-center flex-[1_0_auto]" key={step.id}>
              <div
                className="group flex flex-col items-center cursor-pointer focus:outline-0"
                onClick={() => setStep(index)}
              >
                <span
                  className={`flex items-center justify-center bg-white text-black w-8 h-8 border border-full rounded-full group-focus:ring-2 group-focus:ring-offset-2 transition-colors ease-in-out ${
                    state.currentStep === index
                      ? "bg-sky-500 text-white ring-2 ring-offset-2"
                      : ""
                  } 
              `} 
                >
                  {index + 1}
                </span>
                <span
                  className={`${
                    state.currentStep === index ? "font-bold" : ""
                  }`}
                >
                  {step.label}
                </span>
              </div>
            </li>
          ))}
        </ol>
        <div
          style={{ gridColumn: "2 / 8" }}
          className="flex items-center flex-row top-4 right-16 relative border-0.5 bg-gray-300 z-[-1] pointer-events-none row-span-full w-full h-0.5"
        >
          <span className="h-full w-full flex" />
          <div
            style={{
              width: `${progress}%`,
              gridColumn: "1 / -1",
              gridRow: "1 / -1",
            }}
            className="flex flex-row h-full overflow-hidden border-solid border-0 bg-sky-500"
          />
        </div>
      </nav>
    </div>
  );
}