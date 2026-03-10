import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ChatWindow } from './ChatWindow';
import { TestWrapper } from '../../test/utils';
import * as core from '@refinedev/core';

// Mock Refine hooks
vi.mock('@refinedev/core', async (importOriginal) => {
    const actual = await importOriginal<any>();
    return {
        ...actual,
        useList: vi.fn(),
        useCreate: vi.fn(),
        useGetIdentity: vi.fn(),
        useSubscription: vi.fn(),
        useDelete: vi.fn(() => ({ mutate: vi.fn() })),
    };
});

describe('ChatWindow', () => {
    const mockIdentity = { id: 'u1', name: 'Current User', role: 'admin' };
    const mockMessages = [
        {
            $id: '1',
            content: 'Test message',
            senderName: 'Test Sender',
            senderRole: 'QC',
            timestamp: new Date().toISOString(),
            senderId: 'u2'
        }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        (core.useGetIdentity as any).mockReturnValue({ data: mockIdentity, isLoading: false });
        (core.useList as any).mockReturnValue({
            query: {
                data: { data: mockMessages },
                isLoading: false,
            }
        });
        (core.useCreate as any).mockReturnValue({
            mutate: vi.fn(),
            isLoading: false,
        });
    });

    it('should render messages and input', async () => {
        render(
            <TestWrapper>
                <ChatWindow channel="general" />
            </TestWrapper>
        );

        expect(screen.getByText('Test Sender')).toBeInTheDocument();
        expect(screen.getByText('Test message')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Type a message...')).toBeInTheDocument();
    });

    it('should use consistent private channel ID for DMs', () => {
        const recipient = { id: 'u2', name: 'Jane Doe' };
        
        render(
            <TestWrapper>
                <ChatWindow recipient={recipient} />
            </TestWrapper>
        );

        expect(core.useList).toHaveBeenCalledWith(expect.objectContaining({
            filters: expect.arrayContaining([
                expect.objectContaining({
                    field: 'channel',
                    value: 'private_u1_u2' // u1 < u2
                })
            ])
        }));
    });

    it('should include recipientId and isPrivate when sending a DM', async () => {
        const recipient = { id: 'u2', name: 'Jane Doe' };
        const mutate = vi.fn();
        (core.useCreate as any).mockReturnValue({
            mutate,
            isLoading: false,
        });

        render(
            <TestWrapper>
                <ChatWindow recipient={recipient} />
            </TestWrapper>
        );

        const input = screen.getByPlaceholderText('Message Jane Doe...');
        fireEvent.change(input, { target: { value: 'Hello Jane' } });
        fireEvent.click(screen.getByText('Send'));

        await waitFor(() => {
            expect(mutate).toHaveBeenCalledWith(expect.objectContaining({
                values: expect.objectContaining({
                    content: 'Hello Jane',
                    recipientId: 'u2',
                    isPrivate: true,
                    channel: 'private_u1_u2'
                })
            }));
        });
    });

    it('should show all messages (no filter) when channel is global and user is admin', () => {
        (core.useGetIdentity as any).mockReturnValue({ data: { id: 'admin-1', role: 'admin' }, isLoading: false });

        render(
            <TestWrapper>
                <ChatWindow channel="global" />
            </TestWrapper>
        );

        expect(core.useList).toHaveBeenCalledWith(expect.objectContaining({
            filters: []
        }));
    });
});
