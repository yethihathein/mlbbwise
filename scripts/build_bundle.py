"""
Generates js/data-bundle.js from /data/*.json so index.html works both over HTTP
and when double-clicked directly from Windows Explorer (file:// protocol).
"""

import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
JS_DIR = BASE_DIR / "js"


def main():
    bundle = {
        "heroes": json.loads((DATA_DIR / "heroes.json").read_text(encoding="utf-8")),
        "items": json.loads((DATA_DIR / "items.json").read_text(encoding="utf-8")),
        "lore": json.loads((DATA_DIR / "lore.json").read_text(encoding="utf-8")),
        "emblems": json.loads((DATA_DIR / "emblems.json").read_text(encoding="utf-8")),
    }
    js_content = (
        "// Auto-generated fallback bundle from /data/*.json for offline / file:// protocol support\n"
        "window.MLBB_STATIC_DATA = " + json.dumps(bundle, ensure_ascii=False) + ";\n"
    )
    (JS_DIR / "data-bundle.js").write_text(js_content, encoding="utf-8")
    print(f"Generated js/data-bundle.js ({len(js_content):,} bytes)")


if __name__ == "__main__":
    main()
