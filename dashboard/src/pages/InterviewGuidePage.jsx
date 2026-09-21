import { useState } from 'react';
import { useDataContext } from '../context/DataContext';
import PageGuide from '../components/PageGuide';

export default function InterviewGuidePage() {
  const data = useDataContext();
  const guides = data.interview_guides || [];

  return (
    <div className="flex flex-col gap-4">
      <PageGuide
        pageKey="interview-guide"
        title="Interview Guide"
        description="Use these auto-generated interview scripts to validate pain points with real users. Each guide targets a specific opportunity area with open-ended questions and follow-up probes."
      />

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-on-surface">Interview Guides</h1>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-outline-variant text-on-surface-variant text-xs font-medium hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined text-sm">content_copy</span> Copy All
          </button>
          <button className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-primary-container text-on-primary-container text-xs font-medium hover:bg-primary transition-all shadow-sm">
            <span className="material-symbols-outlined text-sm">download</span> Export PDF
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {guides.map((guide) => (
          <AccordionCard key={guide.opportunity_id} guide={guide} />
        ))}
      </div>
    </div>
  );
}

function AccordionCard({ guide }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/40">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-xl">assignment</span>
          <div>
            <h3 className="text-sm font-semibold text-on-surface">{guide.title}</h3>
            <p className="text-xs text-on-surface-variant mt-0.5">{guide.questions?.length || 0} questions</p>
          </div>
        </div>
        <span className={`material-symbols-outlined text-on-surface-variant transition-transform ${open ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-outline-variant/40">
          <ol className="mt-4 flex flex-col gap-4">
            {guide.questions?.map((q, i) => (
              <li key={i} className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-primary-fixed text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-medium text-on-surface">{q}</p>
                  <div className="mt-2 ml-2 flex flex-col gap-1.5">
                    <p className="text-xs italic text-on-surface-variant flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-xs text-primary">subdirectory_arrow_right</span>
                      Probe: Can you describe a specific instance?
                    </p>
                    <p className="text-xs italic text-on-surface-variant flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-xs text-primary">subdirectory_arrow_right</span>
                      Follow-up: What would the ideal experience look like?
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-4 bg-primary-fixed/40 rounded-lg p-3.5">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="material-symbols-outlined text-primary-container text-sm">assignment</span>
              <p className="text-xs font-semibold text-on-primary-fixed">Scenario Prompt</p>
            </div>
            <p className="text-xs text-on-primary-fixed/80 leading-relaxed">
              "Imagine you're looking for a specific photo from 6 months ago. Walk me through exactly how you'd try to find it in Google Photos. What would you search for?"
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
