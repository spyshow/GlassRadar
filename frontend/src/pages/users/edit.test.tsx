import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { UserEdit } from './edit';
import { TestWrapper } from '../../test/utils';

describe('UserEdit', () => {
    it('should render edit form fields', () => {
        render(
            <TestWrapper>
                <UserEdit />
            </TestWrapper>
        );

        expect(screen.getByLabelText('Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Role')).toBeInTheDocument();
    });
});
