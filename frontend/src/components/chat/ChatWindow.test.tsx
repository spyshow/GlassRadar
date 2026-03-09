import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ChatWindow } from './ChatWindow';
import { TestWrapper } from '../../test/utils';

// Mock Refine hooks
vi.mock('@refinedev/core', async (importOriginal) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const actual = await importOriginal<any>();
    return {
        ...actual,
        useList: () => ({
            query: {
                data: {
                    data: [
                        {
                            $id: '1',
                            content: 'Test message',
                            senderName: 'Test Sender',
                            senderRole: 'QC',
                            timestamp: new Date().toISOString(),
                        }
                    ]
                },
                isLoading: false,
            }
        }),
        useCreate: () => ({
            mutate: vi.fn(),
            isLoading: false,
        }),
        useGetIdentity: () => ({
            data: { id: 'u1', name: 'Current User', role: 'admin' },
            isLoading: false,
        }),
    };
});

describe('ChatWindow', () => {
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
});
