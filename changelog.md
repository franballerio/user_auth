10-16-2025:
  creating the pass reset feature:
  
  ###ADDED
    x created a button on the front to request the mail link
    x input email and sends the reset link

  ###TO-FIX
    - verify that email exists. even if not exists show a message 
    that email was sent (secure feature)

10-22-2025:
  implemented password reset backend:
  
  ###ADDED
    x created endpoint to handle password reset requests
    x generate secure token and send email with reset link
    x created endpoint to update password using the token
