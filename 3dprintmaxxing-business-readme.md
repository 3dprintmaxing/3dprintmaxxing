# 3dprintmaxxing business README

## Pricing promise

Quotes are based on the size of the print, the filament used, and the print time. There are no hidden handling fees, service fees, surprise design fees, or unexplained markups.

Shipping is listed separately because it depends on the customer's address. The customer sees the print price and shipping cost before approving anything.

## Transparent payment formula

Use the weight and print time shown by the slicer or calculated from the file.

### Variables

- `W` = filament weight in grams
- `R` = current price of one 1 kg filament roll
- `T` = print time in hours
- `Q` = quantity
- `S` = actual shipping cost quoted for the customer's address

Use `$17` as the starting reference price for a 1 kg PLA roll. Replace it with the actual current roll price when the filament was purchased or when a different material is needed.

### Print price per item

```text
Filament cost = (W ÷ 1,000) × R

Time cost = T × $2.50

Print price per item = (Filament cost + Time cost) × 2
```

The multiplier of `2` is the business margin. It doubles the direct filament-and-print-time calculation while keeping the quote easy to explain.

### Order total

```text
Print subtotal = Print price per item × Q

Total = Print subtotal + actual shipping cost
```

Do not add anything else unless it is clearly shown and approved as a separate line before payment. If a customer requests design work, a different material, or an unusually large change after approval, explain the additional amount and get approval before doing it.

### Example

For one PLA print using:

- `W = 120 g`
- `R = $17 per 1 kg roll`
- `T = 4 hours`
- `Q = 1`
- `S = $8 shipping`

```text
Filament cost = (120 ÷ 1,000) × $17 = $2.04
Time cost = 4 × $2.50 = $10.00
Print price = ($2.04 + $10.00) × 2 = $24.08
Total = $24.08 + $8 shipping = $32.08
```

Quote it as:

```text
Print: $24.08
Shipping: $8.00
Total: $32.08
```

Round only at the end. A simple customer-facing quote such as `$24.00` or `$25.00` is fine as long as the final number is stated clearly and is not higher than the approved quote.

## Payment policy

1. The request form is not a purchase and does not charge the customer.
2. Review the description, file, weight, print time, material, quantity, and shipping address before quoting.
3. Send an itemized quote showing the print subtotal, shipping, and total.
4. Do not print, order material, or ship anything until the customer explicitly approves the quote.
5. Payment is due only after the quote is approved and before production starts.
6. Use one payment method that you can verify. Do not treat a screenshot or an unconfirmed message as proof of payment.
7. If the file has a scale, geometry, support, or printer-compatibility problem, explain it before accepting payment.
8. If the final price changes because the approved specifications change, stop and send a revised quote before continuing.
9. Never charge a hidden fee. If an amount is not on the approved quote, it is not owed.

## Refund policy

1. If the customer cancels before printing begins, refund the payment in full.
2. If material was specially ordered but has not been used, refund the print payment after subtracting only a clearly disclosed, non-refundable supplier charge. Do not invent a charge; if there is no disclosed supplier charge, refund in full.
3. If a print fails because of the printer, material, or an error on my side, offer a free reprint first. If the customer does not want a reprint, refund the print price. Refund shipping too if the failed order was already shipped or the customer paid shipping for the failed attempt.
4. If the finished item is materially different from the approved description or unusable because of my mistake, offer a free reprint or a full refund, including shipping when appropriate.
5. If the customer supplied an incorrect file, incorrect dimensions, incomplete address, or an undisclosed change in requirements, contact them before taking action. A refund may be partial if work or shipping has already been completed, but explain the calculation clearly.
6. Once a correctly made custom item has been approved and delivered, it is not automatically refundable just because the customer changed their mind. Handle genuine defects or errors fairly.
7. Never claim a refund has been issued until the payment provider confirms it.
8. Keep the quote, approval, payment confirmation, shipping receipt, and refund conversation together in the email thread.

## Automated email workflow

Automation should collect the request and set expectations. It must not pretend to be a personal quote, promise that a file will print, request payment, or say that production has started.

Only the first automated email should explain that a human will review and reply. Later messages should simply continue the conversation naturally.

### Template 1 — first response after the form is submitted

**Subject:** Got your print request — I’ll take a look

Hi {{name}},

Thanks for sending this over. I got your request and any attached files.

A real person will review the description, file, quantity, material, estimated weight, print time, and shipping details, then reply by email with a clear quote. Nothing will be printed or charged before you approve the quote.

If anything is missing or unclear, I’ll ask before making a decision. I usually reply within {{reply_time}}.

Thanks,
3dprintmaxxing

### What to say after they respond to the first template

Hi {{name}},

Thanks, that helps. I’m reviewing the details now. I’ll get back to you with the quote once I’ve checked the file and print settings.

Thanks,
{{your_name}}

### Template 2 — request missing information

**Subject:** One quick detail about your print

Hi {{name}},

I’m looking at your request and need one more detail before I can quote it:

{{specific_question}}

Once I have that, I can finish checking the print and send you the numbers.

Thanks,
{{your_name}}

### What to say after they answer the question

Thanks, that answers it. I have what I need now and will send the itemized quote next.

### Template 3 — itemized quote

**Subject:** Quote for your 3D print

Hi {{name}},

I checked the request. Here is the quote:

- Print: ${{print_subtotal}}
- Shipping: ${{shipping}}
- Total: ${{total}}

This quote is based on approximately {{weight_grams}} g of filament, {{print_hours}} hours of print time, and {{quantity}} item(s) using {{material}}.

If the details look right, reply with **I approve this quote**. I will wait for that approval before printing or charging anything.

Thanks,
{{your_name}}

### What to say after they approve the quote

Thanks for approving it. I’m going to use the specifications in the quote and will confirm once payment is verified. I’ll let you know if anything unexpected comes up before production.

### Template 4 — payment instructions

**Subject:** Payment details for your approved print

Hi {{name}},

The quote is approved. The total is **${{total}}**, including **${{shipping}}** shipping.

Payment instructions:

{{payment_instructions}}

Please reply after sending payment. I’ll verify it on my side before starting the print.

Thanks,
{{your_name}}

### What to say after payment is verified

Payment came through. I’m starting the print using the approved specifications. I’ll message you if there is a problem; otherwise I’ll update you when it is finished and ready to ship.

### Template 5 — finished and ready to ship

**Subject:** Your print is finished

Hi {{name}},

Your print is finished and looks ready to ship. I’m packaging it now.

I’ll send the tracking information as soon as it is accepted by the carrier.

Thanks,
{{your_name}}

### What to say after tracking is available

Your package is on the way.

Tracking: {{tracking_number}}

Carrier: {{carrier}}

Thanks again for the order.

### Template 6 — printer failure or delay

**Subject:** Update on your print

Hi {{name}},

I wanted to let you know that the print did not come out correctly, so I’m not going to send it as-is. I can {{offer_reprint_or_refund}}.

I’m sorry for the delay. I’ll wait for your preference before continuing.

Thanks,
{{your_name}}

### What to say after they choose a reprint

Got it. I’ll reprint it and keep you updated. There is no extra charge for fixing a failure on my side.

### What to say after they request a refund

Understood. I’m processing the refund for {{refund_amount}}. I’ll confirm again when the payment provider marks it complete.

## Human reply rules

- Use the customer’s name and refer to the specific object they described.
- Say what you checked instead of sounding like a status bot.
- Never say “the system calculated” to the customer.
- Never say a file is guaranteed to print until it has been checked.
- Never request payment before the customer approves the itemized quote.
- Never add a fee that is not visible in the quote.
- If you make a mistake, say so plainly and offer the appropriate fix.
