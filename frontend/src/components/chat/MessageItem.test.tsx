import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MessageItem } from './MessageItem';
import { TestWrapper } from '../../test/utils';

describe('MessageItem', () => {
    it('should render message content and sender info', () => {
        render(
            <TestWrapper>
                <MessageItem
                    content="Hello world"
                    senderName="John Doe"
                    senderRole="admin"
                    timestamp={new Date().toISOString()}
                />
            </TestWrapper>
        );

        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('ADMIN')).toBeInTheDocument();
        expect(screen.getByText('Hello world')).toBeInTheDocument();
    });
});
