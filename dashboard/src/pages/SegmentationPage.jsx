import { useDataContext } from '../context/DataContext';
import PageGuide from '../components/PageGuide';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const PERSONAS = [
  { 
    name: 'Parent', icon: 'child_care', id: 'parent',
    quote: "My daughter looks different at 2 vs 5, and it doesn't group her anymore.",
    whatTheyTry: "Scrolls by year, searches child's name, browses specific albums.",
    whereTheyBreak: "App splits child's photos into two different people because of age gap. Manual curation is tedious."
  },
  { 
    name: 'Traveler', icon: 'flight', id: 'traveler',
    quote: "I know we were at that beach in Spain, but I forgot the town name.",
    whatTheyTry: "Searches for landmarks or attempts to zoom out on the map view.",
    whereTheyBreak: "Can't remember the precise geographic location name that the app uses for tagging."
  },
  { 
    name: 'Pet Owner', icon: 'pets', id: 'pet_owner',
    quote: "It mixes up my two golden retrievers completely.",
    whatTheyTry: "Searches for 'dog' or looks for specific pet albums.",
    whereTheyBreak: "AI cannot distinguish between similar-looking animals, rendering the search useless."
  },
  { 
    name: 'Power User', icon: 'bolt', id: 'power_user',
    quote: "I take 100 photos a day. Searching by year isn't enough anymore.",
    whatTheyTry: "Uses complex search queries combining dates, locations, and objects.",
    whereTheyBreak: "The sheer volume of photos makes chronological scrolling impossible; needs precise multi-modal search."
  },
  { 
    name: 'Casual', icon: 'sentiment_satisfied', id: 'casual',
    quote: "I just want to see my old phone's photos and I can't find them.",
    whatTheyTry: "Opens app expecting everything to just be there on the main screen.",
    whereTheyBreak: "Panics when photos aren't immediately visible, lacking the technical vocabulary to troubleshoot missing backups."
  }
];

const COLORS = ['#1A73E8', '#00A859', '#F9AB00', '#BA1A1A', '#8E24AA', '#F4511E', '#3949AB'];

export default function SegmentationPage() {
  const data = useDataContext();
  const segmentation = data.segmentation || {};
  
  // Matrix data (Segments x Groups)
  const matrix = segmentation.group_by_segment || {};
  const segments = Object.keys(matrix);
  const groups = Array.from(new Set(segments.flatMap(seg => Object.keys(matrix[seg] || {}))));
  
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
            <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
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
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {PERSONAS.map(persona => {
            // Get all groups for this persona, sorted by frequency
            const personaData = matrix[persona.id] || {};
            const dominantGroups = Object.entries(personaData)
              .filter(([_, count]) => count > 0)
              .sort((a, b) => b[1] - a[1]);

            return (
              <div key={persona.name} className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/30 flex flex-col h-full hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-outline-variant/30">
                  <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined">{persona.icon}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-on-surface uppercase tracking-wider">{persona.name}</h4>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">{dominantGroups.reduce((sum, g) => sum + g[1], 0)} Total Issues</p>
                  </div>
                </div>
                
                <div className="flex-1 flex flex-col md:flex-row gap-6">
                  
                  {/* Left Col: Dominant Failures */}
                  <div className="md:w-1/2">
                    <p className="text-[10px] text-primary font-bold uppercase tracking-wider mb-2">Dominant Memory Failures</p>
                    <div className="flex flex-col gap-2">
                      {dominantGroups.length > 0 ? dominantGroups.map(([g, count]) => (
                        <div key={g} className="flex items-center justify-between bg-surface-container-low/50 px-2 py-1.5 rounded text-[11px]">
                          <span className="font-semibold text-on-surface">{g}</span>
                          <span className="text-on-surface-variant font-medium">{count}</span>
                        </div>
                      )) : (
                        <p className="text-xs italic text-on-surface-variant">No data</p>
                      )}
                    </div>
                  </div>

                  {/* Right Col: Behavior & Quote */}
                  <div className="md:w-1/2 flex flex-col gap-3">
                    <div>
                      <p className="text-[10px] text-tertiary font-bold uppercase tracking-wider mb-1">What they try</p>
                      <p className="text-[12px] text-on-surface-variant leading-snug">{persona.whatTheyTry}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-error font-bold uppercase tracking-wider mb-1">Where they break</p>
                      <p className="text-[12px] text-on-surface-variant leading-snug">{persona.whereTheyBreak}</p>
                    </div>
                  </div>

                </div>
                
                <div className="mt-5 pt-3 border-t border-outline-variant/20 bg-primary-fixed/20 -mx-5 px-5 -mb-5 pb-5 rounded-b-xl">
                  <p className="text-[13px] font-medium italic text-on-surface-variant leading-relaxed">"{persona.quote}"</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
