# EMask
Set up email forwarders to avoid giving out your real email address.

## Features (target)
- [x] Creation of masked emails on a custom or private domain.
- [x] Pick between auto-generated and custom email masks.
- [x] Enable or disable masked emails from forwarding with a simple toggle button.
- [ ] Display statistics on the number of emails received and sent from
      a given masked email address.
- [ ] Expiry settings on individual masked emails.
- [ ] Privately reply via a masked email address.
- [ ] Specify multiple recipients of a given masked email address.
      (will need to avoid becoming a spam amplification relay).
- [ ] Chrome/Firefox web extension to automatically create a masked email
  [ ] address and fill a form field.
  
## Approach
- **Domain**: To maintain each individual's ability to stay off of block lists,
  each person should use their own domain, or at least subdomain. 
- **Forwarding**: Email forwarding will be done using Mailgun, on the
  assumption that nobody will need to forward over 10,000 emails per month,
  which is the limit on the free tier. 
- **Configuration Webapp**: Finally, there will be a webapp, which can be
  self-hosted or started via a Docker container, in which each user must create
  an account and enter their Mailgun API credentials. The webapp will handle
  creating new masked emails and managing their forwarding vs blocked status.

## Notes
MIME message parsers and generators:
- http://manpages.ubuntu.com/manpages/trusty/man3/MIME::Tools.3pm.html
- https://docs.python.org/3/library/email.generator.html#module-email.generator
- https://github.com/eface2face/mimemessage.js
- https://github.com/jstedfast/gmime
- https://nodemailer.com/extras/mailparser/
- https://nodemailer.com/extras/mailcomposer/

## TODO

- [x] Build initial prototype version.
- [x] Deploy initial version to server, start using it for m.sheth.io emails.
- [x] Set up an alternate mailgun account for use in development, so that I don't mess with the production mailgun configuration.
- [x] Set up mongodb container to use a persistent volume, so that it does not get wiped upon redeploy.
- [ ] Add ability to edit masked email descriptions.
- [ ] Use email webhooks or the store() command and manually trigger a forwarding, rather than using the forward filter.
- [ ] Parse incoming messages using MIME libraries, and add _mime to the callback URL.
- [ ] Use `X-Mailgun-Sflag` and friends to filter spam emails.
- [ ] Generate List-Unsubscribe MIME header email address.
- [ ] Inject a URL into the header of the emails which gives a one-click unsubscribe link for any email. Also add `[masked]` to the email subject line.
- [ ] Add a counter for the number of emails received on a given mask.
- [ ] Inject a reply-to address and enable replying to emails via a masked email address.
- [ ] Abstract the API away from Mailgun to support other email providers.

