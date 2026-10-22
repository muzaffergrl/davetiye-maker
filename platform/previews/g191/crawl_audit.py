"""G191 crawl: BFS over the local marketing site, per-page on-page/schema/GEO signals -> JSON.

Usage: python crawl_audit.py http://localhost:3000 out.json [max_pages]
Uses claude-seo's parse_html.parse_html for the base extraction and adds checks it leaves to the agent.
"""
import json
import re
import sys
from collections import deque
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup

sys.path.insert(0, sys.argv[4] if len(sys.argv) > 4 else '.')
from parse_html import parse_html  # noqa: E402  (claude-seo)

BASE = sys.argv[1].rstrip('/')
OUT = sys.argv[2]
MAX = int(sys.argv[3]) if len(sys.argv) > 3 else 400
SKIP = re.compile(r'^/(api|edit|start|media|_next|themes|marketing|brand|i18n)(/|$)|\.(xml|txt|webp|jpg|png|mp4|svg|ico|pdf)$')


def words(text):
    return len(re.findall(r"[A-Za-zÀ-ÿĞğİıŞşÇçÖöÜü']+", text))


def audit(url, html, headers):
    soup = BeautifulSoup(html, 'lxml')
    base = parse_html(html, url)
    main = soup.find('main') or soup.body
    text = main.get_text(' ', strip=True) if main else ''
    ld, ld_err = [], []
    for s in soup.find_all('script', type='application/ld+json'):
        try:
            d = json.loads(s.string or '')
            nodes = d.get('@graph', [d]) if isinstance(d, dict) else d
            for n in nodes:
                ld.append(n)
        except Exception as e:  # noqa: BLE001
            ld_err.append(str(e))
    types = []
    for n in ld:
        t = n.get('@type')
        types += t if isinstance(t, list) else [t]
    heads = [(h.name, h.get_text(' ', strip=True)) for h in soup.find_all(re.compile('^h[1-6]$'))]
    skips = []
    prev = 0
    for name, _ in heads:
        lvl = int(name[1])
        if prev and lvl > prev + 1:
            skips.append(f'h{prev}->h{lvl}')
        prev = lvl
    q_heads = [t for n, t in heads if n in ('h2', 'h3') and t.endswith('?')]
    imgs = soup.find_all('img')
    first_p = ''
    for p in (main.find_all('p') if main else []):
        t = p.get_text(' ', strip=True)
        if len(t) > 40:
            first_p = t
            break
    hreflang = [l.get('hreflang') for l in soup.find_all('link', rel='alternate') if l.get('hreflang')]
    placeholders = sorted(set(re.findall(r'\[[A-Z][A-Z \-]{2,}[A-Z]\]', soup.get_text(' '))))
    dates = [m.get('content') for m in soup.find_all('meta') if m.get('property', '').startswith('article:')]
    times = [t.get('datetime') for t in soup.find_all('time')]
    return {
        'url': url,
        'status': headers.get('status'),
        'x_robots': headers.get('x-robots-tag'),
        'title': base.get('title'),
        'title_len': len(base.get('title') or ''),
        'description': base.get('meta_description'),
        'desc_len': len(base.get('meta_description') or ''),
        'canonical': base.get('canonical'),
        'robots_meta': base.get('meta_robots'),
        'h1': base.get('h1'),
        'heading_skips': skips,
        'question_headings': len(q_heads),
        'h2_count': sum(1 for n, _ in heads if n == 'h2'),
        'word_count': words(text),
        'imgs': len(imgs),
        'imgs_no_alt': sum(1 for i in imgs if i.get('alt') is None),
        'imgs_empty_alt': sum(1 for i in imgs if i.get('alt') == ''),
        'imgs_no_dims': sum(1 for i in imgs if not (i.get('width') and i.get('height'))),
        'jsonld_types': types,
        'jsonld_errors': ld_err,
        'jsonld': ld,
        'hreflang': hreflang,
        'og': {k: v for k, v in base.get('open_graph', {}).items()} if isinstance(base.get('open_graph'), dict) else base.get('open_graph'),
        'twitter': base.get('twitter_card'),
        'internal_links': len(base.get('links', {}).get('internal', [])) if isinstance(base.get('links'), dict) else None,
        'external_links': len(base.get('links', {}).get('external', [])) if isinstance(base.get('links'), dict) else None,
        'first_paragraph': first_p[:400],
        'first_paragraph_words': words(first_p),
        'tables': len(soup.find_all('table')),
        'lists': len(soup.find_all(['ol', 'ul'])),
        'placeholders': placeholders,
        'article_meta': dates,
        'time_tags': times,
        'html_lang': (soup.html or {}).get('lang') if soup.html else None,
        'bytes': len(html.encode()),
    }


def main():
    s = requests.Session()
    seen, q, pages, links = set(), deque(['/']), [], {}
    while q and len(pages) < MAX:
        path = q.popleft()
        if path in seen:
            continue
        seen.add(path)
        r = s.get(BASE + path, timeout=60, allow_redirects=False)
        hdr = {k.lower(): v for k, v in r.headers.items()}
        hdr['status'] = r.status_code
        if r.status_code in (301, 302, 307, 308):
            pages.append({'url': BASE + path, 'status': r.status_code, 'location': r.headers.get('location')})
            loc = urlparse(urljoin(BASE + path, r.headers.get('location', '')))
            if loc.netloc == urlparse(BASE).netloc:
                q.append(loc.path)
            continue
        if 'text/html' not in r.headers.get('content-type', ''):
            continue
        page = audit(BASE + path, r.text, hdr)
        pages.append(page)
        soup = BeautifulSoup(r.text, 'lxml')
        out = []
        for a in soup.find_all('a', href=True):
            u = urlparse(urljoin(BASE + path, a['href']))
            if u.netloc != urlparse(BASE).netloc:
                continue
            p = u.path.rstrip('/') or '/'
            out.append(p)
            if p not in seen and not SKIP.search(p):
                q.append(p)
        links[path] = sorted(set(out))
    inbound = {}
    for src, outs in links.items():
        for o in outs:
            if o != src:
                inbound.setdefault(o, set()).add(src)
    for p in pages:
        path = urlparse(p['url']).path or '/'
        p['inbound'] = len(inbound.get(path, ()))
    files = {}
    for f in ['/robots.txt', '/sitemap.xml', '/llms.txt', '/llms-full.txt']:
        r = s.get(BASE + f, timeout=60)
        files[f] = {'status': r.status_code, 'bytes': len(r.content), 'head': r.text[:3000]}
    json.dump({'base': BASE, 'pages': pages, 'files': files}, open(OUT, 'w'), indent=1, ensure_ascii=False)
    print(f'{len(pages)} pages -> {OUT}')


if __name__ == '__main__':
    main()
