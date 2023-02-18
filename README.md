# PRIMA
Abgaben und Übungen aus Prototyping interaktiver Medienapplikationen und Games im Wintersemester 2023 an der HFU 


Titel: Super Mario Speed Racer  
Autor: Vasilii Gurev 
Wintersemester 2023  
OMB 6
Kurs: PRIMA  
Dozent: Prof. Jirka Dell'Oro-Friedl  
Executable: https://vs-rev.github.io/Prima/SuperMarioSpeedRacer/index.html 
Source-Code: https://github.com/Vs-Rev/Prima/tree/main/SuperMarioSpeedRacer
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
| 5. Extend               | Die Klasse Kart extendet ƒ.Node, die Klasse Coin extendet ƒ.ComponentScript.                                                                                                                                                                                                                                                                             |
|  6. Sound               | Mario macht einen Sound wenn er springt, die Coins machen einen Sound wenn sie gespawnt werden und es gibt unterschiedliche Sounds wenn der Spieler gewinnt oder verliert.                                                                                                                                                                                                               |
| 7. VUI                  | Das VUI zeigt die aktuelle Punktzahl und die verbleibende Zeit als Countdown an.                                                                                                                                                                                                                                                                                                         |
| 8. Event-System         | Wenn irgendwo im Code festgestellt wird, dass das Spiel vorbei ist (Mario hat eine negative y-Position, alle Goombas sind heruntergefallen, die Zeit ist abgelaufen), triggert der jeweilige Part das gameEnd-Event und liefert mit Event.Detail weitere Informationen.                                                                                                                  |
| 9. External Data        | In Supermario gibt es kein Licht und Schatten, alles ist gleichmäßig beleuchtet. Daher habe ich mich bei der Beleuchtung für ein einfaches Ambient-Light entschieden.                                                                                                                                                                                                                    |
| A. Light                | In Supermario gibt es keine Schatten, daher habe ich mich für ein einfaches Ambient-Light entschieden.                                                                                                                                                                                                                                                                                   |
| B. Physics              | Mario, die Goombas, die Item-Boxen und der Boden verwenden RigidBodys. Die Goombas und die Item-Boxen registrieren Kollisionen mit Mario und triggern entsprechendes Verhalten                                                                                                                                                                                                           |
| D. StateMachines        | Das Verhalten der Goombas wird durch eine ComponentStateMachine gesteuert, mit den States Walk, Fight und Die.                                                                                                                                                                                                                                                                           |
| E. Animation            | Mario und die Goombas haben eine Sprite-Animation. Die Münzen werden durch eine normale Animation bewegt.                                                                                                                                                                                                                                                                                |
|                         |                                                                                                                                                                                                                                                                                                                                                                                          |
