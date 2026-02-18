import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const placeId = 'ChIJH8DCIO45jkcRpNPamNi-zJk'; // Suksan Massage Place ID

  if (!apiKey) {
    return NextResponse.json({ error: 'Missing API Key' }, { status: 500 });
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&key=${apiKey}&language=de`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    const data = await response.json();

    if (data.status !== 'OK') {
        console.error('Google Places API Error:', data);
        return NextResponse.json({ error: data.error_message || 'Failed to fetch reviews' }, { status: 500 });
    }

    return NextResponse.json(data.result);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
