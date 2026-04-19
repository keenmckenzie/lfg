import { render } from '@react-email/render'

import DonationReceipt, { type DonationReceiptProps } from '@/emails/DonationReceipt'
import { sendEmail } from '@/lib/ses'
import { formatCents } from '@/lib/utils'

interface SendDonationReceiptArgs extends DonationReceiptProps {
  to: string
}

export async function sendDonationReceipt({ to, ...props }: SendDonationReceiptArgs) {
  const html = await render(DonationReceipt(props))
  const text = await render(DonationReceipt(props), { plainText: true })

  const subject = `Thank you for your ${formatCents(props.amountInCents, props.currency.toUpperCase())} donation`

  return sendEmail({
    to,
    subject,
    html,
    text,
  })
}
