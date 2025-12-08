// Suppress dotenv console output
const originalLog = console.log;
console.log = () => {};
require('dotenv').config({ silent: true });
console.log = originalLog;

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

/**
 * Discord OAuth Callback Handler
 * POST /api/discord/callback
 */
app.post('/api/discord/callback', async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'No authorization code provided' });
  }

  if (!process.env.DISCORD_CLIENT_ID || !process.env.DISCORD_CLIENT_SECRET) {
    return res.status(500).json({ error: 'Discord credentials not configured' });
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.DISCORD_REDIRECT_URI,
      }).toString(),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('Token exchange error:', errorData);
      throw new Error(errorData.error_description || 'Token exchange failed');
    }

    const tokenData = await tokenResponse.json();

    // Get user data
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to fetch user data');
    }

    const userData = await userResponse.json();

    // Build avatar URL
    let avatarUrl = '👤';
    if (userData.avatar) {
      const format = userData.avatar.startsWith('a_') ? 'gif' : 'png';
      avatarUrl = `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.${format}`;
    }

    // Return user data and token
    res.json({
      success: true,
      user: {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        avatar: avatarUrl,
        discriminator: userData.discriminator,
      },
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
    });
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.status(400).json({ 
      success: false,
      error: error.message || 'Authentication failed' 
    });
  }
});

/**
 * Twitch User Search
 * GET /api/twitch/search-users
 */
app.get('/api/twitch/search-users', async (req, res) => {
  const { query } = req.query;

  if (!query || query.trim().length === 0) {
    return res.json({ users: [] });
  }

  if (!process.env.TWITCH_CLIENT_ID || !process.env.TWITCH_CLIENT_SECRET) {
    return res.status(500).json({ error: 'Twitch credentials not configured' });
  }

  try {
    // Get Twitch app access token
    const tokenResponse = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.TWITCH_CLIENT_ID,
        client_secret: process.env.TWITCH_CLIENT_SECRET,
        grant_type: 'client_credentials',
      }).toString(),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to get Twitch access token');
    }

    const tokenData = await tokenResponse.json();

    // Search for users
    const searchResponse = await fetch(
      `https://api.twitch.tv/helix/search/channels?query=${encodeURIComponent(query)}&first=20`,
      {
        headers: {
          'Client-ID': process.env.TWITCH_CLIENT_ID,
          'Authorization': `Bearer ${tokenData.access_token}`,
        },
      }
    );

    if (!searchResponse.ok) {
      throw new Error('Failed to search Twitch users');
    }

    const searchData = await searchResponse.json();

    // Format the results
    const users = searchData.data.map(channel => ({
      id: channel.id,
      username: channel.broadcaster_login,
      displayName: channel.display_name,
      profileImage: channel.thumbnail_url ? channel.thumbnail_url.replace('{width}', '50').replace('{height}', '50') : null,
      isLive: channel.is_live,
    }));

    res.json({ users });
  } catch (error) {
    console.error('Twitch search error:', error);
    res.status(500).json({ error: 'Failed to search Twitch users' });
  }
});

/**
 * Get Twitch Users Data (Bulk)
 * GET /api/twitch/users
 * Accepts 'usernames' query param as comma-separated list
 */
app.get('/api/twitch/users', async (req, res) => {
  const { usernames } = req.query;

  if (!usernames || usernames.trim().length === 0) {
    return res.json({ users: {} });
  }

  if (!process.env.TWITCH_CLIENT_ID || !process.env.TWITCH_CLIENT_SECRET) {
    return res.status(500).json({ error: 'Twitch credentials not configured' });
  }

  try {
    // Get Twitch app access token
    const tokenResponse = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.TWITCH_CLIENT_ID,
        client_secret: process.env.TWITCH_CLIENT_SECRET,
        grant_type: 'client_credentials',
      }).toString(),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to get Twitch access token');
    }

    const tokenData = await tokenResponse.json();

    // Build query string with multiple logins (max 100 per request)
    const usernameList = usernames.split(',').slice(0, 100);
    const loginParams = usernameList.map(u => `login=${encodeURIComponent(u.trim())}`).join('&');

    // Get user data for all usernames at once
    const userResponse = await fetch(
      `https://api.twitch.tv/helix/users?${loginParams}`,
      {
        headers: {
          'Client-ID': process.env.TWITCH_CLIENT_ID,
          'Authorization': `Bearer ${tokenData.access_token}`,
        },
      }
    );

    if (!userResponse.ok) {
      throw new Error('Failed to get Twitch user data');
    }

    const userData = await userResponse.json();

    // Map results by username for easy lookup
    const users = {};
    userData.data.forEach(user => {
      users[user.login] = {
        id: user.id,
        username: user.login,
        displayName: user.display_name,
        profileImage: user.profile_image_url,
      };
    });

    res.json({ users });
  } catch (error) {
    console.error('Twitch users fetch error:', error);
    res.status(500).json({ error: 'Failed to get Twitch user data' });
  }
});

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

/**
 * Start server
 */
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
