// Vercel Serverless Function to create GitHub issues from form submissions
// Deploy this to Vercel or similar platform

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, type, subject, description } = req.body;

    // Validate required fields
    if (!name || !email || !type || !subject || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // GitHub Personal Access Token (set as environment variable)
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_REPO = 'bskyper/air-boss-support';

    if (!GITHUB_TOKEN) {
      console.error('GITHUB_TOKEN not configured');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Map form type to label
    const typeLabels = {
      'bug': 'bug',
      'feature': 'enhancement',
      'question': 'question',
      'other': 'discussion'
    };

    // Create issue body
    const issueBody = `## Submitted by
**Name:** ${name}
**Email:** ${email}

## Description
${description}

---
*This issue was automatically created from a support form submission*`;

    // Create GitHub issue
    const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/issues`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28'
      },
      body: JSON.stringify({
        title: subject,
        body: issueBody,
        labels: [typeLabels[type] || 'discussion']
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('GitHub API error:', error);
      return res.status(500).json({ error: 'Failed to create issue' });
    }

    const issue = await response.json();

    return res.status(200).json({
      success: true,
      issueNumber: issue.number,
      issueUrl: issue.html_url
    });

  } catch (error) {
    console.error('Error creating issue:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
