'use client';
import React from 'react';

interface AdminLayoutProps {
    children: React.ReactNode;
}

// Layout (sidebar, topbar) is handled by src/app/admin/(dashboard)/layout.tsx
// This component is kept as a passthrough for backward compatibility
const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    return <>{children}</>;
};

export default AdminLayout;
