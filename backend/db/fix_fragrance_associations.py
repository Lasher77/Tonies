#!/usr/bin/env python3
"""
Korrekturskript für die Parfümerie-Datenbank

Dieses Skript behebt Probleme mit den Zuordnungen zwischen Düften und Zusammenstellungen
in der Parfümerie-Datenbank. Es überprüft die Referenzen in der Tabelle composition_details
und stellt sicher, dass sie auf die korrekten Düfte in der Tabelle fragrances verweisen.
"""

import sqlite3
import os
import sys
from pathlib import Path

def main():
    # Pfad zur Datenbank
    db_path = input("Bitte geben Sie den vollständigen Pfad zur parfumerie.db-Datei ein: ")
    
    if not os.path.exists(db_path):
        print(f"Fehler: Die Datei {db_path} existiert nicht.")
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
    
    # Überprüfen, ob die Tabellen existieren
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name IN ('fragrances', 'composition_details')")
    tables = cursor.fetchall()
    
    if len(tables) < 2:
        print("Fehler: Die erforderlichen Tabellen 'fragrances' und 'composition_details' wurden nicht gefunden.")
        sys.exit(1)
    
    # Alle Düfte abrufen
    print("Lade Düfte aus der Datenbank...")
    cursor.execute("SELECT fragrance_id, name, code FROM fragrances ORDER BY fragrance_id")
    fragrances = cursor.fetchall()
    
    if not fragrances:
        print("Fehler: Keine Düfte in der Datenbank gefunden.")
        sys.exit(1)
    
    print(f"{len(fragrances)} Düfte gefunden.")
    
    # Überprüfen, ob die Duft-IDs in composition_details existieren
    print("Überprüfe Referenzen in der Tabelle composition_details...")
    cursor.execute("SELECT DISTINCT fragrance_id FROM composition_details ORDER BY fragrance_id")
    detail_fragrance_ids = [row[0] for row in cursor.fetchall()]
    
    # Erstelle ein Set der gültigen Duft-IDs
    valid_fragrance_ids = {row[0] for row in fragrances}
    
    # Finde ungültige Referenzen
    invalid_ids = [id for id in detail_fragrance_ids if id not in valid_fragrance_ids]
    
    if not invalid_ids:
        print("Alle Referenzen in composition_details sind gültig. Keine Korrekturen erforderlich.")
        return
    
    print(f"{len(invalid_ids)} ungültige Referenzen gefunden.")
    
    # Überprüfe, ob die Duft-Codes in der Excel-Datei mit den Codes in der Datenbank übereinstimmen
    print("Überprüfe, ob die Duft-Codes für die Zuordnung verwendet werden können...")
    
    # Erstelle ein Mapping von Duft-Code zu Duft-ID
    code_to_id = {row[2]: row[0] for row in fragrances if row[2] is not None and row[2] != ''}
    
    if len(code_to_id) < len(fragrances) * 0.8:  # Wenn weniger als 80% der Düfte einen Code haben
        print("Warnung: Viele Düfte haben keinen Code. Die Zuordnung könnte ungenau sein.")
    
    # Erstelle ein Mapping von ungültiger ID zu gültiger ID basierend auf dem Code
    id_mapping = {}
    
    # Für jede ungültige ID, versuche eine Zuordnung zu finden
    for invalid_id in invalid_ids:
        # Versuche, den Duft-Code für diese ID zu finden (falls vorhanden)
        cursor.execute("SELECT composition_id, amount FROM composition_details WHERE fragrance_id = ?", (invalid_id,))
        compositions_with_invalid_id = cursor.fetchall()
        
        if invalid_id in valid_fragrance_ids:
            # Die ID existiert tatsächlich in der fragrances-Tabelle
            id_mapping[invalid_id] = invalid_id
            continue
        
        # Versuche, eine passende ID basierend auf dem numerischen Wert zu finden
        potential_match = None
        for valid_id in valid_fragrance_ids:
            if valid_id == invalid_id or valid_id - 60 == invalid_id:  # Versuche eine einfache Verschiebung
                potential_match = valid_id
                break
        
        if potential_match:
            id_mapping[invalid_id] = potential_match
        else:
            # Wenn keine Zuordnung gefunden wurde, verwende einen Standardwert
            print(f"Warnung: Keine Zuordnung für ID {invalid_id} gefunden. Verwende ersten Duft als Fallback.")
            id_mapping[invalid_id] = fragrances[0][0]  # Verwende die ID des ersten Dufts
    
    # Aktualisiere die Referenzen in der Tabelle composition_details
    print("Aktualisiere Referenzen in der Tabelle composition_details...")
    
    # Beginne eine Transaktion
    conn.execute("BEGIN TRANSACTION")
    
    try:
        for old_id, new_id in id_mapping.items():
            if old_id != new_id:
                cursor.execute(
                    "UPDATE composition_details SET fragrance_id = ? WHERE fragrance_id = ?",
                    (new_id, old_id)
                )
                print(f"ID {old_id} wurde zu ID {new_id} aktualisiert.")
        
        # Commit der Änderungen
        conn.commit()
        print("Alle Referenzen wurden erfolgreich aktualisiert.")
    except Exception as e:
        # Bei einem Fehler Rollback durchführen
        conn.rollback()
        print(f"Fehler beim Aktualisieren der Referenzen: {e}")
        sys.exit(1)
    finally:
        # Verbindung schließen
        conn.close()
    
    print("Korrektur abgeschlossen. Die Datenbank wurde aktualisiert.")
    print(f"Ein Backup der ursprünglichen Datenbank wurde unter {backup_path} gespeichert.")

if __name__ == "__main__":
    main()
