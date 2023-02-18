# PRIMA
Abgaben und Übungen aus Prototyping interaktiver Medienapplikationen und Games im Wintersemester 2023 an der HFU 


Titel: Super Mario Speed Racer  
Autor: Vasilii Gurev 
Wintersemester 2023  
OMB 6
Kurs: PRIMA  
Dozent: Prof. Jirka Dell'Oro-Friedl  
Executable: https://vs-rev.github.io/Prima/SuperMarioSpeedRacer/index.html 
/n Source-Code: https://github.com/Vs-Rev/Prima/tree/main/SuperMarioSpeedRacer
Design-Dokument: https://github.com/Vs-Rev/Prima/blob/main/SuperMarioSpeedRacer/Documents/PRIMA_Spielekonzept_MarioKart_VasiliiGurev_263754.pdf
Anleitung:   
Fahren -> W - Gas Geben, D - Bremsen, A - Drehung nach links, D - Drehung nach rechts

Das Ziel ist es, 3 Runden in Bestzeit zu fahren und dabei alle Münzen einzusammeln.    


Vorgaben (ausführliche Variante mit Links zu den einzelenen Code-Stellen im Design-Dokument)
============================================

|                         |                                                                                                                                                                                                                                                                                                                                                                                          |
|-------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|  1. Units and Positions | 0 wird als Startpuknt des Karts definiert. Es ist der Punkt, an welchem das Rennen anfängt und aufhört. 1 wird hier als 1 Meter definiert.                                                                                                                   |
|  2. Hierarchy           | Grob aufgeteilt wird die Hierarchie mit 4 übergeordneten Kategorien. Diese sind World, Kart, Items & Sounds. Unter World werden alle Elemente geordnet, welche hauptsächlich im Viewport erstellt wurden und zuständig für die Spielewelt sind. Dies sind beispielsweise zusammenhängende vorgebaute Straßenstücke oder Umgebungsdekorationen. Die Übergruppe: "Kart" enthält eine Kammera-Komponente, welche über den Code an das ebenfalls mit Code generierte eigentliche Kart rangehängt wird. Die Items enthalten die einsammelbaren Münzen, welche im Editor platziert, jedoch durch den Code u.a. mit Custom Script Components bedient werden. Schließlich enthält die Node Sounds die im Spiel vorhandenen Sounds wie Musik und das Aufsammeln der Coins.|
| 3. Editor               | Im Editor wird die Grundstruktur des Spiels erstellt. Dazu gehören die Parent-Nodes für die Goombas, Mario und die Item-Boxen. Zudem werden die einzelnen Boden-Stücke und der Hintergrund platziert, das Licht und es gibt Nodes für die Sounds. Im Code werden die Item-Boxen und die Goombas erstellt, da die Anzahl Variabel ist, dasselbe gilt für Mario und die Kamera-Components. Die Hierarchie wurde ebenfalls so gewählt, um die Übersicht über die Projektdateien zu behalten. |
| 4. Scriptcomponents     | Die Scriptcomponents wurden für die Coins benutzt, um Events wie das aufsammeln einer Münze zu feuern und auch, um den Sound dabei abzuspielen und den Münzzähler zu verändern. |
| 5. Extend               | Die Klasse Kart extendet ƒ.Node, die Klasse Coin extendet ƒ.ComponentScript. Statistics extends ƒ.Mutable  |
|  6. Sound               | Als Sound gibt es eine spannungsgeladene retro- Hintergrundmusik. Ebenfalls wird ein belohnender "Success"-Sound beim Einsammeln der Münzen gespielt. |
| 7. VUI                  | Das VUI zeigt die Nummer der aktuellen Runde, die Anzahl gesammelter Münzen, sowie die aktuelle Zeit an.   |
| 8. Event-System         | Das Event-System besteht größtenteils aus einem Trigger-Prinzip. So werden Events meist ausgerufen, wenn Collision-Trigger aktiviert werden. So feuert beispielsweise das Event, welches an die Münzen gebunden ist, sobald das Kart in die Münzen hineinfährt. Dieses Event wird dispatched, abgefangen und ausgeführt |
| 9. External Data        | Die Daten, welche man direkt einsehen und ggf. verändern kann sind in der externalData.json zu finden: "maxSpeed" - Die maximale Geschwindigkeit des Karts,"acceleration" - Die Beschleunigung des Karts,"maxSteerAngle" - Der Maximale Drehwinkelwert des Karts,"steeringSpeed" - Die Drehgeschwindigkeit des Karts,"mass" - Die Masse des Karts,"friction" - Die Reibung|
| A. Light                | In dem Markio Kart gibt es keine wirklich realistische Lichtsetzung. Diese dient dazu, dass Umfeld optisch angenehm zu gestalten. Darum gibt es ein Ambient- + Sunlight. Diese beiden Lichter werden jedoch äußerst dunkel abgebildet, da die Rennstrecke bei spätem Abend/Nacht gespielt wird. So harmonisieren die Objekte in der Welt mit relativ dunkler, grauer Stadttextur mit dem dunklen Blau/Lila des Lichtes. |
| B. Physics              | Das Kart erfährt Einwirkung von Kräften bei Beschleunigung, Drehung, Bremsung, Fall und Collision. (forces + collisions + torques) Alle Objekte, bis auf Dekorationen wie das Hintergrundbild oder die Warnsymbole, besitzen Ridgid Bodys.  |                                                                                                                                                                                                                                                                       |
|                         |                                                                                                                                                                                                                                                                                                                                                                                          |
