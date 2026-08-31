import React from 'react';
import { VacancyPreview } from '@/types/vacancy';

interface VacancyCardProps {
  vacancy: VacancyPreview;
  isActive: boolean;
  onClick: () => void;
}

export const VacancyCard: React.FC<VacancyCardProps> = ({ vacancy, isActive, onClick }) => {
  const salary =
      vacancy.salary_min && vacancy.salary_max
          ? `$${vacancy.salary_min}K - $${vacancy.salary_max}K`
          : 'Not specified';
  const postedAt = vacancy.published_at
      ? new Date(vacancy.published_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
      : '';

  return (
      <div
          onClick={onClick}
          className={`p-4 mb-4 bg-white rounded-lg border-2 cursor-pointer transition-all ${
              isActive ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:border-gray-300'
          }`}
      >
        <div className="flex gap-4">
          {vacancy.company_logo && (
              <img
                  src={vacancy.company_logo}
                  alt={vacancy.employer_name}
                  className="w-12 h-12 rounded object-cover flex-shrink-0"
              />
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{vacancy.title}</h3>
            <p className="text-sm text-gray-600 truncate">{vacancy.employer_name}</p>
            <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-600">
              <span>📍 {vacancy.location}</span>
              <span>💰 {salary}</span>
              <span className="text-gray-500">{postedAt}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {vacancy.employment_type && (
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                {vacancy.employment_type}
              </span>
              )}
              {vacancy.status === 'open' && (
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded">
                ✓ Open
              </span>
              )}
            </div>
          </div>
        </div>
      </div>
  );
};