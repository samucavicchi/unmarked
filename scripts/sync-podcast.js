// scripts/sync-podcast.js
// Legge il feed RSS Anchor e crea .md per ogni episodio non ancora presente.
// Viene eseguito dalla GitHub Action .github/workflows/sync-podcast.yml

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RSS_URL = process.env.RSS_URL || 'https://anchor.fm/s/112725408/podcast/rss';
const CONTENT_DIR = path.join(__dirname, '../src/content/podcast');

// ─── Helpers ────────────────────────────────────────────────────────────────

function extractTag(xml, tag) {
  const re = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const m = xml.match(re);
  if (!m) return '';
  return m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim();
}

function extractAttr(xml, tag, attr) {
  const re = new RegExp(`<${tag}[^>]*\\s${attr}="([^"]*)"`, 'i');
  const m = xml.match(re);
  return m ? m[1] : '';
}

function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

function parseDuration(str) {
  if (!str) return 0;
  const parts = str.split(':').map(Number);
  if (parts.length === 3) return Math.round(parts[0] * 60 + parts[1] + parts[2] / 60);
  if (parts.length === 2) return Math.round(parts[0] + parts[1] / 60);
  return parseInt(str) || 0;
}

function stripHtml(str) {
  return str
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`Fetching RSS: ${RSS_URL}`);
  const res = await fetch(RSS_URL);
  if (!res.ok) throw new Error(`RSS fetch failed: ${res.status}`);
  const xml = await res.text();

  const items = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];
  console.log(`Episodi trovati nel feed: ${items.length}`);

  fs.mkdirSync(CONTENT_DIR, { recursive: true });
  const existing = fs.readdirSync(CONTENT_DIR).map(f => f.replace('.md', ''));

  let created = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    const title = extractTag(item, 'title');
    if (!title) continue;

    const slug = slugify(title);
    if (existing.includes(slug)) {
      console.log(`  skip (esiste): ${slug}`);
      continue;
    }

    const audioUrl = extractAttr(item, 'enclosure', 'url');
    if (!audioUrl) continue;

    const description = extractTag(item, 'description') || extractTag(item, 'itunes:summary');
    const excerpt = stripHtml(description).slice(0, 220);
    const pubDateStr = extractTag(item, 'pubDate');
    const pubDate = pubDateStr
      ? new Date(pubDateStr).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];
    const durationRaw = extractTag(item, 'itunes:duration');
    const duration = parseDuration(durationRaw);
    const episodeNumber = parseInt(extractTag(item, 'itunes:episode')) || (items.length - i);
    const subtitle = extractTag(item, 'itunes:subtitle') || '';

    // Spotify episode ID: lasciato vuoto — compilare via CMS
    const frontmatter = [
      '---',
      `title: "${title.replace(/"/g, "'")}"`,
      subtitle ? `subtitle: "${subtitle.replace(/"/g, "'")}"` : null,
      `episodeNumber: ${episodeNumber}`,
      `topic: Storie`,
      `excerpt: >`,
      `  ${excerpt}`,
      `publishDate: ${pubDate}`,
      `featured: false`,
      `spotifyEpisodeId: ''`,
      `audioUrl: ${audioUrl}`,
      `duration: ${duration}`,
      '---',
      '',
    ].filter(l => l !== null).join('\n');

    const filePath = path.join(CONTENT_DIR, `${slug}.md`);
    fs.writeFileSync(filePath, frontmatter, 'utf-8');
    console.log(`  ✓ creato: ${slug}.md`);
    created++;
  }

  console.log(`\nFatto — episodi creati: ${created}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
