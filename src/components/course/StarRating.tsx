import React, { useState } from 'react';

interface StarRatingProps {
    value: number;
    onChange?: (rating: number) => void;
    readonly?: boolean;
    size?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ value, onChange, readonly = false, size = 24 }) => {
    const [hovered, setHovered] = useState(0);

    return (
        <div style={{ display: 'flex', gap: 4 }}>
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    onClick={() => !readonly && onChange?.(star)}
                    onMouseEnter={() => !readonly && setHovered(star)}
                    onMouseLeave={() => !readonly && setHovered(0)}
                    style={{
                        fontSize: size,
                        cursor: readonly ? 'default' : 'pointer',
                        color: star <= (hovered || value) ? '#fbbf24' : '#d1d5db',
                        transition: 'color 0.15s',
                        userSelect: 'none',
                    }}
                >
                    ★
                </span>
            ))}
        </div>
    );
};

export default StarRating;