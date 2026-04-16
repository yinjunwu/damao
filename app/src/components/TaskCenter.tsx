export default function TaskCenter() {
  const stats = [
    { label: '总任务数', value: '0' },
    { label: '已完成', value: '0' },
    { label: '进行中', value: '0' },
    { label: '完成率', value: '0.0%' },
  ]

  return (
    <div>
      <h2 className="text-base font-semibold text-gray-900 mb-6">任务中心</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
            <p className="text-xl font-semibold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
