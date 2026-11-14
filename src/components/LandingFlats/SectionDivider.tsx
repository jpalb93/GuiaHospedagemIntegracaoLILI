import React from 'react';

/**
 * Divisor editorial da landing: linha stone no trilho max-w-[1400px]
 * com marca curta em gradiente à esquerda.
 */
const SectionDivider: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div className={`w-full bg-[#12110F] ${className}`} aria-hidden="true">
        <div className="max-w-[1320px] mx-auto px-6 md:px-12">
            <div className="relative h-px w-full bg-white/10">
                <span className="absolute left-0 top-0 h-px w-16 md:w-24 bg-gradient-to-r from-[#E5C98B] to-[#E5C98B]/20" />
            </div>
        </div>
    </div>
);

export default SectionDivider;
