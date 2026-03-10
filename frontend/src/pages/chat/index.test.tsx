import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ChatPage } from './index';
import { TestWrapper } from '../../test/utils';

// Mock Refine core hooks
vi.mock('@refinedev/core', async (importOriginal) => {
    const actual = await importOriginal<any>();
    return {
        ...actual,
        useList: vi.fn(),
        useGetIdentity: vi.fn(() => ({ data: { id: 'current-user', name: 'Current User' } })),
        useCreate: vi.fn(() => ({ mutate: vi.fn(), isLoading: false })),
        useSubscription: vi.fn(),
        useDelete: vi.fn(() => ({ mutate: vi.fn() })),
    };
});

import { useList } from '@refinedev/core';

describe('ChatPage', () => {
    it('should render staff list in sidebar', () => {
        const mockStaff = [
            { userId: '1', name: 'John Doe', email: 'john@example.com' },
            { userId: '2', name: 'Jane Smith', email: 'jane@example.com' },
        ];

        (useList as any).mockImplementation(({ resource }: { resource: string }) => {
            if (resource === 'users') {
                return {
                    query: {
                        data: { data: mockStaff },
                        isLoading: false,
                    },
                };
            }
            return {
                query: {
                    data: { data: [] },
                    isLoading: false,
                },
            };
        });

        render(<ChatPage />, { wrapper: TestWrapper });

        expect(screen.getByText('Direct Messages')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    it('should render public channels', () => {
        (useList as any).mockReturnValue({
            query: {
                data: { data: [] },
                isLoading: false,
            },
        });

        render(<ChatPage />, { wrapper: TestWrapper });

        expect(screen.getByText('Public Channels')).toBeInTheDocument();
        expect(screen.getByText('General')).toBeInTheDocument();
        expect(screen.getByText('IS Machine')).toBeInTheDocument();
    });
});
