import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Mail, 
  Shield, 
  Calendar, 
  Activity, 
  Bookmark, 
  FileText, 
  Settings, 
  Download,
  Trash2,
  Eye,
  MessageSquare,
  Clock,
  Star,
  Key,
  Bell,
  Moon,
  Globe,
  CreditCard,
  Users,
  HelpCircle,
  Phone,
  Upload,
  Camera
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import HelpCenter from '@/components/HelpCenter';
import Feedback from '@/components/Feedback';

const Profile = () => {
  const [notifications, setNotifications] = useState(true);
  const [twoFA, setTwoFA] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    medicalLicenseNumber: '',
    medicalSpecialty: ''
  });
  
  const { user } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;

      setProfile(data);
      const nameParts = data.full_name?.split(' ') || ['', ''];
      setProfileForm({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user?.email || '',
        medicalLicenseNumber: '',
        medicalSpecialty: data.specialty || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const mostViewedDrugs = [
    { name: "Metformin", views: 45, category: "Antidiabetic" },
    { name: "Lisinopril", views: 38, category: "ACE Inhibitor" },
    { name: "Atorvastatin", views: 32, category: "Statin" },
    { name: "Amlodipine", views: 28, category: "Calcium Channel Blocker" },
    { name: "Metoprolol", views: 24, category: "Beta Blocker" }
  ];

  const bookmarkedDrugs = [
    { name: "Warfarin", category: "Anticoagulant", dateAdded: "2024-01-15", tags: ["High Risk", "Monitor"] },
    { name: "Digoxin", category: "Cardiac Glycoside", dateAdded: "2024-01-12", tags: ["Narrow Therapeutic Index"] },
    { name: "Phenytoin", category: "Anticonvulsant", dateAdded: "2024-01-10", tags: ["Drug Interactions"] }
  ];

  const savedNotes = [
    { id: 1, patientId: "P-001", title: "Diabetes Management Plan", date: "2024-01-20", preview: "Patient responding well to metformin..." },
    { id: 2, patientId: "P-002", title: "Hypertension Follow-up", date: "2024-01-18", preview: "BP controlled with current regimen..." },
    { id: 3, patientId: "P-003", title: "Drug Allergy Documentation", date: "2024-01-15", preview: "Patient allergic to penicillin..." }
  ];

  const recentActivity = [
    { action: "Viewed drug information", item: "Amoxicillin", time: "30 minutes ago" },
    { action: "Asked AI query", item: "Drug interactions with warfarin", time: "1 hour ago" },
    { action: "Saved patient note", item: "Follow-up for Patient P-004", time: "2 hours ago" },
    { action: "Compared drugs", item: "Lisinopril vs Enalapril", time: "3 hours ago" }
  ];

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size must be less than 5MB",
        variant: "destructive"
      });
      return;
    }

    setIsUploadingPhoto(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}/profile.${fileExt}`;

      // Delete existing photo if it exists
      if (profile?.profile_photo_url) {
        await supabase.storage
          .from('profile-photos')
          .remove([`${user?.id}/profile.${profile.profile_photo_url.split('.').pop()}`]);
      }

      // Upload new photo
      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(fileName);

      // Note: profile_photo_url is not in the database schema
      // We'll just update the local state for now
      setProfile(prev => ({ ...prev, profile_photo_url: publicUrl }));

      toast({
        title: "Success",
        description: "Profile photo updated successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload photo. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: `${profileForm.firstName} ${profileForm.lastName}`.trim(),
          specialty: profileForm.medicalSpecialty
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully"
      });

      fetchProfile();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match",
        variant: "destructive"
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive"
      });
      return;
    }

    setIsUpdatingPassword(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Password updated successfully"
      });

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update password. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Doctor Profile</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your profile, track your activity, and customize your experience</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 h-auto">
            <TabsTrigger value="profile" className="text-xs sm:text-sm">Profile Info</TabsTrigger>
            <TabsTrigger value="activity" className="text-xs sm:text-sm">Activity</TabsTrigger>
            <TabsTrigger value="saved" className="text-xs sm:text-sm">Saved</TabsTrigger>
            <TabsTrigger value="settings" className="text-xs sm:text-sm">Settings</TabsTrigger>
            <TabsTrigger value="help" className="text-xs sm:text-sm">Help</TabsTrigger>
            <TabsTrigger value="feedback" className="text-xs sm:text-sm">Feedback</TabsTrigger>
          </TabsList>

          {/* Profile Information Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile.profile_photo_url} alt={profile.full_name} />
                    <AvatarFallback>
                      {profile.full_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <label htmlFor="photo-upload">
                      <Button variant="outline" size="sm" disabled={isUploadingPhoto} asChild>
                        <span>
                          {isUploadingPhoto ? (
                            <>
                              <Upload className="h-4 w-4 mr-2" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Camera className="h-4 w-4 mr-2" />
                              Change Photo
                            </>
                          )}
                        </span>
                      </Button>
                    </label>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, firstName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, lastName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-500 shrink-0" />
                      <Input 
                        id="email" 
                        value={profileForm.email}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="regNumber">Medical License Number</Label>
                    <Input 
                      id="regNumber" 
                      value={profileForm.medicalLicenseNumber}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, medicalLicenseNumber: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialty">Medical Specialty</Label>
                    <Input 
                      id="specialty" 
                      value={profileForm.medicalSpecialty}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, medicalSpecialty: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Account Type</Label>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">Free</Badge>
                      <Link to="/pricing">
                        <Button variant="outline" size="sm">Upgrade to Pro</Button>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Member since {new Date(profile.created_at).toLocaleDateString()}</span>
                  </div>
                  <Button onClick={handleProfileUpdate}>Save Changes</Button>
                </div>
              </CardContent>
            </Card>

            {/* Subscription Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Subscription & Billing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Current Plan: Free</p>
                    <p className="text-sm text-gray-600">Limited access to basic features</p>
                  </div>
                  <Badge variant="secondary">Free</Badge>
                </div>
                <div className="flex space-x-2">
                  <Link to="/pricing" className="flex-1">
                    <Button variant="outline" className="w-full">
                      <CreditCard className="h-4 w-4 mr-2" />
                      View All Plans
                    </Button>
                  </Link>
                  <Link to="/pricing" className="flex-1">
                    <Button className="w-full">
                      Upgrade Now
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity & Analytics Tab */}
          <TabsContent value="activity" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Queries</p>
                      <p className="text-2xl font-bold">0</p>
                    </div>
                    <Eye className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Saved Bookmarks</p>
                      <p className="text-2xl font-bold">{bookmarkedDrugs.length}</p>
                    </div>
                    <Bookmark className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Last Active</p>
                      <p className="text-2xl font-bold">
                        {profile.last_active_at ? 
                          new Date(profile.last_active_at).toLocaleDateString() : 
                          'Never'
                        }
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Most Viewed Drugs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mostViewedDrugs.map((drug, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{drug.name}</p>
                          <p className="text-sm text-gray-600">{drug.category}</p>
                        </div>
                        <Badge variant="outline">{drug.views} views</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-sm text-gray-600">{activity.item}</p>
                          <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="saved" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bookmark className="h-5 w-5" />
                    Bookmarked Drugs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {bookmarkedDrugs.map((drug, index) => (
                      <div key={index} className="p-4 border rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{drug.name}</h4>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600">{drug.category}</p>
                        <div className="flex flex-wrap gap-1">
                          {drug.tags.map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500">Added {drug.dateAdded}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Saved Patient Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {savedNotes.map((note) => (
                      <div key={note.id} className="p-4 border rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{note.title}</h4>
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600">Patient ID: {note.patientId}</p>
                        <p className="text-sm text-gray-700">{note.preview}</p>
                        <p className="text-xs text-gray-500">{note.date}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input 
                      id="currentPassword" 
                      type="password" 
                      placeholder="Enter current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input 
                      id="newPassword" 
                      type="password" 
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password" 
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={handlePasswordChange}
                    disabled={isUpdatingPassword || !newPassword || !confirmPassword}
                  >
                    {isUpdatingPassword ? 'Updating...' : 'Change Password'}
                  </Button>

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Two-Factor Authentication</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Add an extra layer of security to your account</p>
                      </div>
                      <Switch checked={twoFA} onCheckedChange={setTwoFA} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4" />
                      <Label>Email Notifications</Label>
                    </div>
                    <Switch checked={notifications} onCheckedChange={setNotifications} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Moon className="h-4 w-4" />
                      <Label>Dark Mode</Label>
                    </div>
                    <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4" />
                      <Label>Language</Label>
                    </div>
                    <select className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700">
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>

                  <div className="pt-4 border-t space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <Label>Support Contact</Label>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <p>Phone: 8591923420</p>
                        <p>Email: support@drugiq.org</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Data Export
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">Download your data for backup or transfer purposes</p>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Export Bookmarks (PDF)
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Export Notes (CSV)
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Export Activity Log (JSON)
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <Trash2 className="h-5 w-5" />
                    Danger Zone
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">Permanently delete your account and all associated data</p>
                  <div className="space-y-2">
                    <Label htmlFor="deleteConfirm">Type "DELETE" to confirm</Label>
                    <Input id="deleteConfirm" placeholder="DELETE" />
                  </div>
                  <Button variant="destructive" className="w-full">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                  <p className="text-xs text-gray-500">This action cannot be undone. All your data will be permanently deleted.</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="help" className="space-y-6">
            <HelpCenter />
          </TabsContent>

          <TabsContent value="feedback" className="space-y-6">
            <Feedback />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
