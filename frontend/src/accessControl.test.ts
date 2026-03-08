import { describe, it, expect, vi } from 'vitest';
import { accessControlProvider } from './accessControl';

describe('accessControlProvider', () => {
    it('should allow access to dashboard for everyone', async () => {
        const result = await accessControlProvider.can({
            resource: 'dashboard',
            action: 'list'
        });

        expect(result.can).toBe(true);
    });

    it('should deny access to users resource for non-admins', async () => {
        // Mocking can be complex here depending on how you implement it
        // but typically it depends on permissions from authProvider
        const result = await accessControlProvider.can({
            resource: 'users',
            action: 'list',
            params: {
                permissions: ['IS operator']
            }
        });

        expect(result.can).toBe(false);
    });

    it('should allow access to users resource for admins', async () => {
        const result = await accessControlProvider.can({
            resource: 'users',
            action: 'list',
            params: {
                permissions: ['admin']
            }
        });

        expect(result.can).toBe(true);
    });
});
