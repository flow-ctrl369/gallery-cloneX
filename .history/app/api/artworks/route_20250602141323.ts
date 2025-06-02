import { NextResponse } from 'next/server';

// Sample artwork data - replace this with your actual data source
const artworks = [
  {
    id: 1,
    title: "Abstract Harmony",
    description: "A vibrant abstract composition exploring color and form",
    artist: "Sarah Chen",
    year: 2023,
    price: 2500,
    imageUrl: "/artworks/abstract-harmony.jpg",
    category: "paintings"
  },
  {
    id: 2,
    title: "Urban Reflection",
    description: "A photographic exploration of city life and architecture",
    artist: "Michael Torres",
    year: 2023,
    price: 1200,
    imageUrl: "/artworks/urban-reflection.jpg",
    category: "photography"
  },
  {
    id: 3,
    title: "Eternal Flow",
    description: "A contemporary sculpture exploring movement and space",
    artist: "Emma Rodriguez",
    year: 2023,
    price: 4500,
    imageUrl: "/artworks/eternal-flow.jpg",
    category: "sculptures"
  },
  {
    id: 4,
    title: "Digital Dreams",
    description: "A digital artwork exploring the intersection of technology and art",
    artist: "Alex Kim",
    year: 2023,
    price: 1800,
    imageUrl: "/artworks/digital-dreams.jpg",
    category: "digital"
  },
  {
    id: 5,
    title: "Mountain Serenity",
    description: "A landscape painting capturing the beauty of nature",
    artist: "David Park",
    year: 2023,
    price: 3200,
    imageUrl: "/artworks/mountain-serenity.jpg",
    category: "paintings"
  },
  {
    id: 6,
    title: "Modern Minimalism",
    description: "A minimalist sculpture exploring form and negative space",
    artist: "Lisa Wong",
    year: 2023,
    price: 2800,
    imageUrl: "/artworks/modern-minimalism.jpg",
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