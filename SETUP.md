# Air Boss Support Setup Guide

This guide explains how to set up the automated issue creation system for your support portal.

## Overview

The support form allows pilots to submit issues **without needing a GitHub account**. Form submissions are automatically converted to GitHub issues.

## Setup Options

You have three options to make the form functional:

### Option 1: Vercel Serverless (Recommended - FREE)

This is the easiest and most reliable option.

#### Steps:

1. **Create a Vercel account** (free)
   - Go to https://vercel.com/signup
   - Sign up with your GitHub account

2. **Create a GitHub Personal Access Token**
   - Go to https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Give it a name like "Air Boss Support Form"
   - Select scope: `public_repo` (allows creating issues)
   - Click "Generate token"
   - **Copy the token** (you won't see it again!)

3. **Deploy to Vercel**
   ```bash
   # Install Vercel CLI
   npm install -g vercel

   # Deploy from your repository directory
   cd /path/to/air-boss-support
   vercel

   # Follow the prompts:
   # - Link to existing project or create new
   # - Choose settings (defaults are fine)
   ```

4. **Add Environment Variable in Vercel**
   - Go to your Vercel project dashboard
   - Settings → Environment Variables
   - Add: `GITHUB_TOKEN` = your token from step 2
   - Redeploy: `vercel --prod`

5. **Update the form endpoint**
   - Edit `index.html` line 219
   - Change `FORM_ENDPOINT` to: `https://your-project.vercel.app/api/submit-issue`
   - Commit and push the change

### Option 2: Formspree (Easiest - FREE tier available)

Formspree handles form submissions and can email you the details. You manually create GitHub issues.

#### Steps:

1. **Sign up at Formspree**
   - Go to https://formspree.io
   - Create a free account
   - Create a new form

2. **Get your form ID**
   - Formspree will give you a form ID like `abc123xyz`

3. **Update index.html**
   - Edit line 219
   - Change to: `const FORM_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';`
   - Replace `YOUR_FORM_ID` with your actual ID

4. **Enable GitHub integration (optional)**
   - Formspree can create GitHub issues automatically on paid plans
   - Or you can receive emails and manually create issues

### Option 3: Google Forms + Zapier/Make

Use Google Forms with automation tools to create issues.

#### Steps:

1. Create a Google Form with the same fields
2. Use Zapier or Make.com to connect:
   - Trigger: New Google Form response
   - Action: Create GitHub issue
3. Replace the current form with an embedded Google Form

## Testing

After setup:

1. Visit your GitHub Pages site
2. Fill out the form with test data
3. Submit
4. Check your GitHub issues - a new issue should appear!

## Troubleshooting

**Form submission fails:**
- Check that your GitHub token has `public_repo` scope
- Verify the token is set in environment variables
- Check Vercel logs for errors

**No issue created:**
- Verify the repository name is correct in the API function
- Check that the token hasn't expired
- Look at the browser console for errors

## Current Status

✅ Form UI created (pilot-friendly, no GitHub account needed)
⏳ Backend setup required (choose Option 1, 2, or 3 above)
⏳ Testing needed after backend is configured

## Recommended Next Steps

1. Set up **Vercel** (Option 1) - it's free, fast, and reliable
2. Test the form with a real submission
3. Customize issue labels and templates as needed
4. Add email notifications for new issues (GitHub settings)

## Questions?

Open an issue in this repository if you need help with the setup!
