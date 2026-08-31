import React, { useMemo } from 'react';
import { Vacancy } from '@/types/vacancy';
import { formatSalary } from '@/utils/salaryFormatter';
import { formatDate } from '@/utils/dateFormatter';
import { EMPLOYMENT_TYPES, WORKPLACE_TYPES } from '@/utils/constants';
import { Spinner, ErrorFallback } from '@/components/common';
import './VacancyDetail.css';

interface VacancyDetailProps {
  vacancy: Vacancy | null;
  isLoading: boolean;
  error: string | null;
  onRetry?: () => void;
  onApply?: () => void;
}

/**
 * Detail view component for a selected vacancy
 */
export const VacancyDetail: React.FC<VacancyDetailProps> = ({
  vacancy,
  isLoading,
  error,
  onRetry,
  onApply,
}) => {
  if (isLoading) {
    return (
      <div className="vacancy-detail">
        <Spinner size="md" label="Loading vacancy details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="vacancy-detail">
        <ErrorFallback message={error} onRetry={onRetry} />
      </div>
    );
  }

  if (!vacancy) {
    return (
      <div className="vacancy-detail-empty">
        <p>Select a vacancy to view details</p>
      </div>
    );
  }

  return (
    <div className="vacancy-detail">
      <div className="vacancy-detail__header">
        <h2 className="vacancy-detail__title">{vacancy.title}</h2>
        <p className="vacancy-detail__posted">{formatDate(vacancy.posted_at)}</p>
      </div>

      {/* Company Section */}
      <div className="vacancy-detail__section">
        <h3 className="vacancy-detail__section-title">Company</h3>
        <div className="vacancy-detail__company">
          <p className="vacancy-detail__company-name">
            <a href="#" className="vacancy-detail__link">
              {vacancy.employer.name}
            </a>
          </p>
          {vacancy.employer.description && (
            <p className="vacancy-detail__company-description">{vacancy.employer.description}</p>
          )}
        </div>
        <div className="vacancy-detail__contacts">
          {vacancy.employer.website && (
            <a href={vacancy.employer.website} target="_blank" rel="noopener noreferrer" className="vacancy-detail__contact-link">
              🌐 Website
            </a>
          )}
          {vacancy.employer.phone && (
            <a href={`tel:${vacancy.employer.phone}`} className="vacancy-detail__contact-link">
              ☎️ {vacancy.employer.phone}
            </a>
          )}
          {vacancy.employer.email && (
            <a href={`mailto:${vacancy.employer.email}`} className="vacancy-detail__contact-link">
              ✉️ {vacancy.employer.email}
            </a>
          )}
        </div>
      </div>

      <hr className="vacancy-detail__divider" />

      {/* Job Details */}
      <div className="vacancy-detail__section">
        <h3 className="vacancy-detail__section-title">Job Details</h3>
        <div className="vacancy-detail__info-grid">
          <div className="vacancy-detail__info-item">
            <span className="vacancy-detail__info-label">Employment Type:</span>
            <span className="vacancy-detail__info-value">{vacancy.employment_type}</span>
          </div>
          <div className="vacancy-detail__info-item">
            <span className="vacancy-detail__info-label">Workplace:</span>
            <span className="vacancy-detail__info-value">{WORKPLACE_TYPES[vacancy.workplace] || vacancy.workplace}</span>
          </div>
          <div className="vacancy-detail__info-item">
            <span className="vacancy-detail__info-label">Location:</span>
            <span className="vacancy-detail__info-value">{vacancy.city}, {vacancy.country}</span>
          </div>
          <div className="vacancy-detail__info-item">
            <span className="vacancy-detail__info-label">Salary:</span>
            <span className="vacancy-detail__info-value">
              {formatSalary(vacancy.min_salary, vacancy.max_salary, vacancy.currency)}
            </span>
          </div>
        </div>
      </div>

      <hr className="vacancy-detail__divider" />

      {/* Description */}
      <div className="vacancy-detail__section">
        <h3 className="vacancy-detail__section-title">Description</h3>
        <div className="vacancy-detail__description">{vacancy.description}</div>
      </div>

      <hr className="vacancy-detail__divider" />

      {/* Requirements */}
      <div className="vacancy-detail__section">
        <h3 className="vacancy-detail__section-title">Requirements</h3>
        {vacancy.requirements && vacancy.requirements.length > 0 ? (
          <ul className="vacancy-detail__requirements">
            {vacancy.requirements.map((req, idx) => (
              <li key={idx}>{req}</li>
            ))}
          </ul>
        ) : (
          <p className="vacancy-detail__no-requirements">No requirements specified</p>
        )}
      </div>

      {/* Apply Button */}
      <div className="vacancy-detail__actions">
        <button
          className="btn btn-primary btn-lg"
          onClick={onApply}
          title="This feature will be available in the next version"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
};
