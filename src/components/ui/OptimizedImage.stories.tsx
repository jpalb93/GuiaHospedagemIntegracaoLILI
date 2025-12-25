import type { Meta, StoryObj } from '@storybook/react-vite';
import OptimizedImage from './OptimizedImage';

const meta = {
    title: 'UI/OptimizedImage',
    component: OptimizedImage,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        src: { control: 'text' },
        alt: { control: 'text' },
    },
} satisfies Meta<typeof OptimizedImage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        src: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
        alt: 'Modern Apartment',
        className: 'w-64 h-48 rounded-lg',
    },
};

export const LoadingState: Story = {
    args: {
        src: 'https://this-image-does-not-load.com/delay', // Deliberate delay/fail simulation
        alt: 'Loading Image',
        className: 'w-64 h-48 rounded-lg',
    },
    // We can't easily simulate "loading" indefinitely without a custom component or network throttle,
    // but using a slow URL or just switching source works for demo.
    // Actually, OptimizedImage handles loading internal state.
};

export const ErrorState: Story = {
    args: {
        src: 'invalid-image-url.jpg',
        alt: 'Broken Image',
        className: 'w-64 h-48 rounded-lg',
    },
};
