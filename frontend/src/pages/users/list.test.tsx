import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { UserList } from './list';
import { TestWrapper } from '../../test/utils';

// Mock Refine's useTable which is used by UserList
vi.mock('@refinedev/antd', async (importOriginal) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const actual = await importOriginal<any>();
    return {
        ...actual,
        useTable: () => ({
            tableProps: {
                dataSource: [
                    {
                        $id: '1',
                        userId: 'u1',
                        email: 'test@example.com',
                        name: 'Test User',
                        role: 'admin',
                        position: 'Manager'
                    }
                ],
                loading: false,
                pagination: {
                    current: 1,
                    pageSize: 10,
                    total: 1
                }
            },
        }),
    };
});

describe('UserList', () => {
    it('should render user table with correct columns', async () => {
        render(
            <TestWrapper>
                <UserList />
            </TestWrapper>
        );

        expect(screen.getByText('Name')).toBeInTheDocument();
        expect(screen.getByText('Email')).toBeInTheDocument();
        expect(screen.getByText('Role')).toBeInTheDocument();
        expect(screen.getByText('Test User')).toBeInTheDocument();
        expect(screen.getByText('test@example.com')).toBeInTheDocument();
        
        // Check for presence of action buttons by their roles or icons if possible
        // Since they are mocked or standard antd components, we check for 'Actions' column
        expect(screen.getByText('Actions')).toBeInTheDocument();
    });
});
