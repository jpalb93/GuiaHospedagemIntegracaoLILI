import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';

const meta = {
    title: 'UI/Badge',
    component: Badge,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['orange', 'blue', 'green', 'yellow', 'red', 'gray'],
        },
    },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        children: 'Badge',
        variant: 'gray',
    },
};

export const Green: Story = {
    args: {
        variant: 'green',
        children: 'Success',
    },
};

export const Red: Story = {
    args: {
        variant: 'red',
        children: 'Error',
    },
};

export const Orange: Story = {
    args: {
        variant: 'orange',
        children: 'Warning',
    },
};
