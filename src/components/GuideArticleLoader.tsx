import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import WineRouteArticle from '../pages/articles/WineRoute';
import BododromoArticle from '../pages/articles/Bododromo';
import RioSaoFranciscoArticle from '../pages/articles/RioSaoFrancisco';
import CorporateArticle from '../pages/articles/Corporate';

// Simple map for now, can be expanded or dynamic
export const ARTICLES_MAP: Record<string, React.FC> = {
    'roteiro-vinho-petrolina': WineRouteArticle,
    'onde-comer-petrolina-bododromo': BododromoArticle,
    'rio-sao-francisco-rodeadouro-barquinha': RioSaoFranciscoArticle,
    'hospedagem-corporativa-empresas-petrolina': CorporateArticle,
};

const GuideArticleLoader: React.FC = () => {
    const { slug } = useParams();

    // Sanitização: remove barra final se existir
    const sanitizedSlug = slug?.endsWith('/') ? slug.slice(0, -1) : slug;

    // Check if we have a component for this slug
    if (sanitizedSlug && ARTICLES_MAP[sanitizedSlug]) {
        const Component = ARTICLES_MAP[sanitizedSlug];
        return <Component />;
    }

    // Check if valid slug in data but component missing (shouldn't happen if maintained)
    // or just invalid slug
    return <Navigate to="/guia" replace />;
};

export default GuideArticleLoader;
