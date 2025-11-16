'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2 } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { httpClient } from '@/infrastructure/api/client'
import { API_ENDPOINTS } from '@/infrastructure/config/api.config'
import { toast } from 'sonner'

interface StoreSettings {
  store: {
    name: string
    email: string
    phone: string
    address: string
    logo?: string
    favicon?: string
  }
  whatsapp?: {
    enabled: boolean
    number: string
    message: string
  }
  email?: {
    orderConfirmation: boolean
    orderStatusUpdate: boolean
    lowStockAlert: boolean
  }
  social?: {
    facebook?: string
    instagram?: string
    twitter?: string
    whatsapp?: string
  }
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<StoreSettings>({
    store: {
      name: '',
      email: '',
      phone: '',
      address: '',
    },
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response: any = await httpClient.get(API_ENDPOINTS.settings.get)
      if (response.success) {
        setSettings(response.data)
      }
    } catch {
      toast.error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response: any = await httpClient.put(API_ENDPOINTS.settings.update, settings)
      if (response.success) {
        toast.success('Settings saved successfully')
      }
    } catch {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const updateStore = (field: string, value: string) => {
    setSettings({
      ...settings,
      store: {
        ...settings.store,
        [field]: value,
      },
    })
  }

  if (loading) {
    return <div className="p-6">Loading settings...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your store settings and preferences</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Store Information</CardTitle>
            <CardDescription>Update your store&apos;s basic information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name</Label>
                <Input
                  id="storeName"
                  value={settings.store.name}
                  onChange={(e) => updateStore('name', e.target.value)}
                  placeholder="GlowNatura"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="storeEmail">Email Address</Label>
                <Input
                  id="storeEmail"
                  type="email"
                  value={settings.store.email}
                  onChange={(e) => updateStore('email', e.target.value)}
                  placeholder="admin@glownatura.com"
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="storePhone">Phone Number</Label>
                <Input
                  id="storePhone"
                  value={settings.store.phone}
                  onChange={(e) => updateStore('phone', e.target.value)}
                  placeholder="+234 800 123 4567"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="storeAddress">Store Address</Label>
              <textarea
                id="storeAddress"
                value={settings.store.address}
                onChange={(e) => updateStore('address', e.target.value)}
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="123 Victoria Island, Lagos, Nigeria"
                required
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
