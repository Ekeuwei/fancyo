exports.activationEmailTemplate = (url, firstName)=>`
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
    <p>Welcome to ${process.env.APP_NAME}, the platform that connects you with skilled service providers for your personal needs. We're thrilled to have you as part of our community! Before you can explore the wide range of services available, we kindly ask you to activate your account by following the activation link provided below:</p>
    <p>
      <a class="button" href="${url}">Activate My Account</a>
    </p>
    <p>If you're unable to click the button, please copy and paste the following link into your web browser to activate your account:</p>
    <p>${url}</p>
    <p>Activating your account is essential to unlock the full functionality of ${process.env.APP_NAME}, allowing you to browse, book, and connect with our dedicated workers seamlessly.</p>
    <p>Join the ${process.env.APP_NAME} community today and discover the convenience and quality of our personalized services!</p>
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
    
    <p>Thank you</br> The ${process.env.APP_NAME} Team.</p>
  </div>
</body>
</html>
`