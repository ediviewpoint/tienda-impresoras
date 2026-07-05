'use client'

import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'

interface Props {
  amount: string
  onSuccess: (orderId: string) => void
  onError: (err: unknown) => void
}

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? 'sb'

export function PayPalButton({ amount, onSuccess, onError }: Props) {
  return (
    <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: 'USD' }}>
      <PayPalButtons
        style={{ layout: 'vertical', shape: 'pill', label: 'pay' }}
        createOrder={(_data, actions) =>
          actions.order.create({
            intent: 'CAPTURE',
            purchase_units: [{ amount: { currency_code: 'USD', value: amount } }],
          })
        }
        onApprove={async (_data, actions) => {
          const details = await actions.order!.capture()
          onSuccess(details.id ?? '')
        }}
        onError={onError}
      />
    </PayPalScriptProvider>
  )
}
