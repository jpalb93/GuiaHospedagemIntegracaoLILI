import React from 'react';

const CardSkeleton: React.FC = () => (
    <div className="w-full h-full min-h-[160px] p-6 flex flex-col items-center justify-center animate-pulse">
        <div className="w-12 h-12 bg-orange-200/50 dark:bg-orange-800/40 rounded-full mb-3"></div>
        <div className="h-4 w-32 bg-orange-200/50 dark:bg-orange-800/40 rounded mb-2"></div>
        <div className="h-3 w-48 bg-orange-200/50 dark:bg-orange-800/40 rounded"></div>
    </div>
);

export default CardSkeleton;
