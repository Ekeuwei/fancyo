exports.activationEmailTemplate = (token, type)=>`
<!DOCTYPE html>
<html>
<head>
  <title>${process.env.APP_NAME} Security Notification - ${type}</title>
  <style>
    /* Basic styling for the email */
    body {
      font-family: Arial, sans-serif;
      line-height: 1.5;
      margin: 0;
      padding: 0;
    }
    
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .button {
      display: inline-block;
      background-color: #007bff;
      color: #fff;
      padding: 10px 20px;
      text-decoration: none;
      border-radius: 5px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>${process.env.APP_NAME} ${type}</h1>
    <p>Please use the following One Time Passord (OTP): ${token}. This Password would expire after 20 minutes</p>
    <p>Best regards,</p>
    <p>The ${process.env.APP_NAME} Team</p>
  </div>
</body>
</html>
`

exports.activationEmailTemplate2 = (url, firstName)=>`
<!DOCTYPE html>
<html>
<head>
  <title>Activate Your ${process.env.APP_NAME} Account - Let's Get Started!</title>
  <style>
    /* Basic styling for the email */
    body {
      font-family: Arial, sans-serif;
      line-height: 1.5;
      margin: 0;
      padding: 0;
    }
    
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .button {
      display: inline-block;
      background-color: #007bff;
      color: #fff;
      padding: 10px 20px;
      text-decoration: none;
      border-radius: 5px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Activate Your ${process.env.APP_NAME} Account - Let's Get Started!</h1>
    <p>Dear ${firstName},</p>
    <p>Activate your ${process.env.APP_NAME} account now to start connecting with skilled service providers for your needs. Click on the activation button or copy and paste the activation link below into your web browser:</p>
    <p>
      <a class="button" href="${url}">Activate My Account</a>
    </p>
    <p>Activation Link:</p>
    <p>${url}</p>
    <p>Don't miss out on the benefits of ${process.env.APP_NAME}'s services. Activate your account today!</p>
    <p>Best regards,</p>
    <p>The ${process.env.APP_NAME} Team</p>
  </div>
</body>
</html>
`

exports.passwordResetTemplate = (url, email, firstName) =>`
<!DOCTYPE html>
<html>
<head>
  <title>${process.env.APP_NAME} Password Reset!</title>
  <style>
    /* Basic styling for the email */
    body {
      font-family: Arial, sans-serif;
      line-height: 1.5;
      margin: 0;
      padding: 0;
    }
    
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .button {
      display: inline-block;
      background-color: #007bff;
      color: #fff;
      padding: 10px 20px;
      text-decoration: none;
      border-radius: 5px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Password Reset</h1>
    <p>Hello ${firstName},</p>
    <p>We're sending you this email because you requested a password reset. Click on this link to create a new password:</p>
    <p>
      <a class="button" href="${url}">Click here to reset your password</a>
    </p>
    
    <p>If you didn't request a password reset, you can ignore this email. Your password will not be changed.</p>
    
    <p>Thank you,</p>
    <p>The ${process.env.APP_NAME} Team</p>
  </div>
</body>
</html>
`