const sum = (a, b) => a + b;

test('checks if 1 + 1 equals 2', () => {
    expect(sum(1, 1)).toBe(2);
});

export const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWUxY2I4ZTY4NzU4N2ZiNTgwM2M5NWYiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTcwOTI5OTY1MywiZXhwIjoxNzA5Mzg2MDUzfQ.w_VzgM3LkGXo58f6-MWd2hg9JSH6I1w-mhOWi2eantU'