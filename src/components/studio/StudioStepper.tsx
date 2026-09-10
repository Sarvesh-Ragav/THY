import React from 'react';
import Link from 'next/link';
import { STUDIO_STEPS, type StudioStepId } from '@/lib/design-studio';

export function StudioStepper({
  current,
  categoryId,
}: {
  current: StudioStepId;
  categoryId: string;
}) {
  const query = `?category=${encodeURIComponent(categoryId)}`;

  return (
    <ol className="thy-scroll-x flex items-center gap-0 min-h-14">
      {STUDIO_STEPS.map((step, index) => {
        const activeIndex = STUDIO_STEPS.findIndex((item) => item.id === current);
        const reached = index <= activeIndex;
        const currentStep = step.id === current;
        const href = `${step.href}${query}`;

        return (
          <li key={step.id} className="flex items-center shrink-0">
            {index > 0 && (
              <span className={`w-8 sm:w-12 h-px mx-1 ${index <= activeIndex ? 'bg-thy-brand' : 'bg-thy-ink/15'}`} />
            )}
            <Link href={href} className="flex flex-col items-center gap-1.5 min-w-[4.25rem] px-1">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  currentStep ? 'bg-thy-brand ring-4 ring-thy-brand/20' : reached ? 'bg-thy-brand' : 'bg-thy-ink/20'
                }`}
              />
              <span
                className={`text-[9px] sm:text-[10px] uppercase tracking-[0.16em] ${
                  currentStep ? 'text-thy-brand font-semibold' : 'text-thy-subtle'
                }`}
              >
                {step.label}
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
