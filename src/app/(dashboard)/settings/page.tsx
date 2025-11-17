'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2 } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { Checkbox } from '@/presentation/components/ui/checkbox'
import { Textarea } from '@/presentation/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/presentation/components/ui/select'
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
  whatsapp: {
    enabled: boolean
    number: string
    message: string
  }
  socialMedia: {
    facebook: string
    instagram: string
    twitter: string
    youtube: string
    tiktok: string
  }
  shipping: {
    freeShippingThreshold: number
    defaultShippingCost: number
  }
  tax: {
    enabled: boolean
    rate: number
  }
  currency: {
    code: string
    symbol: string
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
    whatsapp: {
      enabled: false,
      number: '',
      message: 'Hello! I am interested in your products.',
    },
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: '',
      youtube: '',
      tiktok: '',
    },
    shipping: {
      freeShippingThreshold: 0,
      defaultShippingCost: 0,
    },
    tax: {
      enabled: false,
      rate: 0,
    },
    currency: {
      code: 'NGN',
      symbol: '₦',
    },
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response: any = await httpClient.get(API_ENDPOINTS.settings.get)
      if (response.success) {
        setSettings({
          store: response.data.store || settings.store,
          whatsapp: response.data.whatsapp || settings.whatsapp,
          socialMedia: response.data.socialMedia || settings.socialMedia,
          shipping: response.data.shipping || settings.shipping,
          tax: response.data.tax || settings.tax,
          currency: response.data.currency || settings.currency,
        })
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

  const updateWhatsApp = (field: string, value: string | boolean) => {
    setSettings({
      ...settings,
      whatsapp: {
        ...settings.whatsapp,
        [field]: value,
      },
    })
  }

  const updateSocialMedia = (field: string, value: string) => {
    setSettings({
      ...settings,
      socialMedia: {
        ...settings.socialMedia,
        [field]: value,
      },
    })
  }

  const updateShipping = (field: string, value: number) => {
    setSettings({
      ...settings,
      shipping: {
        ...settings.shipping,
        [field]: value,
      },
    })
  }

  const updateTax = (field: string, value: number | boolean) => {
    setSettings({
      ...settings,
      tax: {
        ...settings.tax,
        [field]: value,
      },
    })
  }

  const updateCurrency = (field: string, value: string) => {
    setSettings({
      ...settings,
      currency: {
        ...settings.currency,
        [field]: value,
      },
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your store settings and preferences</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Store Information */}
        <Card>
          <CardHeader>
            <CardTitle>Store Information</CardTitle>
            <CardDescription>Update your store&apos;s basic information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name *</Label>
                <Input
                  id="storeName"
                  value={settings.store.name}
                  onChange={(e) => updateStore('name', e.target.value)}
                  placeholder="GlowNatura"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="storeEmail">Email Address *</Label>
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
                <Label htmlFor="storePhone">Phone Number *</Label>
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
              <Label htmlFor="storeAddress">Store Address *</Label>
              <Textarea
                id="storeAddress"
                value={settings.store.address}
                onChange={(e) => updateStore('address', e.target.value)}
                rows={3}
                placeholder="123 Victoria Island, Lagos, Nigeria"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* WhatsApp Settings */}
        <Card>
          <CardHeader>
            <CardTitle>WhatsApp Integration</CardTitle>
            <CardDescription>Configure WhatsApp chat widget for customers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="whatsapp-enabled"
                checked={settings.whatsapp.enabled}
                onCheckedChange={(checked) => updateWhatsApp('enabled', !!checked)}
              />
              <Label htmlFor="whatsapp-enabled" className="font-normal cursor-pointer">
                Enable WhatsApp Chat Widget
              </Label>
            </div>

            {settings.whatsapp.enabled && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="whatsappNumber">WhatsApp Number (with country code)</Label>
                  <Input
                    id="whatsappNumber"
                    placeholder="+2348012345678"
                    value={settings.whatsapp.number}
                    onChange={(e) => updateWhatsApp('number', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Include country code without spaces (e.g., +2348012345678)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsappMessage">Default Message</Label>
                  <Textarea
                    id="whatsappMessage"
                    placeholder="Hello! I'm interested in your products."
                    value={settings.whatsapp.message}
                    onChange={(e) => updateWhatsApp('message', e.target.value)}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    This message will be pre-filled when customers click the WhatsApp button
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card>
          <CardHeader>
            <CardTitle>Social Media</CardTitle>
            <CardDescription>Add your social media profile links</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook URL</Label>
              <Input
                id="facebook"
                placeholder="https://facebook.com/glownatura"
                value={settings.socialMedia.facebook}
                onChange={(e) => updateSocialMedia('facebook', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram URL</Label>
              <Input
                id="instagram"
                placeholder="https://instagram.com/glownatura"
                value={settings.socialMedia.instagram}
                onChange={(e) => updateSocialMedia('instagram', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter/X URL</Label>
              <Input
                id="twitter"
                placeholder="https://twitter.com/glownatura"
                value={settings.socialMedia.twitter}
                onChange={(e) => updateSocialMedia('twitter', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="youtube">YouTube URL</Label>
              <Input
                id="youtube"
                placeholder="https://youtube.com/@glownatura"
                value={settings.socialMedia.youtube}
                onChange={(e) => updateSocialMedia('youtube', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tiktok">TikTok URL</Label>
              <Input
                id="tiktok"
                placeholder="https://tiktok.com/@glownatura"
                value={settings.socialMedia.tiktok}
                onChange={(e) => updateSocialMedia('tiktok', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Shipping & Tax */}
        <Card>
          <CardHeader>
            <CardTitle>Shipping & Tax</CardTitle>
            <CardDescription>Configure shipping rates and tax settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium">Shipping Settings</h4>
              
              <div className="space-y-2">
                <Label htmlFor="freeShippingThreshold">Free Shipping Threshold (₦)</Label>
                <Input
                  id="freeShippingThreshold"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="50000"
                  value={settings.shipping.freeShippingThreshold || 0}
                  onChange={(e) => updateShipping('freeShippingThreshold', parseFloat(e.target.value) || 0)}
                />
                <p className="text-xs text-muted-foreground">
                  Orders above this amount get free shipping (set 0 to disable)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultShippingCost">Default Shipping Cost (₦)</Label>
                <Input
                  id="defaultShippingCost"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="2000"
                  value={settings.shipping.defaultShippingCost || 0}
                  onChange={(e) => updateShipping('defaultShippingCost', parseFloat(e.target.value) || 0)}
                />
                <p className="text-xs text-muted-foreground">
                  Standard shipping cost for orders below free shipping threshold
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-medium">Tax Settings</h4>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="tax-enabled"
                  checked={settings.tax.enabled}
                  onCheckedChange={(checked) => updateTax('enabled', !!checked)}
                />
                <Label htmlFor="tax-enabled" className="font-normal cursor-pointer">
                  Enable Tax
                </Label>
              </div>

              {settings.tax.enabled && (
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    placeholder="7.5"
                    value={settings.tax.rate || 0}
                    onChange={(e) => updateTax('rate', parseFloat(e.target.value) || 0)}
                  />
                  <p className="text-xs text-muted-foreground">
                    VAT rate to be applied to all orders (e.g., 7.5 for 7.5% VAT)
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Currency */}
        <Card>
          <CardHeader>
            <CardTitle>Currency</CardTitle>
            <CardDescription>Set your store currency preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currencyCode">Currency</Label>
              <Select
                value={settings.currency.code}
                onValueChange={(value) => {
                  updateCurrency('code', value)
                  // Auto-update symbol based on currency
                  const symbols: Record<string, string> = {
                    'NGN': '₦',
                    'USD': '$',
                    'EUR': '€',
                    'GBP': '£',
                  }
                  updateCurrency('symbol', symbols[value] || value)
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NGN">NGN - Nigerian Naira (₦)</SelectItem>
                  <SelectItem value="USD">USD - US Dollar ($)</SelectItem>
                  <SelectItem value="EUR">EUR - Euro (€)</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currencySymbol">Currency Symbol</Label>
              <Input
                id="currencySymbol"
                placeholder="₦"
                value={settings.currency.symbol}
                onChange={(e) => updateCurrency('symbol', e.target.value)}
                maxLength={3}
              />
              <p className="text-xs text-muted-foreground">
                Symbol to display alongside prices (e.g., ₦, $, €)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={saving} size="lg">
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save All Settings
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
