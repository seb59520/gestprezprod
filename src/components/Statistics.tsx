import React from 'react';
import { useStands } from '../context/StandsContext';
import { Calendar, AlertTriangle, Clock, Wrench, TrendingUp, BookOpen, FileText } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { getStandAge, getAgeStatus } from '../utils/standUtils';
import { fr } from 'date-fns/locale';
import { differenceInDays, format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#6b7280'];

const Statistics = () => {
  const { stands, publications, availablePosters } = useStands();

  // Statistiques d'utilisation des présentoirs
  const standUsageStats = stands.reduce((acc, stand) => {
    const reservations = stand.reservationHistory || [];
    const totalDays = reservations.reduce((days, res) => {
      if (!res.startDate || !res.endDate) return days;
      return days + differenceInDays(new Date(res.endDate), new Date(res.startDate));
    }, 0);

    return {
      ...acc,
      [stand.id]: {
        name: stand.name,
        totalDays,
        reservationCount: reservations.length
      }
    };
  }, {});

  // Statistiques des affiches
  const posterStats = stands.reduce((acc, stand) => {
    if (stand.currentPoster) {
      acc[stand.currentPoster] = (acc[stand.currentPoster] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const posterData = Object.entries(posterStats).map(([name, count]) => ({
    name,
    value: count
  }));

  // Statistiques des publications
  const publicationStats = stands.reduce((acc, stand) => {
    (stand.publications || []).forEach(pub => {
      const publication = publications.find(p => p.id === pub.publicationId);
      if (publication) {
        acc[publication.title] = (acc[publication.title] || 0) + pub.quantity;
      }
    });
    return acc;
  }, {} as Record<string, number>);

  const publicationData = Object.entries(publicationStats)
    .map(([name, quantity]) => ({
      name,
      quantity
    }))
    .sort((a, b) => b.quantity - a.quantity);

  // Données d'utilisation mensuelle
  const currentMonth = new Date();
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const usageData = daysInMonth.map(date => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    const reservedStands = stands.filter(stand => 
      stand.isReserved && 
      new Date(stand.reservedUntil!) >= date
    ).length;

    return {
      date: format(date, 'd MMM', { locale: fr }),
      reservations: reservedStands
    };
  });

  // Statistiques de maintenance
  const maintenanceStats = stands.reduce((acc, stand) => {
    const maintenances = stand.maintenanceHistory || [];
    const preventive = maintenances.filter(m => m.type === 'preventive').length;
    const curative = maintenances.filter(m => m.type === 'curative').length;

    return {
      ...acc,
      preventive: (acc.preventive || 0) + preventive,
      curative: (acc.curative || 0) + curative,
      total: (acc.total || 0) + maintenances.length
    };
  }, {} as Record<string, number>);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Statistiques et Analyses
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Utilisation des présentoirs */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            Utilisation Mensuelle
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usageData}>
                <defs>
                  <linearGradient id="colorReservations" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="reservations" 
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#colorReservations)" 
                  name="Réservations"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution des affiches */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-500" />
            Distribution des Affiches
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={posterData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {posterData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Statistiques de maintenance */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Wrench className="h-5 w-5 text-yellow-500" />
            Statistiques de Maintenance
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[maintenanceStats]}>
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

        {/* Distribution des publications */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-purple-500" />
            Distribution des Publications
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={publicationData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip />
                <Bar dataKey="quantity" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;