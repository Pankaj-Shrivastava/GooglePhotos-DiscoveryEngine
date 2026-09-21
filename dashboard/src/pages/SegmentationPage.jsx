import { useDataContext } from '../context/DataContext';
import PageGuide from '../components/PageGuide';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function SegmentationPage() {
  const data = useDataContext();
  const segmentation = data.segmentation || {};

  const geoData = Object.entries(segmentation.geography || {}).map(([k, v]) => ({ name: k, count: v }));
  const platformData = Object.entries(segmentation.platform || {}).map(([k, v]) => ({ name: k, count: v }));

  return (
    <div className="flex flex-col gap-4">
      <PageGuide
        pageKey="segmentation"
        title="User Segmentation"
        description="Compare how pain points differ across geographies (US vs India) and platforms (Android vs Web) to prioritize region-specific and platform-specific interventions."
      />

      <h1 className="text-xl font-semibold text-on-surface">Segmentation</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Geographic */}
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-on-surface">Geographic Distribution</h3>
          <p className="text-xs text-on-surface-variant mt-0.5 mb-4">Pain points by geography</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={geoData}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#1A73E8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Platform */}
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-on-surface">Platform Distribution</h3>
          <p className="text-xs text-on-surface-variant mt-0.5 mb-4">Pain points by platform</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={platformData}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#F9AB00" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
