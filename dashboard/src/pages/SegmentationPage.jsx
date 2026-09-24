import { useDataContext } from '../context/DataContext';
import PageGuide from '../components/PageGuide';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const PERSONAS = [
  { name: 'Parent', icon: 'child_care', topGroups: ['Facial & Identity Recall Failure', 'Data Loss Trauma'], quote: "My daughter looks different at 2 vs 5, and it doesn't group her anymore." },
  { name: 'Traveler', icon: 'flight', topGroups: ['Event & Context Association', 'Lexical / Search Vocabulary Gap'], quote: "I know we were at that beach in Spain, but I forgot the town name." },
  { name: 'Pet Owner', icon: 'pets', topGroups: ['Pet & Object Identity Confusion', 'Sensory / Visual Cue Search'], quote: "It mixes up my two golden retrievers completely." },
  { name: 'Power User', icon: 'bolt', topGroups: ['Temporal Amnesia', 'Lexical / Search Vocabulary Gap'], quote: "I take 100 photos a day. Searching by year isn't enough anymore." },
  { name: 'Casual', icon: 'sentiment_satisfied', topGroups: ['Data Loss Trauma', 'Temporal Amnesia'], quote: "I just want to see my old phone's photos and I can't find them." }
];

const COLORS = ['#1A73E8', '#00A859', '#F9AB00', '#BA1A1A', '#8E24AA', '#F4511E', '#3949AB'];

export default function SegmentationPage() {
  const data = useDataContext();
  const segmentation = data.segmentation || {};
  
  // Matrix data (Segments x Groups)
  const matrix = segmentation.group_by_segment || {};
  const segments = Object.keys(matrix);
  const groups = segments.length > 0 ? Object.keys(matrix[segments[0]]) : [];
  
  const matrixChartData = segments.map(seg => {
    const entry = { name: seg };
    groups.forEach(g => {
      entry[g] = matrix[seg][g] || 0;
    });
    return entry;
  });

  return (
    <div className="flex flex-col gap-6">
      <PageGuide
        pageKey="segmentation"
        title="User Persona & Memory Segmentation"
        description="See how memory problems affect different types of users. Parents struggle with facial recognition over time, while travelers struggle with forgotten place names. Tailor your solutions to the user."
      />

      <h1 className="text-xl font-semibold text-on-surface">Segmentation by Memory Group</h1>

      {/* Memory Group by User Segment (Stacked Bar) */}
      <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/30">
        <h3 className="text-sm font-semibold text-on-surface mb-1">Memory Group by User Segment</h3>
        <p className="text-xs text-on-surface-variant mb-4">Volume of memory failure modes distributed across user types</p>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={matrixChartData} margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 11 }} textAnchor="middle" height={30} tickFormatter={v => v.replace('_', ' ').toUpperCase()} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip cursor={{ fill: '#f1f3f4' }} contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
            <Legend verticalAlign="top" height={60} wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }} />
            {groups.map((g, i) => (
              <Bar key={g} dataKey={g} stackId="a" fill={COLORS[i % COLORS.length]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Persona Cards */}
      <div>
        <h3 className="text-sm font-semibold text-on-surface mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[18px]">psychology_alt</span>
          User Type Profiling
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {PERSONAS.map(persona => (
            <div key={persona.name} className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 flex flex-col h-full hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3 pb-3 border-b border-outline-variant/30">
                <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined">{persona.icon}</span>
                </div>
                <h4 className="text-sm font-bold text-on-surface uppercase tracking-wider">{persona.name}</h4>
              </div>
              
              <div className="flex-1 flex flex-col gap-3">
                <div>
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-1.5">Dominant Memory Failures</p>
                  <ul className="flex flex-col gap-1.5">
                    {persona.topGroups.map((g, i) => (
                      <li key={g} className="text-xs font-medium text-on-surface flex items-start gap-1.5">
                        <span className="text-primary mt-0.5">•</span> {g}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t border-outline-variant/20">
                <p className="text-xs italic text-on-surface-variant leading-relaxed">"{persona.quote}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
