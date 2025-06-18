# Deployment Guide for Render

## Prerequisites

- GitHub repository with your code
- Render account
- Stripe account (for payments)
- Email service (Gmail or Resend)

## Step 1: Prepare Your Repository

1. Make sure all changes are committed and pushed to GitHub
2. Ensure your repository is public or connected to Render

## Step 2: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account
3. Connect your GitHub repository

## Step 3: Deploy Using Blueprint (Recommended)

1. In Render dashboard, click "New +"
2. Select "Blueprint"
3. Connect your GitHub repository
4. Render will automatically detect the `render.yaml` file
5. Click "Apply" to create both the database and web service

## Step 4: Set Environment Variables

After deployment, go to your web service settings and add these environment variables:

### Required Variables:

- `STRIPE_SECRET_KEY` - Your Stripe secret key (live mode)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key (live mode)
- `EMAIL_USER` - Your Gmail address
- `EMAIL_APP_PASSWORD` - Your Gmail app password
- `RESEND_API_KEY` - Your Resend API key

### Optional Variables:

- `NODE_ENV` - Set to "production" (already set in render.yaml)

## Step 5: Verify Deployment

1. Check that your app is running at the provided URL
2. Test the database connection
3. Test payment functionality
4. Test email sending

## Troubleshooting

### Database Connection Issues

- Ensure `DATABASE_URL` is properly set
- Check that migrations ran successfully
- Verify database is accessible from your app

### Build Failures

- Check build logs in Render dashboard
- Ensure all dependencies are in package.json
- Verify Node.js version compatibility

### Environment Variables

- Double-check all environment variable names
- Ensure no extra spaces or quotes
- Use live Stripe keys, not test keys for production

## Support

- Render Documentation: https://render.com/docs
- Prisma Documentation: https://www.prisma.io/docs
- Next.js Documentation: https://nextjs.org/docs
