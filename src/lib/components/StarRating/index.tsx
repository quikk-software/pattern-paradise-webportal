import { Star } from 'lucide-react';

interface StarRatingProps {
  rating?: number;
  totalRatings?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

export default function StarRating({
  rating,
  totalRatings,
  size = 'sm',
  showCount = true,
}: StarRatingProps) {
  if (rating === undefined) {
    return null;
  }

  const clampedRating = Math.max(0, Math.min(5, rating));

  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const renderStars = () => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      const difference = clampedRating - i + 1;

      if (difference >= 1) {
        stars.push(
          <Star key={i} className={`${sizeClasses[size]} fill-yellow-400 text-yellow-400`} />,
        );
      } else if (difference > 0) {
        stars.push(
          <div key={i} className="relative">
            <Star className={`${sizeClasses[size]} text-gray-300`} />
            <div
              className="absolute top-0 left-0 overflow-hidden"
              style={{ width: `${difference * 100}%` }}
            >
              <Star className={`${sizeClasses[size]} fill-yellow-400 text-yellow-400`} />
            </div>
          </div>,
        );
      } else {
        stars.push(<Star key={i} className={`${sizeClasses[size]} text-gray-300`} />);
      }
    }

    return stars;
  };

  const formatRating = (rating: number) => {
    return rating % 1 === 0 ? rating.toString() : rating.toFixed(1);
  };

  const formatTotalRatings = (total: number) => {
    if (total >= 1000000) {
      return `${(total / 1000000).toFixed(1)}M`;
    } else if (total >= 1000) {
      return `${(total / 1000).toFixed(1)}k`;
    }
    return total.toLocaleString();
  };

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">{renderStars()}</div>

      {showCount ? (
        <div className={`flex items-center gap-1 ${textSizeClasses[size]}`}>
          <span className="font-semibold text-gray-900">{formatRating(clampedRating)}</span>
          {totalRatings !== undefined && totalRatings > 0 && (
            <>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600 font-medium">
                {formatTotalRatings(totalRatings)} {totalRatings === 1 ? 'review' : 'reviews'}
              </span>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
