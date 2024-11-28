import React from 'react'

export default function ReportsAndAlerts() {
  const alerts = [
    { id: 1, type: 'warning', message: 'Emissions exceeded threshold in Sector A' },
    { id: 2, type: 'info', message: 'Quarterly report due in 5 days' },
    { id: 3, type: 'success', message: 'Carbon offset target achieved for Q2' },
  ]

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Reports and Alerts</h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">Recent Alerts</h3>
          <ul className="space-y-2">
            {alerts.map((alert) => (
              <li key={alert.id} className={`p-2 rounded-md ${ 
                alert.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                alert.type === 'info' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800' 
              }`}>
                {alert.message}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">Generated Reports</h3>
          <ul className="space-y-2">
            <li className="flex items-center justify-between p-2 bg-gray-100 rounded-md">
              <span>Q2 2023 Emissions Summary</span>
              <button className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600">Download</button>
            </li>
            <li className="flex items-center justify-between p-2 bg-gray-100 rounded-md">
              <span>Annual Carbon Neutrality Progress</span>
              <button className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600">Download</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
