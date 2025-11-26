'use client'

import { useState } from 'react'
import { useAuth } from '@/presentation/context/auth.context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import { Skeleton } from '@/presentation/components/ui/skeleton'
import { Avatar, AvatarFallback } from '@/presentation/components/ui/avatar'
import { Badge } from '@/presentation/components/ui/badge'
import { User, Mail, Shield, Calendar, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { httpClient } from '@/infrastructure/api/client'
import { API_ENDPOINTS } from '@/infrastructure/config/api.config'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/presentation/components/ui/dialog'

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const [changePasswordOpen, setChangePasswordOpen] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [passwordLoading, setPasswordLoading] = useState(false)

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast.error('Please fill in all password fields')
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters')
      return
    }

    setPasswordLoading(true)
    try {
      // ✅ Backend endpoint: PUT /api/auth/change-password
      // Payload: { currentPassword, newPassword }
      const response: any = await httpClient.put(API_ENDPOINTS.auth.changePassword, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })
      
      // Display backend success message if available
      const successMessage = response?.data?.message || response?.message || 'Password changed successfully'
      toast.success(successMessage)
      
      setChangePasswordOpen(false)
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch (error: any) {
      // ✅ Extract specific backend error message
      const errorMessage = 
        error?.response?.data?.error || 
        error?.response?.data?.message ||
        error?.error || 
        error?.message || 
        'Failed to change password'
      
      toast.error(errorMessage, {
        description: error?.status ? `Error code: ${error.status}` : undefined,
        duration: 5000
      })
      
      console.error('❌ Change password error:', {
        status: error?.status || error?.response?.status,
        errorCode: error?.errorCode,
        data: error?.response?.data,
        message: errorMessage,
        fullError: error
      })
    } finally {
      setPasswordLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-muted-foreground">Unable to load profile information</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Your personal information and account details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          {/* Account Details */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name
              </Label>
              <Input value={user.name} disabled className="bg-muted" />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input value={user.email} disabled className="bg-muted" />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Role
              </Label>
              <div className="flex items-center gap-2">
                <Input 
                  value={user.role.charAt(0).toUpperCase() + user.role.slice(1)} 
                  disabled 
                  className="bg-muted flex-1" 
                />
                <Badge variant="default">{user.role}</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Member Since
              </Label>
              <Input 
                value={new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })} 
                disabled 
                className="bg-muted" 
              />
            </div>
          </div>

          {/* Account Status */}
          <div className="space-y-2">
            <Label>Account Status</Label>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Email Verified:</span>
                <Badge variant={user.emailVerified ? 'success' : 'destructive'}>
                  {user.emailVerified ? 'Verified' : 'Not Verified'}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Account Status:</span>
                <Badge variant={user.active ? 'success' : 'destructive'}>
                  {user.active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>
            Manage your account security and authentication
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full md:w-auto">
                <Lock className="h-4 w-4 mr-2" />
                Change Password
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Change Password</DialogTitle>
                <DialogDescription>
                  Enter your current password and choose a new one
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="Enter current password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, currentPassword: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password (min 6 characters)"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, newPassword: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setChangePasswordOpen(false)
                    setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: '',
                    })
                  }}
                  disabled={passwordLoading}
                >
                  Cancel
                </Button>
                <Button onClick={handleChangePassword} disabled={passwordLoading}>
                  {passwordLoading ? 'Changing...' : 'Change Password'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
}

