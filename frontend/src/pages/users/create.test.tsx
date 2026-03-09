import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { UserCreate } from './create';
import { TestWrapper } from '../../test/utils';

describe('UserCreate', () => {
    it('should render create form fields', () => {
        render(
            <TestWrapper>
                <UserCreate />
            </TestWrapper>
        );

        expect(screen.getByLabelText('Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Role')).toBeInTheDocument();
    });
});
