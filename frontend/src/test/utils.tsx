import React, { ReactNode } from 'react';
import { Refine } from '@refinedev/core';
import { BrowserRouter } from 'react-router';

export const TestWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <BrowserRouter>
            <Refine
                options={{
                    disableTelemetry: true,
                }}
            >
                {children}
            </Refine>
        </BrowserRouter>
    );
};
