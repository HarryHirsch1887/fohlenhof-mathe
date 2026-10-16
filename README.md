# Pferdehof Mathe

(Früher „Fohlenhof Mathe“. Adresse, Repository `fohlenhof-mathe` und Speicherschlüssel behalten den alten Namen, damit installierte Apps und Spielstände erhalten bleiben.)

Eine kleine Lern-App, in der Kinder Mathe üben und dabei ein Pferd großziehen. Je mehr Aufgaben richtig gelöst werden, desto mehr wächst das Fohlen zum ausgewachsenen Pferd. Für richtig gelöste Aufgaben gibt es Äpfel, mit denen sich Fellfarben, Abzeichen, Rassen und Fähigkeiten freischalten lassen. Fellfarben: Fuchs, Brauner, Rappe, Schimmel, Palomino, Schecke, Falbe (mit dunklen Beinen und Aalstrich) und Windfarben (dunkles Fell, helle Mähne).

Die App ist ein privates Familienprojekt für Kinder der Klassen 5 bis 8 (Gymnasium).

## Was die App kann

- 10 Aufgaben pro Runde, 5 Schwierigkeitsstufen pro Thema. Die Stufe steigt nach 3 richtigen Antworten in Folge und sinkt nach 2 falschen.
- Tipps (kosten halbe Punkte) und bei falschen Antworten ein **Lösungsweg** zum Nachvollziehen.
- **Fehlerheft:** Falsch beantwortete Aufgaben kommen in späteren Runden desselben Themas erneut dran.
- Mehrere Kinder mit eigenem Fortschritt und eigenem Pferd.
- **Animierte Weide** im Bilderbuch-Stil als Hintergrund: Auf der Startseite laufen die Pferde der Kinder (aufgefüllt auf 5) über die Koppel, mit stehen, grasen, Schritt, Trab und Galopp. Himmel und Licht folgen der echten Uhrzeit (Tag, Dämmerung, Nacht).
- **Persönlicher Hof:** Nach der Anmeldung zeigt der Hintergrund das Pferd des Kindes. Mit Äpfeln lassen sich Gegenstände bauen (Apfelbaum, Eiche, Blumenwiese, Heuballen, Wassertrog, Stall, Teich, Windrad, Regenbogen). Jede gekaufte Rasse bringt einen Pferdefreund mit.
- **Rundflug:** Eine ruhige Fahrt über den ganzen Hof. Wischen zum Umschauen, Tippen auf ein Pferd zeigt den Namen.
- Die Animation lässt sich in der Eltern-Ansicht ruhigstellen und stoppt bei "Bewegung reduzieren". Bei langsamen Geräten schaltet sie selbst um: zuerst ohne Umriss, dann auf die halbe Bildrate.
- **Mähne und Zöpfe:** Ab der Stufe „Jährling“ lässt sich die Mähne kostenlos auf Kurz, Mittel oder Lang stellen. Zöpfe kosten 10 Äpfel (mit rosa Haargummi), weitere Gummifarben je 3 Äpfel.
- **3D-Ansicht:** Ist das Pferd ausgewachsen, zeigen Kind-Ansicht und Wunschbaum es in einem kleinen 3D-Fenster, drehbar mit dem Finger. Fellfarbe, Abzeichen, Mähne und Zöpfe erscheinen dort sofort. Die 3D-Dateien (etwa 3,3 MB) werden erst beim ersten Öffnen geladen und danach offline gespeichert.
- **Eltern-Ansicht** mit Statistik, Einstellungen und Sicherung (Export und Import). Beim ersten Start wählbar: mit PIN geschützt oder ohne PIN als offene „Einstellungen“, zum Beispiel auf dem eigenen Handy eines Kindes. Lässt sich später im Kasten „PIN-Schutz“ umstellen.
- Funktioniert ohne Konto und ohne Internetverbindung, sobald die App geladen und als App installiert ist.

## Themen

| Klasse | Themen |
|---|---|
| 5 | Zahlenfolgen, Teilbarkeit, Rechentricks, Knobeln und Zählen, Rechnen und Rechengesetze, Größen und Einheiten, Umfang und Fläche |
| 6 | Brüche, Dezimalzahlen, Dreisatz, Rechentricks, Knobeln und Zählen |
| 7 | Gleichungen und Terme, Prozent, Zahlentheorie, Geometrie und Zählen, negative Zahlen, Terme |
| 8 | Lineare Funktionen, Gleichungssysteme, Potenzen und Wurzeln, Pythagoras, Zahlentheorie |

Die Aufgaben werden zufällig erzeugt. Die Themen sind typischer Gymnasialstoff, aber nicht mit einem bestimmten Lehrplan oder Schulbuch abgeglichen.

## Datenschutz

- Die App hat **keine Server, kein Konto, keine Cookies, kein Tracking und keine Werbung**.
- Namen, Fortschritt und PIN werden ausschließlich im **Browser des jeweiligen Geräts** gespeichert (`localStorage`). Sie werden nirgendwohin gesendet.
- Der Spielstand gilt pro Gerät und Browser. Wer das Gerät wechselt oder die Browserdaten löscht, verliert ihn. Deshalb gibt es in der Eltern-Ansicht den Export. Die Sicherungsdatei enthält auch die PIN im Klartext und sollte nicht weitergegeben werden.

## Ausprobieren

**Direkt öffnen:** `index.html` im Browser öffnen (Doppelklick). Die App läuft dann ohne Installation. Der Offline-Modus funktioniert so nicht.

**Mit lokalem Webserver** (z. B. mit installiertem Node.js):

```
npx serve .
```

Dann `http://localhost:3000` öffnen. Auf `localhost` lässt sich die App auch als App installieren.

**Im Internet:** Das Verzeichnis lässt sich unverändert bei GitHub Pages oder einem anderen statischen Webhost veröffentlichen. Für Installation und Offline-Modus muss die Seite über HTTPS geladen werden.

## Aufbau

| Datei | Inhalt |
|---|---|
| `index.html` | Startseite, bindet alles ein |
| `style.css` | Aussehen |
| `aufgaben.js` | Aufgaben-Generatoren mit Tipps und Lösungswegen |
| `pferd.js` | Gezeichnetes Pferd im Bilderbuch-Look: Fellfarben, Rassen, Wachstumsstufen, Mähne, Zöpfe, Bewegung (Schritt, Trab, Galopp, Grasen) |
| `hof.js` | Animierte Weide, Hof-Gegenstände, Herde, Rundflug |
| `app.js` | Spiellogik, Oberfläche, Speicher, Eltern-Ansicht, Pferd-Zeichnung |
| `manifest.webmanifest` | Angaben für die Installation als App |
| `sw.js` | Service Worker für die Offline-Nutzung |
| `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` | App-Symbole |
| `icon-maskable-192.png`, `icon-maskable-512.png` | App-Symbole für Android (werden rund oder abgerundet zugeschnitten, Motiv liegt in der Sicherheitszone) |

| `3d/vorschau.js` | 3D-Fenster für das eigene Pferd (wird erst bei Bedarf geladen) |
| `3d/three.module.js`, `3d/three.core.js`, `3d/addons/` | Bibliothek three.js 0.186.1 (MIT-Lizenz, siehe `3d/LICENSE-three.txt`), Importe auf feste Pfade umgeschrieben |
| `3d/pferd.glb` | 3D-Pferd „Horse“ von Quaternius (CC0, gemeinfrei) |

Es gibt keinen Build-Schritt. Alles ist reines HTML, CSS und JavaScript. Die einzige fremde Bibliothek ist three.js für das 3D-Fenster.

## Hinweise für Änderungen

- Neue Aufgaben gehören in `aufgaben.js`. Jeder Generator liefert `[Text, Antwort, Tipp, Lösungsweg]` für die Stufe `d` (1 bis 5). Die Antwort muss eine Zahl sein.
- Wenn sich die Dateiliste ändert oder neue Dateien dazukommen, in `sw.js` die Konstante `VERSION` erhöhen und die Dateiliste `FILES` anpassen, damit Geräte die neue Fassung laden.
- Der Speicherschlüssel im Browser heißt `fohlenhof1`. Nicht ändern, sonst gehen vorhandene Spielstände verloren.

## Lizenz

Noch nicht festgelegt. Bis dahin gilt: Alle Rechte vorbehalten. Der Quelltext ist öffentlich einsehbar, aber nicht zur Weiterverwendung freigegeben.
