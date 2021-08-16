# InvoiceGenerator
Unused invoice generator for work.

This was a proof-of-concept web based invoice generator for my previous job. 

It reads pricing, tax data, and customer resale permit information off of exel sheets, and uses that to
automatically calculate the pricing, tax, and shipping rates for various items. This is accomplished using Javascript for the front end user application, and flask + sql for the backend.

When an invoice is saved, it is converted to a pdf then added to a folder that is automatically generated by day. Folders are dynamically genrated daily, then organized from greatest date range to smallest. (eg Year folder -> Month Folder -> Day Folder -> individual invoices)

The code has minor bugs (invoice number doesn't update), but is otherwise a workable proof of concept.
My then-employer opted not to use it however, and continues to use paper invoices.


