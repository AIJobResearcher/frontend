import React from 'react';
import { VacancyPreview } from '@/types/vacancy';
import { formatSalary } from '@/utils/salaryFormatter';
import { formatRelativeDate } from '@/utils/dateFormatter';
import { EMPLOYMENT_TYPES, WORKPLACE_TYPES } from '@/utils/constants';
import './VacancyCard.css';

interface VacancyCardProps {
  vacancy: VacancyPreview;
  isActive?: boolean;
  onClick: () => void;
}

/**
 * Card component for displaying a single vacancy in the list
 */
export const VacancyCard: React.FC<VacancyCardProps> = ({ vacancy, isActive, onClick }) => {
  const companyInitial = vacancy.employer_name.charAt(0).toUpperCase();

  return (
    <div
      className={`vacancy-card ${isActive ? 'active' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
    >
      <div className="vacancy-card__header">
        <div className="vacancy-card__logo">{companyInitial}</div>
        <div className="vacancy-card__title-section">
          <h4 className="vacancy-card__title">{vacancy.title}</h4>
          <p className="vacancy-card__company">{vacancy.employer_name}</p>
        </div>
      </div>

      <div className="vacancy-card__meta">
        <span className="vacancy-card__type">Contract</span>
        <span className="vacancy-card__location">{vacancy.location}</span>
      </div>

      <div className="vacancy-card__footer">
        <span className="vacancy-card__date">{formatRelativeDate(vacancy.published_at)}</span>
        <span className="vacancy-card__salary">
          {formatSalary(vacancy.salary_min, vacancy.salary_max, vacancy.currency)}
        </span>
      </div>
    </div>
  );
};
