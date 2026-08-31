import React from 'react';
import { Vacancy } from '@/types/vacancy';
import { Spinner, ErrorFallback } from '@/components/common';

interface VacancyDetailProps {
  vacancy: Vacancy | null;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onApply: () => void;
}

export const VacancyDetail: React.FC<VacancyDetailProps> = ({
                                                              vacancy,
                                                              isLoading,
                                                              error,
                                                              onRetry,
                                                              onApply,
                                                            }) => {
  if (isLoading) {
    return (
        <div className="bg-white rounded-lg p-6">
          <Spinner size="md" label="Loading vacancy details..." />
        </div>
    );
  }

  if (error) {
    return (
        <div className="bg-white rounded-lg p-6">
          <ErrorFallback message={error} onRetry={onRetry} />
        </div>
    );
  }

  if (!vacancy) {
    return (
        <div className="bg-white rounded-lg p-6 text-center text-gray-500">
          <p>Select a vacancy to view details</p>
        </div>
    );
  }

  const salary =
      vacancy.min_salary && vacancy.max_salary
          ? `$${vacancy.min_salary}K - $${vacancy.max_salary}K`
          : 'Not specified';

  return (
      <div className="bg-white rounded-lg overflow-hidden shadow-sm">
        {vacancy.company_logo && (
            <img
                src={vacancy.company_logo}
                alt={vacancy.employer?.name || ''}
                className="w-full h-40 object-cover"
            />
        )}

        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{vacancy.title}</h2>
          <p className="text-lg text-gray-600 mb-4">{vacancy.employer?.name || ''}</p>

          <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b">
            <div>
              <p className="text-sm text-gray-600">Location</p>
              <p className="font-semibold text-gray-900">
                {vacancy.city}, {vacancy.country}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Salary</p>
              <p className="font-semibold text-gray-900">{salary}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Employment Type</p>
              <p className="font-semibold text-gray-900">{vacancy.employment_type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Workplace</p>
              <p className="font-semibold text-gray-900">{vacancy.workplace}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
            <p className="text-gray-600 whitespace-pre-line">{vacancy.description}</p>
          </div>

          {vacancy.requirements && vacancy.requirements.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {vacancy.requirements.map((req, idx) => (
                      <li key={idx} className="text-gray-600">
                        {req}
                      </li>
                  ))}
                </ul>
              </div>
          )}

          {vacancy.company_description && (
              <div className="mb-6 pb-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About Company</h3>
                <p className="text-gray-600 whitespace-pre-line">{vacancy.company_description}</p>
              </div>
          )}

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact</h3>
            <div className="space-y-2">
              {vacancy.company_website && (
                  <p>
                    <span className="text-gray-600">Website: </span>
                    <a
                        href={vacancy.company_website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                    >
                      {vacancy.company_website}
                    </a>
                  </p>
              )}
              {vacancy.company_email && (
                  <p>
                    <span className="text-gray-600">Email: </span>
                    <a
                        href={`mailto:${vacancy.company_email}`}
                        className="text-blue-600 hover:text-blue-800"
                    >
                      {vacancy.company_email}
                    </a>
                  </p>
              )}
              {vacancy.company_phone && (
                  <p>
                    <span className="text-gray-600">Phone: </span>
                    <a
                        href={`tel:${vacancy.company_phone}`}
                        className="text-blue-600 hover:text-blue-800"
                    >
                      {vacancy.company_phone}
                    </a>
                  </p>
              )}
            </div>
          </div>

          <button onClick={onApply} className="w-full btn btn-primary btn-lg">
            Apply Now
          </button>
        </div>
      </div>
  );
};