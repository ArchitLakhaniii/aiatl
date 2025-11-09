import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { jwt } from 'hono/jwt';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

type Env = {
  MONGODB_URI: string;
  JWT_SECRET: string;
  GEMINI_SERVICE_URL: string;
};

const app = new Hono<{ Bindings: Env }>();

// CORS middleware
app.use('/*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// MongoDB connection helper
async function getMongoClient(env: Env) {
  const client = new MongoClient(env.MONGODB_URI);
  await client.connect();
  return client;
}

// JWT helpers
async function createToken(payload: any, secret: string) {
  const encoder = new TextEncoder();
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encoder.encode(secret));
}

async function verifyToken(token: string, secret: string) {
  const encoder = new TextEncoder();
  const { payload } = await jwtVerify(token, encoder.encode(secret));
  return payload;
}

// Health check
app.get('/health', (c) => {
  return c.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'aiatl-backend'
  });
});

// ===== AUTH ENDPOINTS =====

app.post('/api/register', async (c) => {
  try {
    const { email, password, name, location, bio } = await c.req.json();
    
    const client = await getMongoClient(c.env);
    const db = client.db('flashrequest');
    const users = db.collection('users');
    
    // Check if user exists
    const existing = await users.findOne({ email });
    if (existing) {
      await client.close();
      return c.json({ error: 'User already exists' }, 400);
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const result = await users.insertOne({
      email,
      password: hashedPassword,
      name,
      location,
      bio,
      verified: false,
      createdAt: new Date(),
    });
    
    // Create token
    const token = await createToken(
      { userId: result.insertedId.toString(), email },
      c.env.JWT_SECRET
    );
    
    await client.close();
    
    return c.json({
      success: true,
      token,
      user: {
        id: result.insertedId.toString(),
        email,
        name,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    return c.json({ error: 'Registration failed' }, 500);
  }
});

app.post('/api/login', async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    const client = await getMongoClient(c.env);
    const db = client.db('flashrequest');
    const users = db.collection('users');
    
    // Find user
    const user = await users.findOne({ email });
    if (!user) {
      await client.close();
      return c.json({ error: 'Invalid credentials' }, 401);
    }
    
    // Verify password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      await client.close();
      return c.json({ error: 'Invalid credentials' }, 401);
    }
    
    // Create token
    const token = await createToken(
      { userId: user._id.toString(), email: user.email },
      c.env.JWT_SECRET
    );
    
    await client.close();
    
    return c.json({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ error: 'Login failed' }, 500);
  }
});

// Protected route middleware
const authMiddleware = async (c: any, next: any) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  const token = authHeader.substring(7);
  try {
    const payload = await verifyToken(token, c.env.JWT_SECRET);
    c.set('user', payload);
    await next();
  } catch (error) {
    return c.json({ error: 'Invalid token' }, 401);
  }
};

// ===== LISTINGS ENDPOINTS =====

app.get('/api/listings', async (c) => {
  try {
    const client = await getMongoClient(c.env);
    const db = client.db('flashrequest');
    const listings = db.collection('listings');
    
    // Get query params
    const search = c.req.query('search');
    const category = c.req.query('category');
    const priceMax = c.req.query('priceMax');
    
    // Build query
    const query: any = {};
    if (search) {
      query.$text = { $search: search };
    }
    if (category) {
      query.category = category;
    }
    if (priceMax) {
      query.price = { $lte: Number(priceMax) };
    }
    
    const results = await listings.find(query).limit(50).toArray();
    await client.close();
    
    return c.json({ listings: results });
  } catch (error) {
    console.error('Listings error:', error);
    return c.json({ error: 'Failed to fetch listings' }, 500);
  }
});

app.post('/api/listings', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const body = await c.req.json();
    
    const client = await getMongoClient(c.env);
    const db = client.db('flashrequest');
    const listings = db.collection('listings');
    
    const result = await listings.insertOne({
      ...body,
      userId: user.userId,
      createdAt: new Date(),
      status: 'active',
    });
    
    await client.close();
    
    return c.json({
      success: true,
      id: result.insertedId.toString(),
    });
  } catch (error) {
    console.error('Create listing error:', error);
    return c.json({ error: 'Failed to create listing' }, 500);
  }
});

// ===== GEMINI PROXY =====

app.post('/api/parse-request', async (c) => {
  try {
    const body = await c.req.json();
    
    const response = await fetch(`${c.env.GEMINI_SERVICE_URL}/api/parse-request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.error('Parse request error:', error);
    return c.json({ error: 'Failed to parse request' }, 500);
  }
});

app.post('/api/parse-profile', async (c) => {
  try {
    const body = await c.req.json();
    
    const response = await fetch(`${c.env.GEMINI_SERVICE_URL}/api/parse-profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.error('Parse profile error:', error);
    return c.json({ error: 'Failed to parse profile' }, 500);
  }
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not found' }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('Server error:', err);
  return c.json({ error: 'Internal server error' }, 500);
});

export default app;
