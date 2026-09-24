import { useDataContext } from '../context/DataContext';
import { useFilterContext } from '../context/FilterContext';
import PageGuide from '../components/PageGuide';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Cell, Legend } from 'recharts';

const SEVERITY_COLORS = { critical: '#BA1A1A', high: '#F9AB00', medium: '#FBBC04', low: '#727785' };

export default function FrameworksPage() {
  const data = useDataContext();
  const { applyFilters } = useFilterContext();
  const frameworks = data.frameworks || {};
  const painPoints = applyFilters(data.pain_points || []);
  
  // Aggregate data by memory group
  const groupsStats = {};
  painPoints.forEach(p => {
    const g = p.memory_group || 'Other';
    if (!groupsStats[g]) groupsStats[g] = { name: g, count: 0, critical: 0, high: 0, medium: 0, low: 0, freq: 0 };
    groupsStats[g].count++;
    groupsStats[g][p.severity || 'low']++;
    groupsStats[g].freq += p.frequency || 1;
  });

  const groupData = Object.values(groupsStats).sort((a, b) => b.count - a.count);
  
  // Data for radar chart (Volume of frequency)
  const radarData = groupData.map(g => ({
    group: g.name.split(' ')[0], // short name for radar
    fullGroup: g.name,
    volume: g.freq
  }));

  const outcomeData = Object.entries(frameworks.retrieval_outcomes || {}).map(([k, v]) => ({ name: k, count: v }));

  return (
    <div className="flex flex-col gap-6">
      <PageGuide
        pageKey="frameworks"
        title="Memory Failure Frameworks"
        description="Deep analytical frameworks focusing on memory group patterns. See which groups have the most critical mass, how they shape overall failure volume, and where the biggest gaps are."
      />

      <h1 className="text-xl font-semibold text-on-surface">Analytical Frameworks</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stacked Severity by Group */}
        <ChartCard title="Critical Mass by Group" subtitle="Severity distribution across memory failures">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={groupData} layout="vertical" margin={{ left: 100, right: 20 }}>
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={100} 
                tickFormatter={(val) => val.length > 15 ? val.substring(0, 15) + '...' : val} 
              />
              <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
              <Legend verticalAlign="top" height={30} iconType="circle" wrapperStyle={{ fontSize: '11px' }}/>
              <Bar dataKey="critical" stackId="a" fill={SEVERITY_COLORS.critical} name="Critical" />
              <Bar dataKey="high" stackId="a" fill={SEVERITY_COLORS.high} name="High" />
              <Bar dataKey="medium" stackId="a" fill={SEVERITY_COLORS.medium} name="Medium" />
              <Bar dataKey="low" stackId="a" fill={SEVERITY_COLORS.low} name="Low" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Radar Chart for Volume */}
        <ChartCard title="Memory Failure Shape" subtitle="Total frequency volume by group">
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
              <PolarGrid stroke="#e0e2e5" />
              <PolarAngleAxis dataKey="group" tick={{ fontSize: 11, fill: '#44474e' }} />
              <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fontSize: 10 }} />
              <Radar name="Mentions" dataKey="volume" stroke="#0b57d0" fill="#0b57d0" fillOpacity={0.4} />
              <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Gap Matrix */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/30 overflow-x-auto">
          <h3 className="text-sm font-semibold text-on-surface mb-1">Memory Group Gap Matrix</h3>
          <p className="text-xs text-on-surface-variant mb-4">Detailed breakdown of issues and Google's current coverage</p>
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-outline-variant/40 text-xs text-on-surface-variant uppercase tracking-wider">
                <th className="pb-3 font-medium px-2">Memory Group</th>
                <th className="pb-3 font-medium px-2 text-center">Total Issues</th>
                <th className="pb-3 font-medium px-2 text-center">Critical/High</th>
                <th className="pb-3 font-medium px-2 text-center">Addressed by Google</th>
                <th className="pb-3 font-medium px-2 text-center">Open Gaps</th>
              </tr>
            </thead>
            <tbody>
              {groupData.map(g => {
                const addressed = painPoints.filter(p => p.memory_group === g.name && p.addressed_by_google).length;
                const openGaps = g.count - addressed;
                const critHigh = g.critical + g.high;
                return (
                  <tr key={g.name} className="border-b border-outline-variant/20 hover:bg-surface-container-lowest/50">
                    <td className="py-3 px-2 text-sm font-medium text-on-surface">{g.name}</td>
                    <td className="py-3 px-2 text-sm text-center text-on-surface-variant">{g.count}</td>
                    <td className="py-3 px-2 text-center">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-md ${critHigh > 0 ? 'bg-error-container text-on-error-container' : 'bg-surface-container text-on-surface'}`}>
                        {critHigh}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-sm text-center text-primary font-medium">{addressed}</td>
                    <td className="py-3 px-2 text-sm text-center text-error font-bold">{openGaps}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/30 flex flex-col">
      <h3 className="text-sm font-semibold text-on-surface">{title}</h3>
      <p className="text-xs text-on-surface-variant mt-0.5 mb-6">{subtitle}</p>
      <div className="flex-1 min-h-0">
        {children}
      </div>
    </div>
  );
}
