import type { APIRoute } from 'astro';

export const prerender = false;

const RTDB_URL = import.meta.env.FIREBASE_RTDB_URL || 'https://amalshalih-fd1bd-default-rtdb.firebaseio.com';

export const GET: APIRoute = async ({ params }) => {
  const { slug } = params;
  
  if (!slug) {
    return new Response(JSON.stringify({ error: 'Gallery slug is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const response = await fetch(`${RTDB_URL}/likes/${slug}.json`);
    const data = await response.json();
    
    return new Response(JSON.stringify({ 
      slug,
      likes: data || 0 
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch likes' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ params }) => {
  const { slug } = params;
  
  if (!slug) {
    return new Response(JSON.stringify({ error: 'Gallery slug is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const getResponse = await fetch(`${RTDB_URL}/likes/${slug}.json`);
    const currentLikes = await getResponse.json() || 0;
    const newLikes = currentLikes + 1;
    
    const updateResponse = await fetch(`${RTDB_URL}/likes/${slug}.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLikes)
    });

    if (!updateResponse.ok) {
      throw new Error('Failed to update likes');
    }

    return new Response(JSON.stringify({ 
      slug,
      likes: newLikes,
      success: true 
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update likes' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
};
