export const getCourseFallbackByMeta = (title?: string) => {
    if (title) {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(title)}&background=random&size=400`;
    }
    return "https://via.placeholder.com/400x200?text=Course+Thumbnail";
};

export const getCourseThumbnail = ({ 
    thumbnailUrl, 
    title 
}: { 
    thumbnailUrl?: string; 
    title?: string;
}) => {
    if (thumbnailUrl && thumbnailUrl.trim() !== '') {
        return thumbnailUrl;
    }
    return getCourseFallbackByMeta(title);
};
