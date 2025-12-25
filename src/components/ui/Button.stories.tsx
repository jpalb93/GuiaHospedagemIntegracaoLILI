import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';
import { Mail, ArrowRight } from 'lucide-react';

const meta = {
    title: 'UI/Button',
    component: Button,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['primary', 'secondary', 'ghost', 'icon', 'danger'],
        },
        size: {
            control: 'radio',
            options: ['sm', 'md', 'lg'],
        },
        fullWidth: {
            control: 'boolean',
        },
    },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        variant: 'primary',
        children: 'Primary Button',
    },
};

export const Secondary: Story = {
    args: {
        variant: 'secondary',
        children: 'Secondary Button',
    },
};

export const Ghost: Story = {
    args: {
        variant: 'ghost',
        children: 'Ghost Button',
    },
};

export const Danger: Story = {
    args: {
        variant: 'danger',
        children: 'Danger Button',
    },
};

export const WithIcon: Story = {
    args: {
        variant: 'primary',
        children: 'Send Email',
        leftIcon: <Mail className="w-4 h-4 mr-2" />,
    },
};

export const IconOnly: Story = {
    args: {
        variant: 'icon',
        children: <ArrowRight className="w-5 h-5" />,
        'aria-label': 'Next',
    },
};

export const FullWidth: Story = {
    args: {
        fullWidth: true,
        children: 'Full Width Button',
    },
    parameters: {
        layout: 'padded',
    },
};
