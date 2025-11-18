# QR Code Fix Guide

## Problem
QR codes point to Railway backend URL instead of frontend URL.

## Quick Fix Steps

### 1. Update Railway Environment Variable
- Go to Railway Dashboard → Backend Service → Variables
- Set: `FRONTEND_URL=https://your-netlify-url.netlify.app`

### 2. Deploy Changes
```bash
git add .
git commit -m "Add QR code redirect fix"
git push origin main
```

### 3. Optional: Regenerate QR Codes
```bash
cd backend
npm run regenerate-qr
```

## What Changed
- Backend now redirects `/equipment/scan/:id` to frontend
- Old QR codes will work via redirect
- New equipment will have correct QR codes
