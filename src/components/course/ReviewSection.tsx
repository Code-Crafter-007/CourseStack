import React, { useEffect, useState } from 'react';
import { reviewService } from '../../services/reviewService';
import { useAuth } from '../../context/AuthContext';
import StarRating from './StarRating';

interface ReviewSectionProps {
    courseId: string;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ courseId }) => {
    const { currentUser } = useAuth();
    const userId = (currentUser as any)?.user_id ?? null;

    const [reviews, setReviews] = useState<any[]>([]);
    const [avgRating, setAvgRating] = useState(0);
    const [hasReviewed, setHasReviewed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form state
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchReviews = async () => {
        setLoading(true);
        const [data, avg] = await Promise.all([
            reviewService.getReviews(courseId),
            reviewService.getAverageRating(courseId)
        ]);
        setReviews(data);
        setAvgRating(avg);

        if (userId) {
            const reviewed = await reviewService.hasUserReviewed(courseId, userId);
            setHasReviewed(reviewed);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchReviews();
    }, [courseId]);

    const handleSubmit = async () => {
        if (!userId) return setError('Please log in to submit a review.');
        if (rating === 0) return setError('Please select a star rating.');
        if (!comment.trim()) return setError('Please write a comment.');

        setSubmitting(true);
        setError('');
        try {
            await reviewService.submitReview(courseId, userId, rating, comment);
            setSuccess('Review submitted successfully!');
            setRating(0);
            setComment('');
            await fetchReviews();
        } catch {
            setError('Failed to submit review. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    };

    return (
        <div style={{ marginTop: '2rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>
                    Student Reviews
                </h2>
                {avgRating > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <StarRating value={Math.round(avgRating)} readonly size={20} />
                        <span style={{ fontWeight: 600, color: '#fbbf24' }}>{avgRating}</span>
                        <span style={{ opacity: 0.6, fontSize: '0.9rem' }}>
                            ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                        </span>
                    </div>
                )}
            </div>

            {/* Submit Review Form */}
            {!hasReviewed && userId && (
                <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                    <h3 style={{ fontWeight: 600, marginBottom: '1rem', fontSize: '1rem' }}>
                        Write a Review
                    </h3>

                    <div style={{ marginBottom: '1rem' }}>
                        <p style={{ fontSize: '0.9rem', opacity: 0.7, marginBottom: 8 }}>Your Rating</p>
                        <StarRating value={rating} onChange={setRating} size={32} />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <p style={{ fontSize: '0.9rem', opacity: 0.7, marginBottom: 8 }}>Your Review</p>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your experience with this course..."
                            rows={4}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: 8,
                                border: '1px solid rgba(255,255,255,0.1)',
                                background: 'rgba(255,255,255,0.05)',
                                color: 'inherit',
                                fontSize: '0.95rem',
                                resize: 'vertical',
                                outline: 'none',
                                boxSizing: 'border-box',
                            }}
                        />
                    </div>

                    {error && (
                        <p style={{ color: '#f87171', fontSize: '0.9rem', marginBottom: 8 }}>{error}</p>
                    )}
                    {success && (
                        <p style={{ color: '#34d399', fontSize: '0.9rem', marginBottom: 8 }}>{success}</p>
                    )}

                    <button
                        className="btn-primary"
                        onClick={handleSubmit}
                        disabled={submitting}
                        style={{ opacity: submitting ? 0.7 : 1 }}
                    >
                        {submitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                </div>
            )}

            {hasReviewed && (
                <div style={{
                    padding: '1rem',
                    borderRadius: 8,
                    background: 'rgba(52,211,153,0.1)',
                    border: '1px solid rgba(52,211,153,0.2)',
                    marginBottom: '1.5rem',
                    fontSize: '0.9rem',
                    color: '#34d399'
                }}>
                    ✓ You have already reviewed this course
                </div>
            )}

            {/* Reviews List */}
            {loading ? (
                <p style={{ opacity: 0.6 }}>Loading reviews...</p>
            ) : reviews.length === 0 ? (
                <p style={{ opacity: 0.6 }}>No reviews yet. Be the first to review!</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {reviews.map((review) => (
                        <div key={review.review_id} className="glass-card" style={{ padding: '1.25rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    {/* Avatar */}
                                    <div style={{
                                        width: 38, height: 38, borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                                        display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', fontWeight: 700,
                                        fontSize: '0.95rem', color: '#fff', flexShrink: 0
                                    }}>
                                        {review.users?.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: 600, margin: 0, fontSize: '0.95rem' }}>
                                            {review.users?.name || 'Anonymous'}
                                        </p>
                                        <StarRating value={review.rating} readonly size={14} />
                                    </div>
                                </div>
                                <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>
                                    {formatDate(review.created_at)}
                                </span>
                            </div>
                            {review.comment && (
                                <p style={{ margin: 0, fontSize: '0.95rem', opacity: 0.85, lineHeight: 1.6 }}>
                                    {review.comment}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReviewSection;