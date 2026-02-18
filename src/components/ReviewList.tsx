"use client";

import { useEffect, useState } from 'react';
import { Column, Text, Flex, Grid, Avatar } from '@once-ui-system/core';
// Using a simple workaround for the star icon if not available in the icon set, or use text
// Assuming 'star' is available or we use a character.
import { useTranslations } from 'next-intl';

interface Review {
  author_name: string;
  author_url: string;
  language?: string;
  original_language?: string;
  profile_photo_url: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
  translated?: boolean;
}

interface ReviewsData {
  rating: number;
  user_ratings_total: number;
  reviews: Review[];
}

export const ReviewList = () => {
  const [data, setData] = useState<ReviewsData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Hardcoded fallback text for now as we might not have translations set up for this component yet
  const t = {
    reviews: "Kundenbewertungen",
    googleRating: "Google Bewertung",
    basedOn: "Basierend auf",
    ratings: "Bewertungen",
    loading: "Lade Bewertungen..."
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch('/api/reviews');
        if (res.ok) {
          const result = await res.json();
          setData(result);
        }
      } catch (error) {
        console.error('Failed to load reviews', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
      return <Flex fillWidth padding="32" horizontal="center"><Text>{t.loading}</Text></Flex>;
  }

  if (!data || !data.reviews || data.reviews.length === 0) {
    return null; 
  }

  // Filter for good reviews (4 or 5 stars) and sort by newest/most relevant (API returns most relevant usually)
  const goodReviews = data.reviews.filter(r => r.rating >= 4).slice(0, 3); 

  return (
    <Column fillWidth gap="32" paddingY="64" horizontal="center">
      <Flex direction="column" horizontal="center" gap="8">
        <Text variant="heading-strong-l">{t.reviews}</Text>
        <Flex gap="8" vertical="center">
            <Text variant="body-default-l" onBackground="neutral-weak">{data.rating}</Text>
             {/* Simple Star Representation */}
            <Flex gap="2">
                {[...Array(5)].map((_, i) => (
                    <div key={i} style={{ 
                        width: 16, 
                        height: 16, 
                        backgroundColor: i < Math.round(data.rating) ? '#F4B400' : '#E0E0E0',
                        clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
                    }} />
                ))}
            </Flex>
            <Text variant="body-default-s" onBackground="neutral-weak">
                ({data.user_ratings_total} {t.ratings})
            </Text>
        </Flex>
      </Flex>

      <Flex fillWidth gap="24" wrap horizontal="center" maxWidth="l">
        {goodReviews.map((review, index) => (
          <Column 
            key={index}
            fillWidth
            background="surface" 
            border="neutral-medium" 
            radius="l" 
            padding="24" 
            gap="16"
            style={{ minWidth: '300px', maxWidth: '400px', flex: 1 }}
          >
            <Flex gap="12" vertical="center">
              {review.profile_photo_url && (
                <Avatar src={review.profile_photo_url} size="m" />
              )}
              <Column>
                <Text variant="body-strong-m">{review.author_name}</Text>
                <Text variant="body-default-xs" onBackground="neutral-weak">{review.relative_time_description}</Text>
              </Column>
            </Flex>
            
            <Flex gap="2">
                 {[...Array(5)].map((_, i) => (
                    <div key={i} style={{ 
                        width: 12, 
                        height: 12, 
                        backgroundColor: i < review.rating ? '#F4B400' : '#E0E0E0',
                        clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
                    }} />
                ))}
            </Flex>

            <Text variant="body-default-s" onBackground="neutral-medium" style={{ 
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
            }}>
              "{review.text}"
            </Text>
          </Column>
        ))}
      </Flex>
      
      <Flex>
        <a href="https://search.google.com/local/writereview?placeid=ChIJH8DCIO45jkcRpNPamNi-zJk" target="_blank" rel="noopener noreferrer">
            <Text variant="body-default-m" style={{textDecoration: 'underline'}}>Alle Bewertungen auf Google ansehen</Text>
        </a>
      </Flex>
    </Column>
  );
};
