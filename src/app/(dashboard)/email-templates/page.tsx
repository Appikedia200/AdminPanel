'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card'
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

export default function EmailTemplatesPage() {
  const router = useRouter()
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      const response: any = await httpClient.get(API_ENDPOINTS.emailTemplates.list)
      if (response.success) {
        setTemplates(response.data)
      }
    } catch (error: any) {
      toast.error(error.error || 'Failed to load templates')
    } finally {
      setLoading(false)
    }
  }

  const templateInfo: Record<string, { title: string; description: string }> = {
    'order-confirmation': {
      title: 'Order Confirmation',
      description: 'Sent to customers when they place an order'
    },
    'payment-confirmed': {
      title: 'Payment Confirmed',
      description: 'Sent when payment is confirmed by admin'
    },
    'order-shipped': {
      title: 'Order Shipped',
      description: 'Sent when order is marked as shipped'
    },
    'order-delivered': {
      title: 'Order Delivered',
      description: 'Sent when order is delivered'
    },
    'order-cancelled': {
      title: 'Order Cancelled',
      description: 'Sent when order is cancelled'
    },
    'refund-processed': {
      title: 'Refund Processed',
      description: 'Sent when refund is processed'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Email Templates</h1>
          <p className="text-muted-foreground mt-2">Customize email notifications sent to customers</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Email Templates</h1>
        <p className="text-muted-foreground mt-2">Customize email notifications sent to customers</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {templates.map((template) => {
          const info = templateInfo[template.type] || { title: template.type, description: '' }
          
          return (
            <Card 
              key={template.type} 
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => router.push(`/email-templates/${template.type}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{info.title}</CardTitle>
                      <CardDescription className="text-sm mt-1">
                        {info.description}
                      </CardDescription>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Subject:</span> {template.subject}
                </p>
                {template.isDefault && (
                  <span className="text-xs text-muted-foreground mt-2 block">
                    Using default template
                  </span>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

