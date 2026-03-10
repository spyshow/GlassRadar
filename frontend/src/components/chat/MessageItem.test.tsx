import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MessageItem } from './MessageItem';
import { TestWrapper } from '../../test/utils';

describe('MessageItem', () => {
    it('should render message content and sender name', () => {
        render(
            <TestWrapper>
                <MessageItem
                    id="1"
                    content="Hello world"
                    senderName="John Doe"
                    senderRole="admin"
                    timestamp={new Date().toISOString()}
                    senderId="u1"
                />
            </TestWrapper>
        );

        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Hello world')).toBeInTheDocument();
    });

    it('should show user details in popover on hover', async () => {
        render(
            <TestWrapper>
                <MessageItem
                    id="1"
                    content="Hello world"
                    senderName="John Doe"
                    senderRole="admin"
                    timestamp={new Date().toISOString()}
                    senderId="u1"
                />
            </TestWrapper>
        );

        const nameElement = screen.getByText('John Doe');
        fireEvent.mouseEnter(nameElement);

        await waitFor(() => {
            expect(screen.getByText('ADMIN')).toBeInTheDocument();
        });
    });
});
