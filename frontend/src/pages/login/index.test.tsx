import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LoginPage } from './index';
import { BrowserRouter } from 'react-router';

// Mock Refine components/hooks as needed
vi.mock('@refinedev/antd', () => ({
    AuthPage: ({ type }: { type: string }) => <div data-testid="auth-page">{type}</div>,
}));

describe('LoginPage', () => {
    it('should render login form', () => {
        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );

        expect(screen.getByTestId('auth-page')).toBeInTheDocument();
        expect(screen.getByText('login')).toBeInTheDocument();
    });
});
