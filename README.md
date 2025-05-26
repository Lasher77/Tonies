# Parfümerie-Anwendung: Installationsanleitung

Diese Anwendung wurde als moderne Alternative zu einer FileMaker-Datenbank entwickelt. Sie verwendet eine SQLite-Datenbank im Backend und React im Frontend.

## Systemvoraussetzungen

- Node.js (Version 14 oder höher)
- npm (wird mit Node.js installiert)
- Python 3.6 oder höher (für den Datenimport)
- pandas und openpyxl Python-Pakete (für den Datenimport)

## Installation

### 1. Backend einrichten

1. Navigieren Sie zum Backend-Verzeichnis:
   ```
   cd backend
   ```

2. Installieren Sie die Abhängigkeiten:
   ```
   npm install
   ```

3. Initialisieren Sie die Datenbank:
   ```
   node initDb.js
   ```

4. Starten Sie den Server:
   ```
   node server.js
   ```
   Der Server läuft dann auf Port 5000.

### 2. Frontend einrichten

1. Öffnen Sie ein neues Terminal-Fenster und navigieren Sie zum Frontend-Verzeichnis:
   ```
   cd frontend
   ```

2. Installieren Sie die Abhängigkeiten:
   ```
   npm install --force
   ```
   (Der `--force` Parameter kann notwendig sein, um Kompatibilitätsprobleme zu umgehen)

3. Starten Sie die Entwicklungsumgebung:
   ```
   npm start
   ```
   Die Anwendung wird dann im Browser unter http://localhost:3000 geöffnet.

## Datenimport

Wenn Sie Ihre bestehenden Daten importieren möchten:

1. Stellen Sie sicher, dass Python sowie die Pakete **pandas** und **openpyxl** installiert sind:
   ```
   pip install pandas openpyxl
   ```

2. Wechseln Sie in das Verzeichnis `backend/db` und starten Sie das Skript `reimport_data.py`. 
   Es fordert Sie auf, den Pfad zur Datenbank und zum Ordner mit den Excel-Dateien 
   (`Kunden.xlsx`, `Düfte.xlsx`, `Zusammenstellungen.xlsx`) anzugeben:
   ```
   cd backend/db
   python reimport_data.py
   ```

3. Optional können Sie anschließend das Korrekturskript ausführen, um eventuelle 
   fehlerhafte Duftzuordnungen zu bereinigen:
   ```
   python fix_fragrance_associations.py
   ```

## Anwendungsstruktur

### Backend

- **server.js**: Hauptdatei des Servers
- **database.js**: Datenbankverbindung
- **initDb.js**: Skript zur Initialisierung der Datenbank
- **models/**: Enthält die Datenmodelle
- **routes/**: Enthält die API-Routen

### Frontend

- **src/components/**: Wiederverwendbare UI-Komponenten
- **src/pages/**: Hauptseiten der Anwendung
- **src/api/**: API-Funktionen für die Kommunikation mit dem Backend

## Funktionen

Die Anwendung bietet folgende Hauptfunktionen:

1. **Kundenverwaltung**:
   - Kundensuche und -übersicht
   - Detailansicht mit Zusammenstellungshistorie
   - Formular zur Neuanlage und Bearbeitung von Kunden

2. **Grunddüfte-Verwaltung**:
   - Übersicht aller Grunddüfte
   - Formular zur Neuanlage und Bearbeitung von Düften

3. **Zusammenstellungen**:
   - Erstellung neuer Duftkreationen für Kunden
   - Anzeige bestehender Kreationen in der Kundendetailansicht

## Fehlerbehebung

- **Backend startet nicht**: Überprüfen Sie, ob Port 5000 bereits verwendet wird
- **Frontend zeigt keine Daten an**: Stellen Sie sicher, dass das Backend läuft
- **Datenimport schlägt fehl**: Überprüfen Sie das Format Ihrer Excel-Dateien

Bei weiteren Fragen oder Problemen stehe ich Ihnen gerne zur Verfügung.
