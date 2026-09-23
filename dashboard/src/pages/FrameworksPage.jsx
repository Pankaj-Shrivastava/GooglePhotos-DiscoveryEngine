import { useDataContext } from '../context/DataContext';
import PageGuide from '../components/PageGuide';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const SEVERITY_COLORS = { critical: '#BA1A1A', high: '#F9AB00', medium: '#FBBC04', low: '#727785' };

export default function FrameworksPage() {
  const data = useDataContext();
  const frameworks = data.frameworks || {};
  const memoryCues = data.memory_cues || [];
  const painPoints = data.pain_points || [];

  const severityData = Object.entries(frameworks.severity_matrix || {}).map(([k, v]) => ({ name: k, count: v }));
  const outcomeData = Object.entries(frameworks.retrieval_outcomes || {}).map(([k, v]) => ({ name: k, count: v }));

  // Top pain points by frequency
  const freqData = [...painPoints].sort((a, b) => (b.frequency || 0) - (a.frequency || 0)).slice(0, 8)
    .map((p) => ({ name: p.title?.slice(0, 25) + '…', count: p.frequency || 1 }));

  return (
    <div className="flex flex-col gap-4">
      <PageGuide
        pageKey="frameworks"
        title="Analytical Frameworks"
        description="These analytical frameworks help you see patterns across the data. The severity matrix shows how issues are distributed by criticality. The gap analysis reveals where Google Photos currently falls short of user expectations."
      />

      <h1 className="text-xl font-semibold text-on-surface">Analytical Frameworks</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Severity Distribution */}
        <ChartCard title="Severity Distribution" subtitle="Issue count by severity level">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={severityData} layout="vertical" margin={{ left: 60 }}>
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={60} />
              <Tooltip cursor={{ fill: 'transparent' }} />
              <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                {severityData.map((entry) => (
                  <Cell key={entry.name} fill={SEVERITY_COLORS[entry.name] || '#1A73E8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Memory Cue Distribution */}
        <ChartCard title="Memory Cue Distribution" subtitle="How users remember their photos">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={memoryCues.slice(0, 6)} layout="vertical" margin={{ left: 60 }}>
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="cue" tick={{ fontSize: 11 }} width={60} />
              <Tooltip cursor={{ fill: 'transparent' }} />
              <Bar dataKey="count" fill="#1A73E8" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Retrieval Outcomes */}
        <ChartCard title="Retrieval Outcomes" subtitle="Success vs failure distribution">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={outcomeData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={35} paddingAngle={3}>
                {outcomeData.map((entry, i) => (
                  <Cell key={entry.name} fill={['#1E8E3E', '#1A73E8', '#F9AB00', '#BA1A1A'][i] || '#727785'} />
                ))}
              </Pie>
              <Tooltip cursor={{ fill: 'transparent' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {outcomeData.map((entry, i) => (
              <span key={entry.name} className="text-[10px] text-on-surface-variant flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ background: ['#1E8E3E', '#1A73E8', '#F9AB00', '#BA1A1A'][i] }} />
                {entry.name}
              </span>
            ))}
          </div>
        </ChartCard>

        {/* Frequency of Mention */}
        <ChartCard title="Frequency of Mention" subtitle="Most common pain point clusters">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={freqData} layout="vertical" margin={{ left: 120 }}>
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={120} />
              <Tooltip cursor={{ fill: 'transparent' }} />
              <Bar dataKey="count" fill="#1A73E8" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-on-surface">{title}</h3>
      <p className="text-xs text-on-surface-variant mt-0.5 mb-4">{subtitle}</p>
      {children}
    </div>
  );
}
