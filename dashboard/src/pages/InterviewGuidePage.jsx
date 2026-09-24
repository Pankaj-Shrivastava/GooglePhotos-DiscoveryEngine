import { useState } from 'react';
import { useDataContext } from '../context/DataContext';
import PageGuide from '../components/PageGuide';

export default function InterviewGuidePage() {
  const data = useDataContext();
  const guides = data.interview_guides || [];
  const painPoints = data.pain_points || [];

  return (
    <div className="flex flex-col gap-6">
      <PageGuide
        pageKey="interview-guide"
        title="Memory Failure Interview Scripts"
        description="Auto-generated interview scripts tailored to each of the 7 memory failure groups. Use these to validate assumptions, understand workarounds, and build deep empathy with users."
      />

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-on-surface">Targeted Interview Guides</h1>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-outline-variant text-on-surface-variant text-xs font-medium hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined text-sm">content_copy</span> Copy All
          </button>
          <button className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-primary-container text-on-primary-container text-xs font-medium hover:bg-primary transition-all shadow-sm">
            <span className="material-symbols-outlined text-sm">download</span> Export PDF
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {guides.map((guide) => {
          // Find pain points for this group to show verbatims
          const groupName = guide.title.replace('User Interview: ', '');
          const groupPPs = painPoints.filter(p => p.memory_group === groupName);
          const verbatims = groupPPs.flatMap(p => p.quotes || []).slice(0, 3);
          
          return (
            <AccordionCard key={guide.opportunity_id} guide={guide} verbatims={verbatims} groupName={groupName} />
          );
        })}
      </div>
    </div>
  );
}

function AccordionCard({ guide, verbatims, groupName }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/40">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors text-left"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined">psychology</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-on-surface">{guide.title}</h3>
            <p className="text-xs text-on-surface-variant mt-0.5">{guide.questions?.length || 0} targeted questions</p>
          </div>
        </div>
        <span className={`material-symbols-outlined text-on-surface-variant transition-transform ${open ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>

      {open && (
        <div className="px-5 pb-6 border-t border-outline-variant/40 flex flex-col xl:flex-row gap-6 mt-4">
          
          {/* Left Col: Script */}
          <div className="flex-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">Interview Script</h4>
            
            <div className="mb-4 bg-primary-fixed/30 rounded-lg p-3.5 border border-primary-container/30">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="material-symbols-outlined text-primary-container text-sm">assignment</span>
                <p className="text-[11px] font-bold uppercase tracking-wider text-on-primary-fixed">Scenario Prompt (Read to user)</p>
              </div>
              <p className="text-xs text-on-primary-fixed/90 leading-relaxed italic">
                "Imagine you're trying to find a photo from a past event but you're struggling due to {groupName.toLowerCase()}. Walk me through exactly what you'd do in Google Photos."
              </p>
            </div>

            <ol className="flex flex-col gap-4 ml-1">
              {guide.questions?.map((q, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="w-5 h-5 rounded-full bg-surface-container-high text-on-surface text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-on-surface leading-snug">{q}</p>
                    {i === 0 && (
                      <p className="text-[11px] italic text-on-surface-variant mt-1.5 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">psychology_alt</span>
                        Watch for: Do they blame themselves or the app?
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Right Col: Verbatims */}
          <div className="xl:w-1/3 bg-surface-container-low/50 rounded-xl p-4 border border-outline-variant/30">
            <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3">User Verbatim Bank</h4>
            <p className="text-[11px] text-on-surface-variant mb-3 leading-relaxed">
              Use these real quotes to ground yourself in the user's mindset before the interview.
            </p>
            
            <div className="flex flex-col gap-3">
              {verbatims.map((v, i) => (
                <div key={i} className="bg-surface-container-lowest border-l-2 border-primary-container p-2.5 rounded shadow-sm text-xs text-on-surface italic leading-relaxed">
                  "{v}"
                </div>
              ))}
              {verbatims.length === 0 && (
                <p className="text-xs text-on-surface-variant italic">No verbatims found for this specific group yet.</p>
              )}
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
}
