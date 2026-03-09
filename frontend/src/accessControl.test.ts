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
        const result = await accessControlProvider.can({
            resource: 'users',
            action: 'list',
            params: {
                permissions: ['IS operator']
            }
        });

        expect(result.can).toBe(false);
    });

    it('should deny access to create user for non-admins', async () => {
        const result = await accessControlProvider.can({
            resource: 'users',
            action: 'create',
            params: {
                permissions: ['QC']
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
