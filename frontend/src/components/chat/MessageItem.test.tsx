import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MessageItem } from './MessageItem';
import { TestWrapper } from '../../test/utils';
import * as core from '@refinedev/core';

// Mock Refine core hooks
vi.mock('@refinedev/core', async (importOriginal) => {
    const actual = await importOriginal<any>();
    return {
        ...actual,
        useGetIdentity: vi.fn(),
        useDelete: vi.fn(() => ({ mutate: vi.fn() })),
    };
});

describe('MessageItem', () => {
    const mockTimestamp = new Date().toISOString();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render message content and sender name', () => {
        (core.useGetIdentity as any).mockReturnValue({ data: { id: 'u1', role: 'user' } });
        
        render(
            <TestWrapper>
                <MessageItem
                    id="1"
                    content="Hello world"
                    senderName="John Doe"
                    senderRole="user"
                    timestamp={mockTimestamp}
                    senderId="u2"
                />
            </TestWrapper>
        );

        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Hello world')).toBeInTheDocument();
    });

    it('should show delete button for the owner', () => {
        (core.useGetIdentity as any).mockReturnValue({ data: { id: 'u1', role: 'user' } });

        render(
            <TestWrapper>
                <MessageItem
                    id="1"
                    content="My message"
                    senderName="Me"
                    senderRole="user"
                    timestamp={mockTimestamp}
                    senderId="u1" // Same as current user
                />
            </TestWrapper>
        );

        expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    });

    it('should show delete button for admin even if not owner', () => {
        (core.useGetIdentity as any).mockReturnValue({ data: { id: 'admin-id', role: 'admin' } });

        render(
            <TestWrapper>
                <MessageItem
                    id="1"
                    content="User message"
                    senderName="User"
                    senderRole="user"
                    timestamp={mockTimestamp}
                    senderId="u2"
                />
            </TestWrapper>
        );

        expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    });

    it('should NOT show delete button for non-owner non-admin', () => {
        (core.useGetIdentity as any).mockReturnValue({ data: { id: 'u1', role: 'user' } });

        render(
            <TestWrapper>
                <MessageItem
                    id="1"
                    content="Other message"
                    senderName="Other"
                    senderRole="user"
                    timestamp={mockTimestamp}
                    senderId="u2"
                />
            </TestWrapper>
        );

        expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
    });

    it('should call deleteMessage on confirm', async () => {
        const deleteMutate = vi.fn();
        (core.useGetIdentity as any).mockReturnValue({ data: { id: 'u1', role: 'user' } });
        (core.useDelete as any).mockReturnValue({ mutate: deleteMutate });

        render(
            <TestWrapper>
                <MessageItem
                    id="msg-123"
                    content="Delete me"
                    senderName="Me"
                    senderRole="user"
                    timestamp={mockTimestamp}
                    senderId="u1"
                />
            </TestWrapper>
        );

        fireEvent.click(screen.getByRole('button', { name: /delete/i }));
        
        // Ant Design Popconfirm shows "Yes" button
        const confirmButton = screen.getByText('Yes');
        fireEvent.click(confirmButton);

        expect(deleteMutate).toHaveBeenCalledWith({
            resource: "messages",
            id: "msg-123",
        });
    });
});
