# Zeitarbeits-ABC Agent – Aktivierung (noch nicht live)

## Bereits erledigt
- Backend-Entwurf in `agent/worker.js`, Groq API kompatibel.
- Keine Schlüssel im Repository. Bestehende GitHub Pages unverändert.

## Nächste Voraussetzung
1. Auf https://console.groq.com/keys einen kostenlosen API-Schlüssel anlegen.
2. **Nicht** hier im Chat, in GitHub, im Browser-JavaScript oder Telegram veröffentlichen.
3. Einen Cloudflare Worker auf einem Free-Tarif erstellen und `worker.js` einspielen; `GROQ_API_KEY` als Secret hinterlegen, `ALLOWED_ORIGIN` als `https://juschni.github.io` konfigurieren.
4. Vor öffentlicher Freigabe zwingend serverseitige Rate-Limits / Bot-Abuse-Schutz, Datenschutzprüfung, Lösch-/Protokollkonzept und Tests ergänzen. **CORS allein ist keine Authentifizierung.**
5. Danach erst Mini App mit Worker verbinden, Tests durchführen und den Agenten freigeben.

## Kosten und Grenzen
- Groq Free Tier hat nutzungsabhängige Rate-Limits; bei Überschreitung 429 statt garantierter Verfügbarkeit.
- GitHub Pages kann selbst keinen geheimen API-Schlüssel sicher halten.
- Vercel Hobby darf nicht für kommerzielle Projekte verwendet werden; daher nicht als kostenloses Geschäfts-Backend einplanen.
- Cloudflare-Planbedingungen und die kommerzielle Nutzung vor Veröffentlichung gesondert prüfen.
- Keine personenbezogenen Dokumente ohne transparente Einwilligung an Groq senden.
- Kein verlässlicher Anspruchs-/Rechtsentscheid ohne belastbare, datierte Quellen und zulässiges Rechtsdienstleistungsmodell.

## Abnahme
- Testdialog: unklare Eingruppierung; maximal zwei relevante Rückfragen; keine erfundenen EG-Werte.
- Testdialog: fehlende Tarifangaben; keine unberechtigte Lohnforderung.
- Testdialog: sensible Daten; keine Aufforderung zur ungeschwärzten Übermittlung.
- Testdialog: Kontingent erschöpft; verständliche Fehlermeldung.
- Mobiltest in Telegram und Browser.
