'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

// Mark as dynamic for admin panel
export const dynamic = 'force-dynamic'
import { ArrowLeft, Eye, Send, RotateCcw, Save } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import { Textarea } from '@/presentation/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog'
import { Skeleton } from '@/presentation/components/ui/skeleton'
import { httpClient } from '@/infrastructure/api/client'
import { API_ENDPOINTS } from '@/infrastructure/config/api.config'
import { toast } from 'sonner'

interface EmailTemplate {
  type: string
  subject: string
  body: string
  variables: string[]
  isDefault: boolean
}

export default function EditEmailTemplatePage() {
  const router = useRouter()
  const params = useParams()
  const templateType = params.type as string

  const [template, setTemplate] = useState<EmailTemplate | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testEmail, setTestEmail] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [previewHtml, setPreviewHtml] = useState('')

  useEffect(() => {
    fetchTemplate()
  }, [templateType])

  const fetchTemplate = async () => {
    setLoading(true)
    try {
      const response: any = await httpClient.get(
        API_ENDPOINTS.emailTemplates.get(templateType)
      )
      if (response.success) {
        setTemplate(response.data)
      }
    } catch (error: any) {
      toast.error(error.error || 'Failed to load template')
      router.push('/email-templates')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!template) return

    setSaving(true)
    try {
      await httpClient.put(
        API_ENDPOINTS.emailTemplates.update(templateType),
        {
          subject: template.subject,
          body: template.body
        }
      )
      toast.success('Template saved successfully')
    } catch (error: any) {
      toast.error(error.error || 'Failed to save template')
    } finally {
      setSaving(false)
    }
  }

  const handlePreview = async () => {
    try {
      const response: any = await httpClient.post(
        API_ENDPOINTS.emailTemplates.preview,
        {
          type: templateType,
          sampleData: getSampleData(templateType)
        }
      )
      if (response.success) {
        setPreviewHtml(response.data.html)
        setShowPreview(true)
      }
    } catch (error: any) {
      toast.error(error.error || 'Failed to generate preview')
    }
  }

  const handleTestSend = async () => {
    if (!testEmail) {
      toast.error('Please enter an email address')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(testEmail)) {
      toast.error('Please enter a valid email address')
      return
    }

    try {
      await httpClient.post(
        API_ENDPOINTS.emailTemplates.testSend,
        {
          type: templateType,
          to: testEmail,
          sampleData: getSampleData(templateType)
        }
      )
      toast.success(`Test email sent to ${testEmail}`)
      setTestEmail('')
    } catch (error: any) {
      toast.error(error.error || 'Failed to send test email')
    }
  }

  const handleRestore = async () => {
    if (!confirm('Restore to default template? Your custom changes will be lost.')) {
      return
    }

    try {
      await httpClient.post(
        API_ENDPOINTS.emailTemplates.restore(templateType)
      )
      toast.success('Template restored to default')
      fetchTemplate()
    } catch (error: any) {
      toast.error(error.error || 'Failed to restore template')
    }
  }

  const getSampleData = (type: string) => {
    const samples: Record<string, any> = {
      'order-confirmation': {
        customerName: 'John Doe',
        orderNumber: 'ORD-2025-001',
        items: [
          { productName: 'Natural Face Cream', quantity: 2, price: 5000, subtotal: 10000 }
        ],
        subtotal: 10000,
        shipping: 2000,
        total: 12000
      },
      'payment-confirmed': {
        customerName: 'John Doe',
        orderNumber: 'ORD-2025-001',
        total: 12000
      },
      'order-shipped': {
        customerName: 'John Doe',
        orderNumber: 'ORD-2025-001',
        trackingNumber: 'TRACK123456'
      },
      'order-delivered': {
        customerName: 'John Doe',
        orderNumber: 'ORD-2025-001'
      },
      'order-cancelled': {
        customerName: 'John Doe',
        orderNumber: 'ORD-2025-001',
        reason: 'Customer requested cancellation'
      },
      'refund-processed': {
        customerName: 'John Doe',
        orderNumber: 'ORD-2025-001',
        refundAmount: 12000
      }
    }

    return samples[type] || {}
  }

  const getTemplateTitle = (type: string) => {
    const titles: Record<string, string> = {
      'order-confirmation': 'Order Confirmation',
      'payment-confirmed': 'Payment Confirmed',
      'order-shipped': 'Order Shipped',
      'order-delivered': 'Order Delivered',
      'order-cancelled': 'Order Cancelled',
      'refund-processed': 'Refund Processed'
    }
    return titles[type] || type
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-64" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Skeleton className="h-96 w-full" />
          </div>
          <div>
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!template) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push('/email-templates')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Template Not Found</h1>
        </div>
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">The requested email template could not be found.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => router.push('/email-templates')}
          >
            Back to Templates
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.push('/email-templates')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{getTemplateTitle(templateType)}</h1>
          <p className="text-muted-foreground">Customize email template</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Template Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject Line</Label>
                <Input
                  id="subject"
                  value={template.subject}
                  onChange={(e) => setTemplate({ ...template, subject: e.target.value })}
                  placeholder="Email subject"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="body">Email Body (HTML)</Label>
                <Textarea
                  id="body"
                  value={template.body}
                  onChange={(e) => setTemplate({ ...template, body: e.target.value })}
                  rows={20}
                  className="font-mono text-sm"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button variant="outline" onClick={handleRestore}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Restore Default
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Variables</CardTitle>
              <CardDescription>Use these in your template</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {template.variables?.map((variable) => (
                  <code key={variable} className="block bg-muted p-2 rounded text-xs">
                    {`{{${variable}}}`}
                  </code>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full" onClick={handlePreview}>
                <Eye className="mr-2 h-4 w-4" />
                Preview Template
              </Button>

              <div className="space-y-2">
                <Label htmlFor="testEmail">Send Test Email</Label>
                <div className="flex gap-2">
                  <Input
                    id="testEmail"
                    type="email"
                    placeholder="test@example.com"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                  />
                  <Button onClick={handleTestSend} size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Email Preview</DialogTitle>
          </DialogHeader>
          <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

