import React from 'react';
import { PATH_MAIN, PATH_SUN, PATH_CACTUS } from './LogoLiliPaths';

export interface LogoLiliProps {
    className?: string;
    sunClassName?: string;
    textClassName?: string;
}

const LogoLili: React.FC<LogoLiliProps> = ({
    className = 'h-16 w-auto',
    sunClassName = 'text-yellow-400', // Default sun color
    textClassName = 'text-current', // Default text/cactus color
}) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1941 872.8"
            className={className}
            fill="none" // Ensure fill is controlled by paths
        >
            <g transform="translate(-630 -227.8)" strokeWidth=".218">
                {/* Sol - Amarelo (ou customizável via sunClassName) */}
                <path d={PATH_SUN} className={sunClassName} fill="currentColor" />

                {/* Texto e Ponte - Herda cor do texto (currentColor) */}
                <path d={PATH_MAIN} className={textClassName} fill="currentColor" />

                {/* Cacto - Herda cor do texto (currentColor) */}
                <path d={PATH_CACTUS} className={textClassName} fill="currentColor" />
            </g>
        </svg>
    );
};

export default LogoLili;
