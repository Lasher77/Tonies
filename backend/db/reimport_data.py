#!/usr/bin/env python3
"""
Skript zum Leeren der Datenbank und Neuimport der Daten
"""

import sqlite3
import pandas as pd
import os
import sys
from pathlib import Path

def main():
    # Pfad zur Datenbank
    db_path = input("Bitte geben Sie den vollständigen Pfad zur parfumerie.db-Datei ein: ")
    
    if not os.path.exists(db_path):
        print(f"Fehler: Die Datei {db_path} existiert nicht.")
        sys.exit(1)
    
    # Pfad zu den Excel-Dateien
    excel_dir = input("Bitte geben Sie den Pfad zum Verzeichnis mit den Excel-Dateien ein: ")
    
    # Überprüfen, ob die Excel-Dateien existieren
    kunden_path = find_file(excel_dir, ["Kunden.xlsx", "kunden.xlsx"])
    dufte_path = find_file(excel_dir, ["Düfte.xlsx", "dufte.xlsx", "Dufte.xlsx"])
    zusammenstellungen_path = find_file(excel_dir, ["Zusammenstellungen.xlsx", "zusammenstellungen.xlsx"])
    
    if not kunden_path:
        print("Fehler: Kunden.xlsx nicht gefunden.")
        sys.exit(1)
    if not dufte_path:
        print("Fehler: Düfte.xlsx nicht gefunden.")
        sys.exit(1)
    if not zusammenstellungen_path:
        print("Fehler: Zusammenstellungen.xlsx nicht gefunden.")
        sys.exit(1)
    
    # Backup erstellen
    backup_path = f"{db_path}.backup"
    print(f"Erstelle Backup der Datenbank unter {backup_path}...")
    
    with open(db_path, 'rb') as src, open(backup_path, 'wb') as dst:
        dst.write(src.read())
    
    print("Backup erstellt.")
    
    # Verbindung zur Datenbank herstellen
    print("Verbinde mit der Datenbank...")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Tabellen leeren
    print("Leere Tabellen...")
    cursor.execute("DELETE FROM composition_details")
    cursor.execute("DELETE FROM compositions")
    cursor.execute("DELETE FROM fragrances")
    cursor.execute("DELETE FROM customers")
    
    # Zurücksetzen der Autoincrement-Werte
    cursor.execute("DELETE FROM sqlite_sequence WHERE name IN ('customers', 'fragrances', 'compositions', 'composition_details')")
    
    # Daten importieren
    print("Importiere Düfte...")
    import_fragrances(cursor, dufte_path)
    
    print("Importiere Kunden...")
    import_customers(cursor, kunden_path)
    
    print("Importiere Zusammenstellungen...")
    import_compositions(cursor, zusammenstellungen_path)
    
    # Commit der Änderungen
    conn.commit()
    
    # Verbindung schließen
    conn.close()
    
    print("Import abgeschlossen. Die Datenbank wurde aktualisiert.")
    print(f"Ein Backup der ursprünglichen Datenbank wurde unter {backup_path} gespeichert.")

def find_file(directory, possible_names):
    """Sucht nach einer Datei mit einem der möglichen Namen im angegebenen Verzeichnis."""
    for name in possible_names:
        path = os.path.join(directory, name)
        if os.path.exists(path):
            return path
    return None

def import_fragrances(cursor, file_path):
    """Importiert Düfte aus der Excel-Datei."""
    try:
        df = pd.read_excel(file_path)
        
        # Annahme: Die erste Spalte enthält den Namen, die zweite den Code
        for _, row in df.iterrows():
            name = str(row.iloc[0]) if not pd.isna(row.iloc[0]) else ""
            code = str(row.iloc[1]) if not pd.isna(row.iloc[1]) else ""
            description = ""
            
            cursor.execute(
                "INSERT INTO fragrances (name, code, description) VALUES (?, ?, ?)",
                (name, code, description)
            )
        
        print(f"{len(df)} Düfte importiert.")
    except Exception as e:
        print(f"Fehler beim Importieren der Düfte: {e}")
        sys.exit(1)

def import_customers(cursor, file_path):
    """Importiert Kunden aus der Excel-Datei."""
    try:
        df = pd.read_excel(file_path)
        
        # Spalten identifizieren
        columns = {col.lower(): col for col in df.columns}
        
        # Mapping für Kundendaten
        field_mapping = {
            'first_name': find_column(columns, ['vorname', 'first_name']),
            'last_name': find_column(columns, ['name', 'nachname', 'last_name']),
            'email': find_column(columns, ['email', 'e-mail', 'mail']),
            'phone': find_column(columns, ['telefon', 'phone', 'tel']),
            'street': find_column(columns, ['straße', 'strasse', 'street']),
            'postal_code': find_column(columns, ['plz', 'postal_code', 'zip']),
            'city': find_column(columns, ['stadt', 'city', 'ort'])
        }
        
        for _, row in df.iterrows():
            # Extrahiere Daten mit dem Mapping
            customer_data = {}
            for field, column in field_mapping.items():
                if column and column in df.columns:
                    customer_data[field] = str(row[column]) if not pd.isna(row[column]) else ""
                else:
                    customer_data[field] = ""
            
            cursor.execute(
                """
                INSERT INTO customers 
                (first_name, last_name, email, phone, street, postal_code, city) 
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    customer_data['first_name'],
                    customer_data['last_name'],
                    customer_data['email'],
                    customer_data['phone'],
                    customer_data['street'],
                    customer_data['postal_code'],
                    customer_data['city']
                )
            )
        
        print(f"{len(df)} Kunden importiert.")
    except Exception as e:
        print(f"Fehler beim Importieren der Kunden: {e}")
        sys.exit(1)

def import_compositions(cursor, file_path):
    """Importiert Zusammenstellungen aus der Excel-Datei."""
    try:
        df = pd.read_excel(file_path)
        
        # Identifiziere die Spalten
        # Annahme: Erste Spalte ist Kunden-ID, dann folgen Duft-IDs und Mengen
        
        # Hole alle Kunden-IDs
        cursor.execute("SELECT customer_id FROM customers")
        customer_ids = [row[0] for row in cursor.fetchall()]
        
        # Hole alle Duft-IDs und Codes
        cursor.execute("SELECT fragrance_id, code, name FROM fragrances")
        fragrances = cursor.fetchall()
        fragrance_by_code = {row[1]: row[0] for row in fragrances if row[1]}
        fragrance_by_name = {row[2]: row[0] for row in fragrances if row[2]}
        
        # Für jede Zeile in der Excel-Datei
        for _, row in df.iterrows():
            # Kunden-ID (erste Spalte)
            customer_id = int(row.iloc[0]) if not pd.isna(row.iloc[0]) else None
            
            if customer_id not in customer_ids:
                print(f"Warnung: Kunde mit ID {customer_id} nicht gefunden, überspringe Zusammenstellung.")
                continue
            
            # Erstelle eine neue Zusammenstellung
            cursor.execute(
                "INSERT INTO compositions (customer_id, name, total_amount) VALUES (?, ?, ?)",
                (customer_id, "", 0)  # Name leer, Gesamtmenge wird später aktualisiert
            )
            composition_id = cursor.lastrowid
            
            # Gesamtmenge für diese Zusammenstellung
            total_amount = 0
            
            # Verarbeite die Duft-Spalten (ab der zweiten Spalte)
            for i in range(1, len(row), 2):
                if i + 1 >= len(row):
                    break  # Keine Menge für diesen Duft
                
                fragrance_code_or_name = str(row.iloc[i]) if not pd.isna(row.iloc[i]) else None
                amount = float(row.iloc[i+1]) if not pd.isna(row.iloc[i+1]) else 0
                
                if not fragrance_code_or_name or amount <= 0:
                    continue  # Kein Duft oder keine Menge
                
                # Finde die Duft-ID basierend auf Code oder Name
                fragrance_id = None
                if fragrance_code_or_name in fragrance_by_code:
                    fragrance_id = fragrance_by_code[fragrance_code_or_name]
                elif fragrance_code_or_name in fragrance_by_name:
                    fragrance_id = fragrance_by_name[fragrance_code_or_name]
                else:
                    # Versuche, den Duft anhand des Codes zu finden (falls es eine Zahl ist)
                    try:
                        code = int(fragrance_code_or_name)
                        for fid, fcode, _ in fragrances:
                            if fcode and int(fcode) == code:
                                fragrance_id = fid
                                break
                    except (ValueError, TypeError):
                        pass
                
                if not fragrance_id:
                    print(f"Warnung: Duft '{fragrance_code_or_name}' nicht gefunden, überspringe.")
                    continue
                
                # Füge den Duft zur Zusammenstellung hinzu
                cursor.execute(
                    "INSERT INTO composition_details (composition_id, fragrance_id, amount) VALUES (?, ?, ?)",
                    (composition_id, fragrance_id, amount)
                )
                
                total_amount += amount
            
            # Aktualisiere die Gesamtmenge
            cursor.execute(
                "UPDATE compositions SET total_amount = ? WHERE composition_id = ?",
                (total_amount, composition_id)
            )
        
        print(f"{len(df)} Zusammenstellungen importiert.")
    except Exception as e:
        print(f"Fehler beim Importieren der Zusammenstellungen: {e}")
        sys.exit(1)

def find_column(columns, possible_names):
    """Findet eine Spalte basierend auf möglichen Namen."""
    for name in possible_names:
        if name.lower() in columns:
            return columns[name.lower()]
    return None

if __name__ == "__main__":
    main()
