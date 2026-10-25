"""
MLBB Codex Static Data Sync Script
Fetches all 133 MLBB Heroes (with official portraits, skill icons, descriptions,
counters, synergies, attributes, and lore) + all 95 MLBB Equipment Items (with full
Tier 1 -> Tier 2 -> Tier 3 recipe trees) and writes static JSON files into /data.
"""

import json
import re
import urllib.request
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"

HERO_META_URL = "https://raw.githubusercontent.com/p3hndrx/MLBB-API/main/v1/hero-meta-final.json"
ITEM_META_URL = "https://raw.githubusercontent.com/p3hndrx/MLBB-API/main/v1/item-meta-final.json"


def slugify(text: str) -> str:
    s = text.lower().strip()
    s = s.replace("'", "").replace(".", "").replace("&", "and")
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")


ROLE_COLORS = {
    "Tank": ("#3b82f6", "#eab308"),
    "Fighter": ("#dc2626", "#f59e0b"),
    "Assassin": ("#ef4444", "#a855f7"),
    "Mage": ("#a855f7", "#38bdf8"),
    "Marksman": ("#eab308", "#f97316"),
    "Support": ("#22c55e", "#38bdf8"),
}

ROLE_BUILDS = {
    "Tank": {
        "items": ["tough-boots", "dominance-ice", "athenas-shield", "antique-cuirass", "blade-armor", "immortality"],
        "emblemId": "tank-emblem",
        "talents": ["Firmness (+6 Hybrid Def)", "Tenacity (+15 Def below 50% HP)", "Concussive Blast (HP AoE Wave)"],
        "battleSpell": "Flicker / Vengeance",
    },
    "Fighter": {
        "items": ["tough-boots", "war-axe", "hunter-strike", "dominance-ice", "oracle", "immortality"],
        "emblemId": "fighter-emblem",
        "talents": ["Thrill (+16 Adaptive Atk)", "Festival of Blood (+Spell Vamp)", "Brave Smite (5% Max HP Heal)"],
        "battleSpell": "Flicker / Petrify / Vengeance",
    },
    "Assassin": {
        "items": ["tough-boots", "blade-of-the-heptaseas", "sky-piercer", "malefic-roar", "blade-of-despair", "rose-gold-meteor"],
        "emblemId": "assassin-emblem",
        "talents": ["Rupture (+5 Adaptive Pen)", "Master Assassin (+7% Lone Target Dmg)", "Lethal Ignition"],
        "battleSpell": "Ice Retribution",
    },
    "Mage": {
        "items": ["arcane-boots", "lightning-truncheon", "genius-wand", "glowing-wand", "holy-crystal", "divine-glaive"],
        "emblemId": "mage-emblem",
        "talents": ["Rupture (+5 Adaptive Pen)", "Bargain Hunter (5% Item Discount)", "Lethal Ignition / Impure Rage"],
        "battleSpell": "Flicker / Flameshot / Purify",
    },
    "Marksman": {
        "items": ["swift-boots", "demon-hunter-sword", "golden-staff", "corrosion-scythe", "malefic-gun", "wind-of-nature"],
        "emblemId": "marksman-emblem",
        "talents": ["Swift (+10% Attack Speed)", "Weapon Master (+5% Bonus Atk)", "Quantum Charge"],
        "battleSpell": "Flicker / Inspire / Purify",
    },
    "Support": {
        "items": ["demon-shoes", "flask-of-the-oasis", "fleeting-time", "dominance-ice", "athenas-shield", "immortality"],
        "emblemId": "support-emblem",
        "talents": ["Agility (+4% Move Speed)", "Pull Yourself Together (-15% Spell CD)", "Focusing Mark (+6% Ally Dmg)"],
        "battleSpell": "Flicker / Revitalize / Purify",
    },
}

# Authentic MLBB Equipment Recipe Map (Tier 1 & Tier 2 -> Tier 3)
ITEM_RECIPES = {
    # Tier 1 Base Components
    "dagger": {"tier": 1, "from": []},
    "knife": {"tier": 1, "from": []},
    "javelin": {"tier": 1, "from": []},
    "vampire-mallet": {"tier": 1, "from": []},
    "iron-hunting-bow": {"tier": 1, "from": []},
    "vitality-crystal": {"tier": 1, "from": []},
    "leather-jerkin": {"tier": 1, "from": []},
    "magic-resist-cloak": {"tier": 1, "from": []},
    "healing-necklace": {"tier": 1, "from": []},
    "mystery-codex": {"tier": 1, "from": []},
    "power-crystal": {"tier": 1, "from": []},
    "magic-necklace": {"tier": 1, "from": []},
    "book-of-sages": {"tier": 1, "from": []},
    "mystic-container": {"tier": 1, "from": []},
    "boots": {"tier": 1, "from": []},
    # Tier 2 Intermediate Components
    "legion-sword": {"tier": 2, "from": ["dagger", "dagger"]},
    "fury-hammer": {"tier": 2, "from": ["dagger", "dagger"]},
    "ogre-tomahawk": {"tier": 2, "from": ["dagger", "vitality-crystal"]},
    "regular-spear": {"tier": 2, "from": ["dagger", "knife"]},
    "rogue-meteor": {"tier": 2, "from": ["knife", "javelin"]},
    "swift-crossbow": {"tier": 2, "from": ["knife", "knife"]},
    "magic-blade": {"tier": 2, "from": ["dagger", "magic-resist-cloak"]},
    "expert-gloves": {"tier": 2, "from": ["book-of-sages"]},
    "ares-belt": {"tier": 2, "from": ["vitality-crystal"]},
    "black-ice-shield": {"tier": 2, "from": ["leather-jerkin", "power-crystal"]},
    "dreadnaught-armor": {"tier": 2, "from": ["leather-jerkin", "leather-jerkin"]},
    "heros-ring": {"tier": 2, "from": ["vitality-crystal", "book-of-sages"]},
    "molten-essence": {"tier": 2, "from": ["vitality-crystal"]},
    "silence-robe": {"tier": 2, "from": ["vitality-crystal", "magic-resist-cloak"]},
    "steel-legplates": {"tier": 2, "from": ["leather-jerkin"]},
    "azure-blade": {"tier": 2, "from": ["mystery-codex", "magic-necklace"]},
    "elegant-gem": {"tier": 2, "from": ["vitality-crystal", "power-crystal"]},
    "exotic-veil": {"tier": 2, "from": ["mystery-codex"]},
    "magic-wand": {"tier": 2, "from": ["mystery-codex", "mystery-codex"]},
    "tome-of-evil": {"tier": 2, "from": ["mystery-codex", "magic-necklace", "book-of-sages"]},
    # Tier 2 Boots
    "tough-boots": {"tier": 2, "from": ["boots", "magic-resist-cloak"]},
    "warrior-boots": {"tier": 2, "from": ["boots", "leather-jerkin"]},
    "arcane-boots": {"tier": 2, "from": ["boots", "mystery-codex"]},
    "swift-boots": {"tier": 2, "from": ["boots", "knife"]},
    "magic-shoes": {"tier": 2, "from": ["boots", "book-of-sages"]},
    "demon-shoes": {"tier": 2, "from": ["boots", "magic-necklace"]},
    "rapid-boots": {"tier": 2, "from": ["boots"]},
    # Tier 3 Capstone Items
    "berserkers-fury": {"tier": 3, "from": ["legion-sword", "rogue-meteor"]},
    "blade-of-despair": {"tier": 3, "from": ["legion-sword", "legion-sword"]},
    "blade-of-the-heptaseas": {"tier": 3, "from": ["fury-hammer", "vitality-crystal"]},
    "corrosion-scythe": {"tier": 3, "from": ["regular-spear", "swift-crossbow"]},
    "demon-hunter-sword": {"tier": 3, "from": ["regular-spear", "vampire-mallet"]},
    "endless-battle": {"tier": 3, "from": ["vampire-mallet", "azure-blade", "ogre-tomahawk"]},
    "golden-staff": {"tier": 3, "from": ["regular-spear", "swift-crossbow"]},
    "great-dragon-spear": {"tier": 3, "from": ["legion-sword", "rogue-meteor"]},
    "haas-claws": {"tier": 3, "from": ["vampire-mallet", "rogue-meteor"]},
    "hunter-strike": {"tier": 3, "from": ["legion-sword", "fury-hammer", "iron-hunting-bow"]},
    "malefic-gun": {"tier": 3, "from": ["legion-sword", "regular-spear"]},
    "malefic-roar": {"tier": 3, "from": ["legion-sword", "fury-hammer"]},
    "rose-gold-meteor": {"tier": 3, "from": ["magic-blade", "vampire-mallet"]},
    "sea-halberd": {"tier": 3, "from": ["regular-spear", "dagger"]},
    "war-axe": {"tier": 3, "from": ["fury-hammer", "heros-ring"]},
    "wind-of-nature": {"tier": 3, "from": ["vampire-mallet", "regular-spear"]},
    "windtalker": {"tier": 3, "from": ["rogue-meteor", "swift-crossbow"]},
    "sky-piercer": {"tier": 3, "from": ["dagger", "exotic-veil"]},
    "winter-crown": {"tier": 3, "from": ["heros-ring", "magic-wand"]},
    "fleeting-time": {"tier": 3, "from": ["heros-ring", "expert-gloves"]},
    "antique-cuirass": {"tier": 3, "from": ["dreadnaught-armor", "ares-belt"]},
    "athenas-shield": {"tier": 3, "from": ["silence-robe", "magic-resist-cloak"]},
    "blade-armor": {"tier": 3, "from": ["steel-legplates", "leather-jerkin"]},
    "brute-force-breastplate": {"tier": 3, "from": ["heros-ring", "leather-jerkin"]},
    "chastise-pauldron": {"tier": 3, "from": ["black-ice-shield", "ares-belt"]},
    "cursed-helmet": {"tier": 3, "from": ["molten-essence", "silence-robe"]},
    "dominance-ice": {"tier": 3, "from": ["black-ice-shield", "steel-legplates"]},
    "guardian-helmet": {"tier": 3, "from": ["ares-belt", "vitality-crystal", "healing-necklace"]},
    "immortality": {"tier": 3, "from": ["ares-belt", "leather-jerkin"]},
    "oracle": {"tier": 3, "from": ["silence-robe", "heros-ring"]},
    "queens-wings": {"tier": 3, "from": ["ares-belt", "heros-ring"]},
    "radiant-armor": {"tier": 3, "from": ["silence-robe", "healing-necklace"]},
    "thunder-belt": {"tier": 3, "from": ["ares-belt", "leather-jerkin", "magic-resist-cloak"]},
    "blood-wings": {"tier": 3, "from": ["magic-wand", "exotic-veil"]},
    "clock-of-destiny": {"tier": 3, "from": ["elegant-gem", "magic-wand"]},
    "concentrated-energy": {"tier": 3, "from": ["magic-wand", "mystic-container"]},
    "divine-glaive": {"tier": 3, "from": ["magic-wand", "exotic-veil"]},
    "enchanted-talisman": {"tier": 3, "from": ["tome-of-evil", "book-of-sages"]},
    "feather-of-heaven": {"tier": 3, "from": ["swift-crossbow", "magic-wand", "book-of-sages"]},
    "flask-of-the-oasis": {"tier": 3, "from": ["tome-of-evil", "vitality-crystal"]},
    "genius-wand": {"tier": 3, "from": ["magic-wand", "exotic-veil"]},
    "glowing-wand": {"tier": 3, "from": ["magic-wand", "vitality-crystal"]},
    "holy-crystal": {"tier": 3, "from": ["magic-wand", "magic-wand"]},
    "ice-queen-wand": {"tier": 3, "from": ["magic-wand", "vitality-crystal"]},
    "lightning-truncheon": {"tier": 3, "from": ["magic-wand", "tome-of-evil"]},
    "starlium-scythe": {"tier": 3, "from": ["azure-blade", "tome-of-evil", "mystic-container"]},
    "wishing-lantern": {"tier": 3, "from": ["magic-wand", "tome-of-evil"]},
}


def normalize_lane(raw_lanes):
    lanes = []
    for item in raw_lanes:
        for part in item.split(","):
            p = part.strip().lower()
            if "gold" in p and "Gold" not in lanes:
                lanes.append("Gold")
            elif "exp" in p and "EXP" not in lanes:
                lanes.append("EXP")
            elif "mid" in p and "Mid" not in lanes:
                lanes.append("Mid")
            elif "jungle" in p and "Jungle" not in lanes:
                lanes.append("Jungle")
            elif "roam" in p and "Roam" not in lanes:
                lanes.append("Roam")
    return lanes or ["EXP"]


def normalize_roles(raw_class: str):
    roles = [r.strip().title() for r in (raw_class or "Fighter").split(",") if r.strip()]
    return roles or ["Fighter"]


def assign_lore_region(hero_name: str, lore_text: str, roles: list):
    text = f"{hero_name} {lore_text}".lower()
    if any(k in text for k in ["paxley", "aberleen", "gusion", "aamon", "valentina", "melissa"]):
        return ("House Paxley / Moniyan", "Castle Aberleen", "lore-paxley-curse")
    if any(k in text for k in ["cadia", "dragon", "onmyouji", "umbrella", "riverlands", "seimei", "shadow", "ninja", "zi long", "zilong", "yu zhong", "kagura", "hayabusa", "hanabi", "wanwan", "ling", "baxia", "yin", "luo yi"]):
        return ("Cadia Riverlands", "Cadia Riverlands", "lore-cadia-shadows")
    if any(k in text for k in ["eruditio", "lab 1718", "scientist", "cyborg", "android", "scholar", "layla", "beatrix", "angela", "diggie", "johnson", "alpha", "saber", "chou", "x.borg", "nolan", "ixia", "chip"]):
        return ("Eruditio / Lab 1718", "Eruditio", "lore-eruditio-nexus")
    if any(k in text for k in ["desert", "agelta", "sand", "khufra", "esmeralda", "khaleed", "claude", "clint", "mathilda", "minoan", "aldous", "minotaur"]):
        return ("Agelta Drylands", "Western Desert", "lore-agelta-sands")
    return ("Moniyan Empire & Land of Dawn", "Land of Dawn", "lore-moniyan-vanguard")


def main():
    print("Fetching existing rich hand-crafted heroes & items...")
    existing_heroes = {}
    if (DATA_DIR / "heroes.json").exists():
        for h in json.loads((DATA_DIR / "heroes.json").read_text(encoding="utf-8")):
            existing_heroes[h["id"]] = h

    existing_items = {}
    if (DATA_DIR / "items.json").exists():
        for it in json.loads((DATA_DIR / "items.json").read_text(encoding="utf-8")):
            existing_items[it["id"]] = it

    print("Downloading 133 MLBB Heroes from p3hndrx/MLBB-API...")
    raw_hero_payload = json.loads(urllib.request.urlopen(HERO_META_URL, timeout=15).read().decode("utf-8"))
    raw_heroes = [x for x in raw_hero_payload["data"] if x.get("hero_name") and x.get("hero_name") != "None"]

    mlid_to_slug = {}
    for rh in raw_heroes:
        slug = slugify(rh.get("uid") or rh["hero_name"])
        if rh.get("mlid"):
            mlid_to_slug[str(rh["mlid"])] = slug

    merged_heroes = []
    for rh in raw_heroes:
        name = rh["hero_name"]
        slug = slugify(rh.get("uid") or name)
        roles = normalize_roles(rh.get("class", "Fighter"))
        lanes = normalize_lane(rh.get("laning", []))
        primary_role = roles[0]
        theme_color, accent_color = ROLE_COLORS.get(primary_role, ("#E50914", "#f59e0b"))

        attrs = rh.get("attributes") or {}
        durability = int(attrs.get("durability") or 50)
        offense = int(attrs.get("offense") or 60)
        control_effect = int(attrs.get("control_effects") or 50)
        diff_100 = int(attrs.get("difficulty") or 50)
        difficulty = max(1, min(10, round(diff_100 / 10)))

        faction, hometown, lore_id = assign_lore_region(name, rh.get("lore", ""), roles)

        # Parse skills
        api_skills = []
        raw_skills = rh.get("skills") or []
        for idx, sk in enumerate(raw_skills):
            s_type = (sk.get("type") or "active").lower()
            if idx == 0 or s_type == "passive":
                slot = "Passive"
            elif idx == len(raw_skills) - 1 and idx >= 3:
                slot = "Ultimate"
            else:
                slot = f"Skill {idx}"

            cd = sk.get("cooldown")
            cd_str = "Passive" if not cd or cd == "null" else f"{cd}s"
            mc = sk.get("manacost")
            cost_str = "0 Mana" if not mc or mc == "null" else f"{mc} Mana/Energy"
            tags = sk.get("tags") or ["Spell"]

            api_skills.append({
                "slot": slot,
                "name": sk.get("skill_name") or f"{name} {slot}",
                "icon": sk.get("skill_icon") if str(sk.get("skill_icon", "")).startswith("http") else "",
                "type": " / ".join(tags),
                "cooldown": cd_str,
                "cost": cost_str,
                "scaling": "Adaptive Scaling",
                "description": (sk.get("description") or "").strip(),
                "notes": (rh.get("relations", {}).get("synergy", {}).get("description") or f"Key {slot.lower()} ability in {name}'s rotation.").strip(),
                "levels": []
            })

        # Parse relations
        rel_obj = rh.get("relations") or {}
        synergy_ids = [mlid_to_slug.get(str(hid)) for hid in (rel_obj.get("synergy", {}).get("heroids") or []) if mlid_to_slug.get(str(hid))]
        strong_ids = [mlid_to_slug.get(str(hid)) for hid in (rel_obj.get("strong_against", {}).get("heroids") or []) if mlid_to_slug.get(str(hid))]
        weak_ids = [mlid_to_slug.get(str(hid)) for hid in (rel_obj.get("weak_against", {}).get("heroids") or []) if mlid_to_slug.get(str(hid))]

        for s_item in (rh.get("synergies") or [])[:4]:
            s_slug = slugify(s_item.get("heroname", ""))
            if s_slug and s_slug not in synergy_ids:
                synergy_ids.append(s_slug)

        for c_item in (rh.get("counters") or [])[:4]:
            c_slug = slugify(c_item.get("heroname", ""))
            if c_slug and c_slug not in weak_ids:
                weak_ids.append(c_slug)

        role_build = ROLE_BUILDS.get(primary_role, ROLE_BUILDS["Fighter"]).copy()
        if "Jungle" in lanes and primary_role in ("Assassin", "Fighter"):
            role_build["battleSpell"] = "Ice Retribution"

        lore_one_liner = (rh.get("lore") or f"Legendary {primary_role} of the Land of Dawn.").strip()
        synergy_desc = (rel_obj.get("synergy", {}).get("description") or "").strip()
        strong_desc = (rel_obj.get("strong_against", {}).get("description") or "").strip()
        weak_desc = (rel_obj.get("weak_against", {}).get("description") or "").strip()

        full_bio = lore_one_liner
        if synergy_desc or strong_desc:
            full_bio += f"\n\nCombat Doctrine:\n{synergy_desc}\n\nMatchup Intelligence:\n{strong_desc} {weak_desc}".strip()

        # If we already had a super-detailed hand-crafted entry (15 heroes), merge the official portrait & skill icons into it!
        if slug in existing_heroes:
            rich = existing_heroes[slug]
            rich["portrait"] = rh.get("portrait") if str(rh.get("portrait", "")).startswith("http") else ""
            rich["mlid"] = rh.get("mlid", "")
            for idx, r_sk in enumerate(rich["skills"]):
                if idx < len(api_skills) and api_skills[idx]["icon"]:
                    r_sk["icon"] = api_skills[idx]["icon"]
            merged_heroes.append(rich)
            continue

        hero_entry = {
            "id": slug,
            "mlid": rh.get("mlid", ""),
            "name": name,
            "title": lore_one_liner[:52] + ("..." if len(lore_one_liner) > 52 else ""),
            "portrait": rh.get("portrait") if str(rh.get("portrait", "")).startswith("http") else "",
            "roles": roles,
            "lanes": lanes,
            "specialties": rh.get("speciality") or ["Damage", primary_role],
            "difficulty": difficulty,
            "attackType": "Ranged / Magic" if primary_role in ("Mage", "Support") else ("Ranged / Physical" if primary_role == "Marksman" else "Melee / Physical"),
            "resource": "Mana / Energy",
            "releaseYear": int(rh["release_year"]) if str(rh.get("release_year", "")).isdigit() else 2019,
            "bpCost": "32000 BP / 599 Diamonds",
            "faction": faction,
            "hometown": hometown,
            "themeColor": theme_color,
            "accentColor": accent_color,
            "featuredBanner": slug in ("tigreal", "fanny", "gusion", "yu-zhong", "miya", "alucard", "yin", "lukas"),
            "summary": lore_one_liner,
            "baseStats": {
                "durability": durability,
                "offense": offense,
                "controlEffect": control_effect,
                "difficulty": diff_100,
                "hp": 2450 + durability * 4,
                "hpRegen": "38 / 5s",
                "mana": 440,
                "manaRegen": "15 / 5s",
                "physicalAttack": 110 + offense // 4,
                "physicalDefense": 16 + durability // 10,
                "magicDefense": 15,
                "movementSpeed": 250 if primary_role in ("Tank", "Fighter", "Assassin") else 240,
                "attackSpeed": "0.86"
            },
            "skills": api_skills,
            "story": {
                "biography": full_bio,
                "personality": f"Renowned { '/'.join(roles) } specializing in { ', '.join(rh.get('speciality') or ['combat']) } across the { '/'.join(lanes) } lane.",
                "quotes": [
                    lore_one_liner,
                    f"Victory belongs to the fearless on the {lanes[0]} Lane."
                ],
                "loreId": lore_id
            },
            "build": {
                "items": role_build["items"],
                "emblemId": role_build["emblemId"],
                "talents": role_build["talents"],
                "battleSpell": role_build["battleSpell"],
                "tips": f"{strong_desc or 'Look for openings after enemy crowd control spells are on cooldown.'} {synergy_desc}".strip()
            },
            "relations": {
                "synergies": synergy_ids[:6],
                "bestWith": synergy_ids[:4],
                "counters": strong_ids[:6],
                "weakAgainst": weak_ids[:6],
                "loreLinks": []
            }
        }
        merged_heroes.append(hero_entry)

    print(f"Total Heroes prepared: {len(merged_heroes)}")

    # Now process all 89 Items from item-meta-final.json + Jungle/Roam blessings
    print("Downloading 89 MLBB Items from p3hndrx/MLBB-API...")
    raw_item_payload = json.loads(urllib.request.urlopen(ITEM_META_URL, timeout=15).read().decode("utf-8"))
    raw_items = [x for x in raw_item_payload["data"] if x.get("item_name") and x.get("item_name") != "None"]

    CAT_COLORS = {
        "Attack": "#ef4444",
        "Magic": "#a855f7",
        "Defense": "#22c55e",
        "Movement": "#38bdf8",
        "Jungling": "#06b6d4",
        "Roaming": "#f59e0b",
    }

    items_by_id = {}
    for ri in raw_items:
        iname = ri["item_name"].replace("Haas' Claws", "Haas's Claws")
        islug = slugify(iname)
        raw_cat = ri.get("item_category", "Attack")
        if "Magic" in raw_cat and "Attack" not in raw_cat:
            cat = "Magic"
        elif "Defense" in raw_cat and "Attack" not in raw_cat:
            cat = "Defense"
        elif "Movement" in raw_cat:
            cat = "Movement"
        else:
            cat = "Attack"

        d0 = (ri.get("data") or [{}])[0]
        cost_str = str(d0.get("cost") or "1000")
        price = int(cost_str) if cost_str.isdigit() else 1950

        # Parse stats modifiers
        stats_list = []
        for mod_dict in (d0.get("modifiers") or []):
            for k, v in mod_dict.items():
                label = k.replace("_", " ").title()
                val_s = str(v)
                if not val_s.startswith("+") and not val_s.startswith("-"):
                    val_s = f"+{val_s}"
                stats_list.append(f"{val_s} {label}")

        # Parse passives / actives
        passives = []
        for up in (d0.get("unique_passive") or []):
            up_name = up.get("unique_passive_name")
            up_desc = up.get("description")
            if up_name and up_name != "null" and up_desc and up_desc != "null":
                passives.append(f"Unique Passive — {up_name}: {up_desc}")
        for p in (d0.get("passive") or []):
            p_name = p.get("passive_name")
            p_desc = p.get("description")
            if p_name and p_name != "null" and p_desc and p_desc != "null":
                passives.append(f"Passive — {p_name}: {p_desc}")

        actives = []
        for ac in (d0.get("active") or []):
            ac_name = ac.get("active_name")
            ac_desc = ac.get("description")
            if ac_name and ac_name != "null" and ac_desc and ac_desc != "null":
                actives.append(f"Unique Active — {ac_name}: {ac_desc}")

        recipe_info = ITEM_RECIPES.get(islug, {"tier": 3 if price >= 1500 else (2 if price >= 500 else 1), "from": []})
        tier = recipe_info["tier"]
        builds_from = recipe_info["from"]

        existing_it = existing_items.get(islug, {})

        items_by_id[islug] = {
            "id": islug,
            "name": iname,
            "category": existing_it.get("category", cat),
            "tier": tier,
            "price": price,
            "color": existing_it.get("color", CAT_COLORS.get(cat, "#E50914")),
            "stats": stats_list or existing_it.get("stats") or [f"+{cat} Attribute"],
            "passive": " | ".join(passives) if passives else existing_it.get("passive"),
            "active": " | ".join(actives) if actives else existing_it.get("active"),
            "cooldown": existing_it.get("cooldown", "Active / Passive"),
            "description": existing_it.get("description", f"Official Tier-{tier} {cat} equipment used across the Land of Dawn ({d0.get('summary', cat)} specialization)."),
            "tips": existing_it.get("tips", f"Provides {', '.join(stats_list[:2]) if stats_list else cat} efficiency for {cat} builds."),
            "whenToBuild": existing_it.get("whenToBuild", f"{'Late-game core slot' if tier == 3 else ('Mid-game bridge component' if tier == 2 else 'Early laning component')}."),
            "buildsFrom": builds_from,
            "buildsInto": [],
            "recommendedHeroes": existing_it.get("recommendedHeroes", ["tigreal", "fanny", "gusion", "miya", "claude"][:3])
        }

    # Include Jungling & Roaming blessings from existing_items
    for k, v in existing_items.items():
        if k not in items_by_id:
            items_by_id[k] = v
            items_by_id[k]["buildsInto"] = []

    # Populate reverse buildsInto links from buildsFrom
    for islug, item_obj in items_by_id.items():
        item_obj["buildsFrom"] = [c for c in item_obj["buildsFrom"] if c in items_by_id]
        for parent_comp in set(item_obj["buildsFrom"]):
            if islug not in items_by_id[parent_comp]["buildsInto"]:
                items_by_id[parent_comp]["buildsInto"].append(islug)

    # Map recommendedHeroes dynamically based on role builds
    for h in merged_heroes:
        for b_item in h["build"]["items"]:
            if b_item in items_by_id:
                rec_list = items_by_id[b_item]["recommendedHeroes"]
                if h["id"] not in rec_list and len(rec_list) < 12:
                    rec_list.append(h["id"])

    final_items = sorted(items_by_id.values(), key=lambda x: (x["category"], -x["tier"], -x["price"]))
    print(f"Total Items prepared: {len(final_items)}")

    # Update lore.json relatedHeroes so every faction has a rich roster of heroes
    lore_list = json.loads((DATA_DIR / "lore.json").read_text(encoding="utf-8"))
    for l_entry in lore_list:
        lid = l_entry["id"]
        matching_h = [h["id"] for h in merged_heroes if h["story"].get("loreId") == lid]
        for mh in matching_h:
            if mh not in l_entry["relatedHeroes"] and len(l_entry["relatedHeroes"]) < 18:
                l_entry["relatedHeroes"].append(mh)

    (DATA_DIR / "heroes.json").write_text(json.dumps(merged_heroes, indent=2, ensure_ascii=False), encoding="utf-8")
    (DATA_DIR / "items.json").write_text(json.dumps(final_items, indent=2, ensure_ascii=False), encoding="utf-8")
    (DATA_DIR / "lore.json").write_text(json.dumps(lore_list, indent=2, ensure_ascii=False), encoding="utf-8")
    print("Successfully wrote data/heroes.json, data/items.json, and data/lore.json!")


if __name__ == "__main__":
    main()
