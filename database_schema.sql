-- Parfümerie Datenbank Schema

-- Tabelle für Kunden
CREATE TABLE customers (
    customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50),
    street VARCHAR(255),
    postal_code VARCHAR(20),
    city VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabelle für Grunddüfte
CREATE TABLE fragrances (
    fragrance_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    code INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Code ist keine eindeutige ID, da die Zahl mehrfach vorkommen kann
    UNIQUE (name)
);

-- Tabelle für Zusammenstellungen (Parfum-Kompositionen)
CREATE TABLE compositions (
    composition_id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    name VARCHAR(100),
    total_amount DECIMAL(10, 2) NOT NULL, -- Gesamtmenge in ml
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE
);

-- Tabelle für die Bestandteile einer Zusammenstellung (Verbindungstabelle)
CREATE TABLE composition_details (
    detail_id INTEGER PRIMARY KEY AUTOINCREMENT,
    composition_id INTEGER NOT NULL,
    fragrance_id INTEGER NOT NULL,
    amount DECIMAL(10, 2) NOT NULL, -- Menge in ml
    FOREIGN KEY (composition_id) REFERENCES compositions(composition_id) ON DELETE CASCADE,
    FOREIGN KEY (fragrance_id) REFERENCES fragrances(fragrance_id) ON DELETE RESTRICT
);

-- Indizes für bessere Abfrageleistung
CREATE INDEX idx_compositions_customer_id ON compositions(customer_id);
CREATE INDEX idx_composition_details_composition_id ON composition_details(composition_id);
CREATE INDEX idx_composition_details_fragrance_id ON composition_details(fragrance_id);
