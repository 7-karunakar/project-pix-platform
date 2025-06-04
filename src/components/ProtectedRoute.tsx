
import React from 'react';
import { rbacService } from '../services/rbacService';
import { AlertCircle } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission: keyof import('../services/rbacService').RolePermissions;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredPermission 
}) => {
  const hasPermission = rbacService.hasPermission(requiredPermission);

  if (!hasPermission) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">
            You don't have permission to access this section.
          </p>
          <p className="text-sm text-gray-500">
            Please contact your production manager for access.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
