import React from 'react';
import { DisplayStand } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { differenceInDays } from 'date-fns';

interface MaintenanceStatsProps {
  stands: DisplayStand[];
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

const MaintenanceStats: React.FC<MaintenanceStatsProps> = ({ stands }) => {
  // Calculate maintenance statistics
  const stats = stands.reduce((acc, stand) => {
    const maintenances = stand.maintenanceHistory || [];
    const preventive = maintenances.filter(m => m.type === 'preventive').length;
    const curative = maintenances.filter(m => m.type === 'curative').length;

    return {
      preventive: (acc.preventive || 0) + preventive,
      curative: (acc.curative || 0) + curative,
      total: (acc.total || 0) + maintenances.length
    };
  }, {} as Record<string, number>);

  // Calculate average time between failures
  const calculateMTBF = () => {
    let totalDays = 0;
    let count = 0;

    stands.forEach(stand => {
      const curativeMaintenances = (stand.maintenanceHistory || [])
        .filter(m => m.type === 'curative')
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      if (curativeMaintenances.length > 1) {
        for (let i = 1; i < curativeMaintenances.length; i++) {
          const days = differenceInDays(
            new Date(curativeMaintenances[i].date),
            new Date(curativeMaintenances[i-1].date)
          );
          totalDays += days;
          count++;
        }
      }
    });

    return count > 0 ? Math.round(totalDays / count) : 0;
  };

  const mtbf = calculateMTBF();

  // Prepare data for charts
  const maintenanceTypeData = [
    { name: 'Préventive', value: stats.preventive || 0 },
    { name: 'Curative', value: stats.curative || 0 }
  ];

  return (
    <div className="space-y-8">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Total Maintenances
          </h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {stats.total || 0}
          </p>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            MTBF
          </h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            {mtbf} jours
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Temps moyen entre pannes
          </p>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Ratio Préventif/Curatif
          </h3>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {stats.total ? Math.round((stats.preventive / stats.total) * 100) : 0}%
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            de maintenance préventive
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Types de Maintenance
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={maintenanceTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {maintenanceTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Évolution des Maintenances
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[{ preventive: stats.preventive, curative: stats.curative }]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="preventive" name="Préventive" fill="#10b981" />
                <Bar dataKey="curative" name="Curative" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceStats;