#!/bin/bash

echo "🚀 Resend Email Setup Script"
echo "=============================="
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Creating .env from .env.example..."
    cp .env.example .env
fi

echo "📝 Please provide your Resend API key:"
echo ""
echo "1. Go to https://resend.com/signup"
echo "2. Create a free account (no credit card required)"
echo "3. Go to API Keys and create a new key"
echo "4. Copy the API key (starts with 're_')"
echo ""
read -p "Enter your Resend API key: " api_key

if [ -z "$api_key" ]; then
    echo "❌ No API key provided. Exiting..."
    exit 1
fi

# Update .env file
if grep -q "RESEND_API_KEY" .env; then
    # Replace existing key
    sed -i.bak "s/RESEND_API_KEY=.*/RESEND_API_KEY=$api_key/" .env
    echo "✅ Updated RESEND_API_KEY in .env"
else
    # Add new key
    echo "" >> .env
    echo "# Resend Email Configuration" >> .env
    echo "RESEND_API_KEY=$api_key" >> .env
    echo "EMAIL_FROM=QRtrX Equipment Tracker <onboarding@resend.dev>" >> .env
    echo "✅ Added RESEND_API_KEY to .env"
fi

# Remove old email config if exists
sed -i.bak '/EMAIL_HOST/d' .env
sed -i.bak '/EMAIL_PORT/d' .env
sed -i.bak '/EMAIL_USER/d' .env
sed -i.bak '/EMAIL_PASSWORD/d' .env

echo ""
echo "✅ Setup complete!"
echo ""
echo "📧 Testing email service..."
node test-email.js

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Success! Your email service is configured correctly."
    echo ""
    echo "Next steps:"
    echo "1. Check your email inbox for test emails"
    echo "2. Start the scheduler: npm run scheduler"
    echo "3. Deploy to production with your RESEND_API_KEY"
else
    echo ""
    echo "❌ Test failed. Please check the error messages above."
    echo "See RESEND_SETUP.md for troubleshooting."
fi
