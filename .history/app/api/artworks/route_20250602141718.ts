import { NextResponse } from 'next/server';

// Sample artwork data with Unsplash placeholder images
const artworks = [
  {
    id: 1,
    title: "Abstract Harmony",
    description: "A vibrant abstract composition exploring color and form",
    artist: "Sarah Chen",
    year: 2023,
    price: 2500,
    imageUrl: "https://images.unsplash.com/photo-1549887534-1541e9326642?w=800&auto=format&fit=crop&q=60",
    category: "paintings"
  },
  {
    id: 2,
    title: "Urban Reflection",
    description: "A photographic exploration of city life and architecture",
    artist: "Michael Torres",
    year: 2023,
    price: 1200,
    imageUrl: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&auto=format&fit=crop&q=60",
    category: "photography"
  },
  {
    id: 3,
    title: "Eternal Flow",
    description: "A contemporary sculpture exploring movement and space",
    artist: "Emma Rodriguez",
    year: 2023,
    price: 4500,
    imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&auto=format&fit=crop&q=60",
    category: "sculptures"
  },
  {
    id: 4,
    title: "Digital Dreams",
    description: "A digital artwork exploring the intersection of technology and art",
    artist: "Alex Kim",
    year: 2023,
    price: 1800,
    imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=60",
    category: "digital"
  },
  {
    id: 5,
    title: "Mountain Serenity",
    description: "A landscape painting capturing the beauty of nature",
    artist: "David Park",
    year: 2023,
    price: 3200,
    imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&auto=format&fit=crop&q=60",
    category: "paintings"
  },
  {
    id: 6,
    title: "Modern Minimalism",
    description: "A minimalist sculpture exploring form and negative space",
    artist: "Lisa Wong",
    year: 2023,
    price: 2800,
    imageUrl: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&auto=format&fit=crop&q=60",
    category: "sculptures"
  }
];

export async function GET() {
  try {
    return NextResponse.json(artworks);
  } catch (error) {
    console.error('Error fetching artworks:', error);
    return NextResponse.json(
      { message: 'Failed to fetch artworks' },
      { status: 500 }
    );
  }
} 