import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageTransitionProps {
    children: React.ReactNode;
    className?: string;
}

const variants = {
    initial: {
        opacity: 0,
        y: 8,
        scale: 0.98
    },
    enter: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: [0.61, 1, 0.88, 1] as const,
        }
    },
    exit: {
        opacity: 0,
        y: 8,
        scale: 0.98,
        transition: {
            duration: 0.3,
            ease: [0.61, 1, 0.88, 1] as const,
        }
    }
};

export const PageTransition: React.FC<PageTransitionProps> = ({ children, className }) => {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                initial="initial"
                animate="enter"
                exit="exit"
                variants={variants}
                className={className}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
};
