/**
 * Generates a consistent, deterministic channel ID for a pair of users.
 * The ID is always 'private_' followed by the two user IDs sorted lexicographically.
 */
export const getPrivateChannelId = (id1: string, id2: string): string => {
    const ids = [id1, id2].sort();
    return `private_${ids[0]}_${ids[1]}`;
};
