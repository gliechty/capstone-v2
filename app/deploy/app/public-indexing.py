"""Scope the existing exclusion header; preserve all other Caddy directives."""
from pathlib import Path
p = Path("/etc/caddy/Caddyfile")
s = p.read_text()
old = '        X-Robots-Tag "noindex, nofollow, noarchive"'
rule = '    @nonPublic not path / /about/guy-liechty /robots.txt /sitemap.xml\n    header @nonPublic X-Robots-Tag "noindex, nofollow, noarchive"'
if rule not in s:
    assert s.count(old) == 1, "Unexpected indexing configuration; inspect before modifying"
    s = s.replace(old + "\n", "")
    anchor = "preview.flowagentai.website {"
    assert s.count(anchor) == 1
    s = s.replace(anchor, anchor + "\n" + rule)
    p.write_text(s)
