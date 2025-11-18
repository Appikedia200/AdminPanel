'use client'

import { use, useState } from 'react'
import Link from 'next/link'

// Mark as dynamic for admin panel
export const dynamic = 'force-dynamic'
import { ArrowLeft, CheckCircle2, Truck, MessageSquare, X } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { Badge } from '@/presentation/components/ui/badge'
import { Skeleton } from '@/presentation/components/ui/skeleton'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/presentation/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/presentation/components/ui/select'
import { useOrder } from '@/presentation/hooks/use-orders'
import { formatCurrency, formatDate } from '@/shared/utils/format'
import { ROUTES } from '@/infrastructure/config/constants'
import { httpClient } from '@/infrastructure/api/client'
import { API_ENDPOINTS } from '@/infrastructure/config/api.config'
import { toast } from 'sonner'

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { order, loading, refetch } = useOrder(id)
  
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [paymentProof, setPaymentProof] = useState('')
  const [confirmingPayment, setConfirmingPayment] = useState(false)
  
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [updatingStatus, setUpdatingStatus] = useState(false)
  
  const [notesDialogOpen, setNotesDialogOpen] = useState(false)
  const [noteText, setNoteText] = useState('')
  const [addingNote, setAddingNote] = useState(false)

  const handleConfirmPayment = async () => {
    setConfirmingPayment(true)
    try {
      const response: any = await httpClient.put(
        API_ENDPOINTS.orders.confirmPayment(id),
        { paymentProof }
      )
      if (response.success) {
        toast.success('Payment confirmed successfully')
        setPaymentDialogOpen(false)
        setPaymentProof('')
        refetch()
      }
    } catch (error: any) {
      toast.error(error.error || 'Failed to confirm payment')
    } finally {
      setConfirmingPayment(false)
    }
  }

  const handleUpdateStatus = async () => {
    if (!newStatus) {
      toast.error('Please select a status')
      return
    }
    
    if (newStatus === 'shipped' && !trackingNumber) {
      toast.error('Tracking number is required for shipped status')
      return
    }
    
    setUpdatingStatus(true)
    try {
      const payload: any = { status: newStatus }
      if (newStatus === 'shipped' && trackingNumber) {
        payload.trackingNumber = trackingNumber
      }
      
      const response: any = await httpClient.put(
        API_ENDPOINTS.orders.updateStatus(id),
        payload
      )
      if (response.success) {
        toast.success('Order status updated successfully')
        setStatusDialogOpen(false)
        setNewStatus('')
        setTrackingNumber('')
        refetch()
      }
    } catch (error: any) {
      toast.error(error.error || 'Failed to update status')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handleAddNote = async () => {
    if (!noteText.trim()) {
      toast.error('Please enter a note')
      return
    }
    
    setAddingNote(true)
    try {
      const response: any = await httpClient.post(
        API_ENDPOINTS.orders.addNote(id),
        { note: noteText }
      )
      if (response.success) {
        toast.success('Note added successfully')
        setNotesDialogOpen(false)
        setNoteText('')
        refetch()
      }
    } catch (error: any) {
      toast.error(error.error || 'Failed to add note')
    } finally {
      setAddingNote(false)
    }
  }

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      return
    }
    
    try {
      const reason = window.prompt('Please enter the reason for cancellation:')
      if (!reason) return
      
      const response: any = await httpClient.put(
        API_ENDPOINTS.orders.cancel(id),
        { reason }
      )
      if (response.success) {
        toast.success('Order cancelled successfully')
        refetch()
      }
    } catch (error: any) {
      toast.error(error.error || 'Failed to cancel order')
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Order not found</h2>
        <Link href={ROUTES.ORDERS}>
          <Button>Back to Orders</Button>
        </Link>
      </div>
    )
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'outline'
      case 'confirmed':
      case 'delivered':
        return 'success'
      case 'processing':
      case 'shipped':
        return 'default'
      case 'cancelled':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const getPaymentStatusVariant = (status: string) => {
    switch (status) {
      case 'paid':
        return 'success'
      case 'failed':
        return 'destructive'
      case 'pending':
        return 'outline'
      case 'refunded':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href={ROUTES.ORDERS}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Order {order.orderNumber}</h1>
            <p className="text-muted-foreground mt-1">
              Placed on {formatDate(order.createdAt, 'long')}
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {order.paymentStatus === 'pending' && (
            <Button onClick={() => setPaymentDialogOpen(true)} variant="outline">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Confirm Payment
            </Button>
          )}
          {order.status !== 'cancelled' && order.status !== 'delivered' && (
            <Button onClick={() => setStatusDialogOpen(true)}>
              <Truck className="h-4 w-4 mr-2" />
              Update Status
            </Button>
          )}
          <Button onClick={() => setNotesDialogOpen(true)} variant="outline">
            <MessageSquare className="h-4 w-4 mr-2" />
            Add Note
          </Button>
          {order.status !== 'cancelled' && order.status !== 'delivered' && (
            <Button onClick={handleCancelOrder} variant="destructive">
              <X className="h-4 w-4 mr-2" />
              Cancel Order
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{order.customer.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{order.customer.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{order.customer.phone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Shipping Address</p>
              <p className="font-medium">
                {order.customer.address.street}<br />
                {order.customer.address.city}, {order.customer.address.state}<br />
                {order.customer.address.country}
                {order.customer.address.postalCode && `, ${order.customer.address.postalCode}`}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Order Status */}
        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Order Status</p>
              <Badge variant={getStatusVariant(order.status)} className="capitalize">
                {order.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Payment Status</p>
              <Badge variant={getPaymentStatusVariant(order.paymentStatus)} className="capitalize">
                {order.paymentStatus}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Payment Method</p>
              <p className="font-medium capitalize">{order.paymentMethod.replace('_', ' ')}</p>
            </div>
            {order.trackingNumber && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Tracking Number</p>
                <p className="font-medium font-mono">{order.trackingNumber}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center gap-4 py-3 border-b last:border-0">
                {item.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 rounded object-cover"
                  />
                )}
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                  <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(item.total)}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(item.price)} each
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-2 border-t pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Discount</span>
                <span className="text-destructive">-{formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax</span>
              <span>{formatCurrency(order.tax)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span>{formatCurrency(order.shippingCost)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      {order.notes && typeof order.notes === 'string' && (
        <Card>
          <CardHeader>
            <CardTitle>Order Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{order.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Payment Confirmation Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Payment</DialogTitle>
            <DialogDescription>
              Mark this order as paid and optionally add payment proof URL
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="paymentProof">Payment Proof URL (optional)</Label>
              <Input
                id="paymentProof"
                value={paymentProof}
                onChange={(e) => setPaymentProof(e.target.value)}
                placeholder="https://example.com/payment-proof.jpg"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmPayment} disabled={confirmingPayment}>
              {confirmingPayment ? 'Confirming...' : 'Confirm Payment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Change the order status and add tracking information if applicable
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">New Status *</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {newStatus === 'shipped' && (
              <div className="space-y-2">
                <Label htmlFor="trackingNumber">Tracking Number *</Label>
                <Input
                  id="trackingNumber"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus} disabled={updatingStatus}>
              {updatingStatus ? 'Updating...' : 'Update Status'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Note Dialog */}
      <Dialog open={notesDialogOpen} onOpenChange={setNotesDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Order Note</DialogTitle>
            <DialogDescription>
              Add an internal note to this order
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="note">Note *</Label>
              <textarea
                id="note"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                rows={4}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Enter your note here..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNotesDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddNote} disabled={addingNote}>
              {addingNote ? 'Adding...' : 'Add Note'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
