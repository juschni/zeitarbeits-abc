# P0 · Testfälle und Freigabekriterien

Stand: 2026-11-12

## Verifizierte Tarifquelle
DGB Original: https://www.dgb.de/fileadmin/download_center/Uploads/2025-09-12_Entgelttarifvertrag_DGB-GVP_ab_01012026.pdf
Entgeltrahmen: https://www.dgb.de/fileadmin/download_center/Uploads/2025-05-20_Entgeltrahmentarifvertrag.pdf
GVP Kontrollquelle: https://personaldienstleister.de/personaldienstleistungen/zeitarbeit/tarif/entgelttabellen/

Grundentgelte 01.09.2026–31.03.2027: EG1 15,33; 2a 15,67; 2b 16,08; 3 17,11; 4 18,09; 5 20,27; 6 22,52; 7 26,20; 8 28,04; 9 29,42 EUR/h. **Abgleich abgeschlossen**.

## Testmatrix (nicht als bestanden behaupten)

| ID | Eingabe | Erwartung | Status |
|---|---|---|---|
| T01 | DGB/GVP, EG2b, Vertragslohn 16,08 | Kein Grundlohn-Unterschreiten, keine Gesamtfreigabe | Offen: Browser-Autotest |
| T02 | DGB/GVP, EG2b, Vertragslohn 15,50 | Differenz 0,58 EUR/h | Offen: Browser-Autotest |
| T03 | Vertrag 16,08, Abrechnung 15,80 | Differenz 0,28 EUR/h | Offen: Browser-Autotest |
| T04 | Unbekannter Tarif | Keine DGB/GVP-Anspruchsbehauptung | Offen: Browser-Autotest |
| T05 | Unbekannte EG und leerer Lohn | Konkrete fehlende Angaben | Offen: Browser-Autotest |
| T06 | Vertrag EG1, Selbsteinschätzung EG4 | Nur Prüfhypothese, keine automatische Höhergruppierung | Offen: Browser-Autotest |
| T07 | Zulagen angegeben | Keine ungeprüfte Summierung | Offen: Browser-Autotest |
| T08 | Leere oder ungültige Eingaben | Kein irreführendes Ergebnis; Validierung erforderlich | Offen: Umsetzung |
| T09 | Wiederholtes Ergebnis, Zurück, Änderung | Aktuelle Eingaben ausgewertet | Offen: Browser-Autotest |
| T10 | Android Telegram WebView, Chrome, Desktop | Ergebnis, Kopieren, Drucken funktionieren | Offen: Geräteprüfung |

## Fachliche Blocker
- Eingruppierungsmerkmale nach § 2 ERTV vollständig modellieren und mit Beispielen gegenprüfen.
- Erfahrungszuschlag und iGZ-Übergangsregel differenzieren.
- Branchenzuschläge, Zulagen und Anrechnung gesondert modellieren.
- Beschäftigungsbeginn, Einsatzbeginn, Zeitraum und Arbeitsstunden berücksichtigen.
- Equal Pay, Zeitkonto, Ausschlussfristen nicht pauschal berechnen.
- Bei unbekanntem Tarif oder Tarifwechsel keine pauschale Entgeltbehauptung.

## Abschlussbedingung
P0 erst schließen, wenn Browser-/Regressionstests bestanden, Eingabevalidierung vollständig und Quellen-/Tarifstand dokumentiert sind. Bis dahin ausschließlich Prüfversion.

## Implementierungsnachtrag 12.11.2026
- Euro-Eingaben: Formatvalidierung im Frontend ergänzt (max. zwei Dezimalstellen, nicht negativ).
- Ergebnis: Erfahrungszuschläge, iGZ-Übergangsregel und Grenzen ausdrücklich ausgewiesen.
- Playwright-Tests: fünf automatisierte Browserfälle implementiert, für Desktop-Chromium und emuliertes Android/Pixel-7-Profil konfiguriert.
- GitHub Actions: Workflow angelegt unter `.github/workflows/p0-tests.yml`.
- **Testlaufstatus: noch nicht durch erfolgreiche CI-Ausführung nachgewiesen.** Testfälle T01, T04, T08, T09 teilweise abgedeckt; T02/T03 abgedeckt. T06/T07/T10 benötigen zusätzliche Fälle oder reale Geräteprüfung.
- **Freigabe bleibt gesperrt**, bis Workflow grün, Restfälle ergänzt und ein echter Telegram-WebView-Test nach der letzten Änderung bestätigt sind.
