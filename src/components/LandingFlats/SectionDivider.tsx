import React from 'react';

/**
 * Divisor editorial da landing: linha stone no trilho max-w-[1400px]
 * com marca curta em gradiente à esquerda.
 */
const SectionDivider: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div className={`w-full bg-stone-950 ${className}`} aria-hidden="true">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className="relative h-px w-full bg-stone-800/80">
                <span className="absolute left-0 top-0 h-px w-16 md:w-24 bg-gradient-to-r from-orange-500 to-amber-500" />
            </div>
        </div>
    </div>
);

export default SectionDivider;
