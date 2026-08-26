import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AuthDialog from './AuthDialog';
import { Skeleton } from '@/components/ui/skeleton';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'doctor' | 'clinic_admin' | 'researcher';
  message?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  message = "Please sign in to access this feature."
}) => {
  const { user, userRole, loading } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  // Show loading skeleton while auth is being determined
  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!user) {
    return (
      <>
        <AuthDialog 
          isOpen={true} 
          onClose={() => {}} 
          message={message}
        />
      </>
    );
  }

  // Check role requirements
  if (requiredRole && userRole !== requiredRole && userRole !== 'clinic_admin') {
    return (
      <>
        <AuthDialog 
          isOpen={true} 
          onClose={() => {}} 
          message={`This feature requires ${requiredRole} privileges or higher.`}
        />
      </>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;