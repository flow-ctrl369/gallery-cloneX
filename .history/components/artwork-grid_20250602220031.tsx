import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from './ui/card';
import { artworks, artists } from '@/lib/data';
import { Button } from './ui/button';
import { Instagram, Twitter, Link as LinkIcon } from 'lucide-react';

// Helper function to get artist by name
const getArtist = (artistName: string) => {
  return artists.find(artist => artist.name === artistName);
};

export default function ArtworkGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {artworks.map((artwork) => {
        const artist = getArtist(artwork.artist);
        return (
          <Card key={artwork.id} className="h-full flex flex-col">
            {/* Main link wraps only the image for now */}
            <Link href={`/artwork/${artwork.id}`} className="relative block w-full aspect-[4/3] overflow-hidden rounded-t-lg group">
              <Image
                src={artwork.image}
                alt={artwork.title}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
            <CardContent className="p-4 flex flex-col flex-grow">
              <div className="flex-grow">
                {/* Title can optionally be part of the main link or separate */}
                <Link href={`/artwork/${artwork.id}`}> 
                  <h3 className="text-lg font-semibold leading-tight hover:underline">{artwork.title}</h3>
                </Link>
                <p className="text-sm text-muted-foreground">{artwork.artist}</p>
              </div>
              
              {/* Social media icons are now outside the main Link wrapper */}
              {artist?.socialMedia && (
                <div className="flex gap-2 mt-4">
                  {artist.socialMedia.instagram && (
                    <a
                      href={artist.socialMedia.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Instagram size={20} />
                    </a>
                  )}
                  {artist.socialMedia.twitter && (
                    <a
                      href={artist.socialMedia.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Twitter"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Twitter size={20} />
                    </a>
                  )}
                  {artist.socialMedia.website && (
                    <a
                      href={artist.socialMedia.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Website"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <LinkIcon size={20} />
                    </a>
                  )}
                </div>
              )}
              
              {/* Price is now outside the main Link wrapper */}
              <div className="mt-4 text-lg font-bold">${artwork.price.toLocaleString()}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
