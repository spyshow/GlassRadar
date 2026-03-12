import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { FloatingChat } from './FloatingChat';
import { TestWrapper } from '../../test/utils';
import * as core from '@refinedev/core';

// Mock Refine core hooks
vi.mock('@refinedev/core', async (importOriginal) => {
    const actual = await importOriginal<Record<string, unknown>>();
    return {
        ...actual,
        useList: vi.fn(),
        useGetIdentity: vi.fn(),
        useCreate: vi.fn(() => ({ mutate: vi.fn(), mutation: { isPending: false } })),
        useSubscription: vi.fn(),
        useDelete: vi.fn(() => ({ mutate: vi.fn() })),
    };
});

describe('FloatingChat', () => {
    const mockStaff = [
        { userId: '1', name: 'John Operator', role: 'IS operator' },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        (core.useGetIdentity as Mock).mockReturnValue({ data: { id: 'u1', name: 'Admin' } });
        (core.useList as Mock).mockReturnValue({
            query: {
                data: { data: mockStaff },
                isLoading: false,
            }
        });
    });

    it('should render the chat button when closed', () => {
        render(<FloatingChat />, { wrapper: TestWrapper });
        expect(screen.getByText('Industrial Chat')).toBeInTheDocument();
    });

    it('should open chat window and show staff options in select', async () => {
        render(<FloatingChat />, { wrapper: TestWrapper });
        
        const button = screen.getByText('Industrial Chat');
        fireEvent.click(button);

        // Check if Select is present
        const select = screen.getByRole('combobox');
        expect(select).toBeInTheDocument();

        // Open the select dropdown
        fireEvent.mouseDown(select);

        await waitFor(() => {
            // Ant Design Select options are rendered in a portal
            expect(screen.getByText('John Operator')).toBeInTheDocument();
        });
    });
});
