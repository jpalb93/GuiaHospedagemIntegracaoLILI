import React from 'react';
import { Link } from 'react-router-dom';

type ArticleCategoryBadgeProps = {
    icon: React.ReactNode;
    label: string;
};

export const ArticleCategoryBadge: React.FC<ArticleCategoryBadgeProps> = ({ icon, label }) => (
    <div className="inline-flex items-center gap-2 bg-[#E5C98B]/10 text-[#E5C98B] border border-[#E5C98B]/25 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[0.16em] mb-6">
        {icon}
        <span>{label}</span>
    </div>
);

type CtaLink = {
    href: string;
    label: string;
    icon?: React.ReactNode;
    external?: boolean;
    internal?: boolean;
};

type ArticleFinalCTAProps = {
    eyebrow?: string;
    heading: string;
    description: string;
    primary: CtaLink;
    secondary?: CtaLink;
};

const renderLink = (cta: CtaLink, className: string) => {
    const content = (
        <>
            {cta.icon}
            <span>{cta.label}</span>
        </>
    );

    if (cta.internal) {
        return (
            <Link to={cta.href} className={className}>
                {content}
            </Link>
        );
    }

    return (
        <a
            href={cta.href}
            target={cta.external ? '_blank' : undefined}
            rel={cta.external ? 'noreferrer' : undefined}
            className={className}
        >
            {content}
        </a>
    );
};

export const ArticleFinalCTA: React.FC<ArticleFinalCTAProps> = ({
    eyebrow = 'Flats Integração · Petrolina',
    heading,
    description,
    primary,
    secondary,
}) => (
    <section className="px-4 sm:px-6 mt-20">
        <div className="max-w-4xl mx-auto rounded-[2rem] border border-white/10 bg-[#191714] px-6 py-12 md:p-16 text-center shadow-2xl">
            <span className="inline-block text-xs font-medium uppercase tracking-[0.18em] text-[#E5C98B] mb-3">
                {eyebrow}
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4 font-heading tracking-tight">
                {heading}
            </h2>
            <p className="text-stone-400 mb-9 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
                {description}
            </p>
            <div className="flex flex-col sm:flex-row gap-3.5 justify-center">
                {renderLink(
                    primary,
                    'inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-[#E5C98B] hover:bg-[#edd6a1] text-[#141210] px-8 py-4 text-sm font-semibold transition-all shadow-lg'
                )}
                {secondary &&
                    renderLink(
                        secondary,
                        'inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full border border-white/20 hover:bg-white/10 text-white px-8 py-4 text-sm font-medium transition-colors'
                    )}
            </div>
        </div>
    </section>
);
