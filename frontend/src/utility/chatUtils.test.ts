import { describe, it, expect } from 'vitest';
import { getPrivateChannelId } from './chatUtils';

describe('chatUtils', () => {
    describe('getPrivateChannelId', () => {
        it('should generate a consistent ID regardless of argument order', () => {
            const id1 = 'abc';
            const id2 = 'xyz';
            
            const result1 = getPrivateChannelId(id1, id2);
            const result2 = getPrivateChannelId(id2, id1);
            
            expect(result1).toBe(result2);
            expect(result1).toBe('private_abc_xyz');
        });

        it('should handle numeric-like strings correctly', () => {
            const id1 = '10';
            const id2 = '2';
            
            const result = getPrivateChannelId(id1, id2);
            
            // Lexicographical sort: '10' comes before '2'
            expect(result).toBe('private_10_2');
        });
    });
});
