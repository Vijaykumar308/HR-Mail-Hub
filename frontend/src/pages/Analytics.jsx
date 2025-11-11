import React from 'react';

const Analytics = () => {
  // Sample data for the analytics
  const stats = [
    { name: 'Total Applications Sent', value: '128', change: '+12%', changeType: 'increase' },
    { name: 'Response Rate', value: '18%', change: '+2.3%', changeType: 'increase' },
    { name: 'Interview Rate', value: '8%', change: '+1.2%', changeType: 'increase' },
    { name: 'Average Response Time', value: '3.2 days', change: '-0.5 days', changeType: 'decrease' },
  ];

  const activityData = [
    { date: '2023-11-10', applications: 5, responses: 1 },
    { date: '2023-11-09', applications: 3, responses: 0 },
    { date: '2023-11-08', applications: 7, responses: 2 },
    { date: '2023-11-07', applications: 4, responses: 1 },
    { date: '2023-11-06', applications: 6, responses: 3 },
    { date: '2023-11-05', applications: 2, responses: 1 },
    { date: '2023-11-04', applications: 1, responses: 0 },
  ];

  const topCompanies = [
    { name: 'Google', applications: 15, responseRate: '20%' },
    { name: 'Microsoft', applications: 12, responseRate: '25%' },
    { name: 'Amazon', applications: 10, responseRate: '10%' },
    { name: 'Netflix', applications: 8, responseRate: '12.5%' },
    { name: 'Airbnb', applications: 5, responseRate: '20%' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
        <p className="mt-1 text-sm text-gray-500">
          Track your job application performance and response rates
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">{stat.value}</dd>
              <div className="mt-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    stat.changeType === 'increase'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {stat.changeType === 'increase' ? '↑' : '↓'} {stat.change}
                </span>
                <span className="ml-1 text-xs text-gray-500">vs last 30 days</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Activity Chart */}
        <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Activity (Last 7 Days)</h3>
          <div className="h-64">
            <div className="h-full flex items-end space-x-2">
              {activityData.map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="flex items-end space-x-1 w-full">
                    <div 
                      className="w-full bg-blue-100 rounded-t"
                      style={{ height: `${day.applications * 10}%` }}
                    ></div>
                    <div 
                      className="w-full bg-green-100 rounded-t"
                      style={{ height: `${day.responses * 20}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4 space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                <span className="text-xs text-gray-500">Applications</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                <span className="text-xs text-gray-500">Responses</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Companies */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Companies</h3>
          <div className="flow-root">
            <ul className="divide-y divide-gray-200">
              {topCompanies.map((company, index) => (
                <li key={company.name} className="py-3">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {index + 1}. {company.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {company.applications} applications
                      </p>
                    </div>
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {company.responseRate} response rate
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Response Timeline */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
        <div className="flow-root">
          <ul className="-mb-8">
            <li>
              <div className="relative pb-8">
                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                <div className="relative flex space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                      <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        Received response from <span className="font-medium text-gray-900">Google</span>
                      </p>
                    </div>
                    <div className="text-right text-sm whitespace-nowrap text-gray-500">
                      <time dateTime="2023-11-10">Today</time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div className="relative pb-8">
                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                <div className="relative flex space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                      <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        Application sent to <span className="font-medium text-gray-900">Microsoft</span>
                      </p>
                    </div>
                    <div className="text-right text-sm whitespace-nowrap text-gray-500">
                      <time dateTime="2023-11-09">Yesterday</time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div className="relative pb-8">
                <div className="relative flex space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center ring-8 ring-white">
                      <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v1h-1.5v-.5a.5.5 0 00-1 0v.5H4.5v-.5a.5.5 0 00-1 0v.5H2V6a2 2 0 012-2zm6 9.5a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-1z" clipRule="evenodd" />
                        <path d="M2 6v10a2 2 0 002 2h12a2 2 0 002-2V6H2z" />
                      </svg>
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        Interview scheduled with <span className="font-medium text-gray-900">Amazon</span>
                      </p>
                    </div>
                    <div className="text-right text-sm whitespace-nowrap text-gray-500">
                      <time dateTime="2023-11-08">2d ago</time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
