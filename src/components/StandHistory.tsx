import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { HistoryRecord } from '../types';
import { formatHistoryAction } from '../utils/historyUtils';
import { Clock, User, FileText, Wrench, BookOpen, Calendar } from 'lucide-react';

interface StandHistoryProps {
  history: HistoryRecord[];
}

const StandHistory: React.FC<StandHistoryProps> = ({ history }) => {
  const sortedHistory = [...history].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const getIcon = (type: HistoryRecord['type']) => {
    switch (type) {
      case 'reservation':
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case 'maintenance':
        return <Wrench className="h-5 w-5 text-yellow-500" />;
      case 'poster_change':
        return <FileText className="h-5 w-5 text-green-500" />;
      case 'stock_update':
        return <BookOpen className="h-5 w-5 text-purple-500" />;
      case 'publication_association':
        return <BookOpen className="h-5 w-5 text-indigo-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getActionColor = (type: HistoryRecord['type']) => {
    switch (type) {
      case 'reservation':
        return 'bg-blue-50 text-blue-700';
      case 'maintenance':
        return 'bg-yellow-50 text-yellow-700';
      case 'poster_change':
        return 'bg-green-50 text-green-700';
      case 'stock_update':
        return 'bg-purple-50 text-purple-700';
      case 'publication_association':
        return 'bg-indigo-50 text-indigo-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Historique des actions</h3>
      
      <div className="space-y-4">
        {sortedHistory.map((record) => (
          <div key={record.id} className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {getIcon(record.type)}
                  <span className={`px-2 py-1 rounded-full text-sm font-medium ${getActionColor(record.type)}`}>
                    {formatHistoryAction(record)}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {record.performedBy}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {format(new Date(record.date), 'PPp', { locale: fr })}
                  </div>
                </div>

                {record.details.notes && (
                  <p className="text-sm text-gray-500 mt-2 italic">
                    {record.details.notes}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}

        {sortedHistory.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Aucun historique disponible
          </div>
        )}
      </div>
    </div>
  );
};

export default StandHistory;