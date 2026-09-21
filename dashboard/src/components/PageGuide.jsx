import { useState } from 'react';

export default function PageGuide({ title, description, pageKey }) {
  const storageKey = `pageGuide_dismissed_${pageKey}`;
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(storageKey) === 'true'
  );

  const dismiss = () => {
    setDismissed(true);
    localStorage.setItem(storageKey, 'true');
  };

  const show = () => {
    setDismissed(false);
    localStorage.removeItem(storageKey);
  };

  if (dismissed) {
    return (
      <button
        onClick={show}
        className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-primary-container text-on-primary-container shadow-lg flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all"
        title="Show page guide"
      >
        <span className="material-symbols-outlined text-xl">help</span>
      </button>
    );
  }

  return (
    <div className="bg-primary-fixed/60 border border-primary-container/30 rounded-xl p-4 mb-4 relative">
      <button
        onClick={dismiss}
        className="absolute top-3 right-3 w-7 h-7 rounded-full hover:bg-primary-container/20 flex items-center justify-center transition-colors"
        title="Dismiss guide"
      >
        <span className="material-symbols-outlined text-lg text-on-primary-fixed">close</span>
      </button>
      <div className="flex items-start gap-3 pr-8">
        <span className="material-symbols-outlined text-primary-container text-xl mt-0.5 shrink-0">info</span>
        <div>
          <h3 className="text-sm font-semibold text-on-primary-fixed mb-1">{title}</h3>
          <p className="text-xs text-on-primary-fixed/80 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}
