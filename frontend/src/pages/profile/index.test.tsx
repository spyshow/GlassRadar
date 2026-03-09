import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProfilePage } from './index';
import { TestWrapper } from '../../test/utils';

// Mock Refine hooks
vi.mock('@refinedev/core', async (importOriginal) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const actual = await importOriginal<any>();
    return {
        ...actual,
        useGetIdentity: () => ({
            data: { id: 'u1', name: 'Test User' },
            isLoading: false,
        }),
    };
});

vi.mock('@refinedev/antd', async (importOriginal) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const actual = await importOriginal<any>();
    return {
        ...actual,
        useForm: () => ({
            formProps: {
                initialValues: {
                    name: 'Test User',
                    email: 'test@example.com',
                    role: 'admin',
                    position: 'Developer'
                }
            },
            saveButtonProps: {},
            queryResult: { isLoading: false },
        }),
    };
});

// Mock Appwrite utility to avoid localStorage error
vi.mock('../../utility', () => ({
    databases: {
        listDocuments: vi.fn().mockResolvedValue({ documents: [{ $id: 'doc1' }] }),
    },
}));

describe('ProfilePage', () => {
    it('should render profile form with user data', async () => {
        render(
            <TestWrapper>
                <ProfilePage />
            </TestWrapper>
        );

        // Should wait for the form to appear (after the docId is fetched)
        await waitFor(() => {
            expect(screen.getByLabelText('Name')).toHaveValue('Test User');
        });
        
        expect(screen.getByLabelText('Position')).toHaveValue('Developer');
        expect(screen.getByLabelText('Role')).toBeDisabled();
    });
});
