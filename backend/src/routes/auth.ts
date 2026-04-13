import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();


const asyncHandler = (fn: any) => (req: any, res: any, next: any) => Promise.resolve(fn(req, res, next)).catch(next);

const setAuthCookie = (res: any, token: string) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

router.post('/register', asyncHandler(async (req: any, res: any) => {
  const { email, password, name } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }
  if (String(password).length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(409).json({ success: false, message: 'User already exists' });
  }

  const passwordHash = await bcrypt.hash(String(password), 10);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name: name || String(email).split('@')[0],
    },
  });

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: '7d' }
  );
  setAuthCookie(res, token);

  res.json({
    success: true,
    data: {
      user: { id: user.id, name: user.name, email: user.email, role: user.role, image: user.image },
      token
    }
  });
}));

router.post('/login', asyncHandler(async (req: any, res: any) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
  if (!user.passwordHash) {
    return res.status(401).json({ success: false, message: 'Please create a new account with password' });
  }

  const isValidPassword = await bcrypt.compare(String(password), user.passwordHash);
  if (!isValidPassword) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: '7d' }
  );
  setAuthCookie(res, token);

  res.json({
    success: true,
    data: {
      user: { id: user.id, name: user.name, email: user.email, role: user.role, image: user.image },
      token
    }
  });
}));

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully' });
});

router.get('/me', authenticate, (req: any, res: any) => {
  res.json({ success: true, data: req.user });
});

// Google OAuth — verify access_token via Google userinfo endpoint, find-or-create user, issue same JWT cookie
router.post('/google', asyncHandler(async (req: any, res: any) => {
  const { access_token } = req.body;

  if (!access_token) {
    return res.status(400).json({ success: false, message: 'Google access_token is required' });
  }

  // Call Google userinfo endpoint to validate token and retrieve user info
  let googleUser: any;
  try {
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo`,
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    if (!response.ok) {
      return res.status(401).json({ success: false, message: 'Invalid or expired Google token' });
    }

    googleUser = await response.json();
  } catch {
    return res.status(401).json({ success: false, message: 'Failed to verify Google token' });
  }

  if (!googleUser?.email) {
    return res.status(400).json({ success: false, message: 'Could not retrieve email from Google' });
  }

  const { email, name, picture } = googleUser;

  // Find or create the user — email is the unique key linking Google to existing accounts
  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name: name || email.split('@')[0],
        image: picture || null,
        // passwordHash intentionally left null — this is an OAuth user
      },
    });
  } else if (!user.image && picture) {
    // Update profile picture if they didn't have one yet
    user = await prisma.user.update({
      where: { email },
      data: { image: picture },
    });
  }

  // Issue the exact same JWT cookie as email/password login
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: '7d' }
  );
  setAuthCookie(res, token);

  res.json({
    success: true,
    data: {
      user: { id: user.id, name: user.name, email: user.email, role: user.role, image: user.image },
      token,
    },
  });
}));

export default router;
