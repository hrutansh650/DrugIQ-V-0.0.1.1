import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

const AuthDialog: React.FC<AuthDialogProps> = ({ 
  isOpen, 
  onClose, 
  message = "Please sign in to access patient records and other features." 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LogIn className="h-5 w-5" />
            Authentication Required
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            {message}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/login" className="flex-1">
              <Button className="w-full">
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </Link>
            <Link to="/signup" className="flex-1">
              <Button variant="outline" className="w-full">
                <UserPlus className="h-4 w-4 mr-2" />
                Sign Up
              </Button>
            </Link>
          </div>
          <Button variant="ghost" onClick={onClose} className="w-full">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;