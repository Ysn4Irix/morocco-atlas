import json
import sqlite3
import os

def build_database():
    json_path = os.path.join("shared", "data", "morocco-dataset.json")
    db_path = os.path.join("shared", "data", "moroccodb.db")

    if os.path.exists(db_path):
        os.remove(db_path)

    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Regions table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS regions (
            code TEXT PRIMARY KEY NOT NULL,
            hcp_code TEXT NOT NULL,
            name_ar TEXT NOT NULL,
            name_fr TEXT NOT NULL,
            name_en TEXT
        )
    """)

    # Provinces table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS provinces (
            code TEXT PRIMARY KEY NOT NULL,
            hcp_code TEXT NOT NULL,
            administrative_type TEXT NOT NULL,
            name_ar TEXT NOT NULL,
            name_fr TEXT NOT NULL,
            name_en TEXT,
            region_code TEXT NOT NULL
        )
    """)

    # Communes table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS communes (
            code TEXT PRIMARY KEY NOT NULL,
            hcp_code TEXT NOT NULL,
            name_ar TEXT NOT NULL,
            name_fr TEXT NOT NULL,
            name_en TEXT,
            cercle_hcp_code TEXT,
            province_code TEXT NOT NULL,
            region_code TEXT NOT NULL
        )
    """)

    # Arrondissements table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS arrondissements (
            code TEXT PRIMARY KEY NOT NULL,
            hcp_code TEXT NOT NULL,
            name_ar TEXT NOT NULL,
            name_fr TEXT NOT NULL,
            name_en TEXT,
            commune_code TEXT NOT NULL,
            prefecture_of_arrondissements_code TEXT,
            province_code TEXT NOT NULL,
            region_code TEXT NOT NULL
        )
    """)

    # Metadata table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS metadata (
            key TEXT PRIMARY KEY NOT NULL,
            value TEXT NOT NULL
        )
    """)

    # Insert metadata
    meta = data.get("metadata", {})
    for k, v in meta.items():
        cursor.execute("INSERT INTO metadata (key, value) VALUES (?, ?)", (str(k), str(v)))

    # Insert regions
    for r in data.get("regions", []):
        cursor.execute(
            "INSERT INTO regions (code, hcp_code, name_ar, name_fr, name_en) VALUES (?, ?, ?, ?, ?)",
            (r["code"], r["hcp_code"], r["name"]["ar"], r["name"]["fr"], r["name"].get("en"))
        )

    # Insert provinces
    for p in data.get("provinces", []):
        cursor.execute(
            "INSERT INTO provinces (code, hcp_code, administrative_type, name_ar, name_fr, name_en, region_code) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (p["code"], p["hcp_code"], p["administrative_type"], p["name"]["ar"], p["name"]["fr"], p["name"].get("en"), p["region_code"])
        )

    # Insert communes
    for c in data.get("communes", []):
        cursor.execute(
            "INSERT INTO communes (code, hcp_code, name_ar, name_fr, name_en, cercle_hcp_code, province_code, region_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            (c["code"], c["hcp_code"], c["name"]["ar"], c["name"]["fr"], c["name"].get("en"), c.get("cercle_hcp_code"), c["province_code"], c["region_code"])
        )

    # Insert arrondissements
    for a in data.get("arrondissements", []):
        cursor.execute(
            "INSERT INTO arrondissements (code, hcp_code, name_ar, name_fr, name_en, commune_code, prefecture_of_arrondissements_code, province_code, region_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (a["code"], a["hcp_code"], a["name"]["ar"], a["name"]["fr"], a["name"].get("en"), a.get("commune_code"), a.get("prefecture_of_arrondissements_code"), a["province_code"], a["region_code"])
        )

    conn.commit()

    # Create search indices
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_provinces_region ON provinces(region_code)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_communes_province ON communes(province_code)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_communes_region ON communes(region_code)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_arrondissements_commune ON arrondissements(commune_code)")

    conn.commit()

    # Verify counts
    reg_count = cursor.execute("SELECT count(*) FROM regions").fetchone()[0]
    prov_count = cursor.execute("SELECT count(*) FROM provinces").fetchone()[0]
    comm_count = cursor.execute("SELECT count(*) FROM communes").fetchone()[0]
    arr_count = cursor.execute("SELECT count(*) FROM arrondissements").fetchone()[0]

    print(f"Generated SQLite Database: {db_path}")
    print(f"Counts: regions={reg_count}, provinces={prov_count}, communes={comm_count}, arrondissements={arr_count}")

    conn.close()

if __name__ == "__main__":
    build_database()
