import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
    children: React.ReactNode;
    threshold?: number;
    delay?: string; // class like 'delay-100'
    className?: string;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
    children,
    threshold = 0.1,
    delay = '',
    className = '',
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect(); // Only animate once
                }
            },
            { threshold }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [threshold]);

    return (
        <div
            ref={ref}
            className={`transition-all duration-1000 ease-out transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            } ${delay} ${className}`}
        >
            {children}
        </div>
    );
};

export default ScrollReveal;
