interface StatsCardProps { title: string; value: string | number; icon: string; color: string }
export default function StatsCard({ title, value, icon, color }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{typeof value === 'number' ? value.toLocaleString() : value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-2xl`}>{icon}</div>
      </div>
    </div>
  )
}
