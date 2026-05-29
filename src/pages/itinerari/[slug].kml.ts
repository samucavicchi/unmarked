import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export async function getStaticPaths() {
  const itinerari = await getCollection('itinerari');
  return itinerari.map((entry) => ({
    params: { slug: entry.slug },
    props: { entry },
  }));
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export const GET: APIRoute = ({ props }: { props: any }) => {
  const { entry } = props;
  const { data } = entry;
  const markers: Array<{ lat: number; lng: number; label: string; dayNumber?: number }> =
    data.mapMarkers || [];

  const placemarks = markers
    .map(
      (m) => `    <Placemark>
      <name>${escapeXml(m.label)}${m.dayNumber != null ? ' · Giorno ' + m.dayNumber : ''}</name>
      <description>${escapeXml(data.title)} — Itinerario Unmarked</description>
      <Point>
        <coordinates>${m.lng},${m.lat},0</coordinates>
      </Point>
    </Placemark>`
    )
    .join('\n');

  const kml = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>${escapeXml(data.title)}</name>
    <description>Itinerario Unmarked · ${escapeXml(data.country)} · ${data.duration} giorni</description>
${placemarks}
  </Document>
</kml>`;

  return new Response(kml, {
    headers: {
      'Content-Type': 'application/vnd.google-earth.kml+xml',
      'Content-Disposition': `attachment; filename="${entry.slug}.kml"`,
    },
  });
};
