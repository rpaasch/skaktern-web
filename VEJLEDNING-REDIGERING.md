# Vejledning: Redigering af indhold

Denne vejledning beskriver hvordan tekster, kontaktoplysninger og den faglige vejledning i appen kan redigeres. Det kræver ingen programmeringsviden.

---

## 1. Før der redigeres

- **Brug en simpel teksteditor** — f.eks. Notesblok (Windows) eller TextEdit (Mac). Undgå Word eller lignende, da det kan tilføje usynlig formatering.
  - I TextEdit: Vælg *Format → Konverter til ren tekst* inden redigering.
- **Tag en backup** — kopier hele mappen inden der ændres noget, så det altid er muligt at gå tilbage.
- **Gem som UTF-8** — dette sikrer at æ, ø og å vises korrekt.
  - Notesblok: Vælg *Gem som…* → Kodning: **UTF-8**.
  - TextEdit: Vælg *Gem som…* → Kodning: **Unicode (UTF-8)**.

---

## 2. Ret i den faglige vejledning

Den faglige vejledning ligger i filen **`manual.md`**. Den er skrevet i Markdown — et simpelt tekstformat hvor formatering angives med tegn.

### Markdown-oversigt

**Overskrifter** — antal `#` bestemmer niveauet:

```markdown
# Stor overskrift
## Mellem overskrift
### Lille overskrift
```

**Fed og kursiv tekst:**

```markdown
Dette ord er **fed** og dette er *kursiv*.
```

Resultat: Dette ord er **fed** og dette er *kursiv*.

**Punktliste:**

```markdown
- Første punkt
- Andet punkt
- Tredje punkt
```

**Nummereret liste:**

```markdown
1. Første punkt
2. Andet punkt
3. Tredje punkt
```

**Link:**

```markdown
[Klik her for at læse mere](https://example.com)
```

### Eksempel på redigering

Filen starter sådan:

```markdown
# Synsfelts-træningsapp - Dokumentation

## 1. Tanker bag app
...
```

For at ændre en overskrift rettes teksten efter `##`. For at tilføje et nyt afsnit skrives almindelig tekst på en ny linje.

---

## 3. Ret kontaktoplysninger

Kontaktoplysningerne står i **`index.html`**. Søg efter teksten `Faglig support` — afsnittet ser sådan ud:

```html
<p><strong>Faglig support:</strong><br>
Neurooptometrist Karsten Haarh<br>
<a href="mailto:G64L@kk.dk">G64L@kk.dk</a></p>

<p><strong>Udviklet af:</strong> Rasmus Paasch</p>
```

### Sådan ændres det

- **Kontaktnavn**: Erstat f.eks. `Karsten Haarh` med det nye navn.
- **Email**: Emailadressen skal ændres *to steder* — både i `href="mailto:..."` og i teksten lige efter:

```html
<a href="mailto:ny-email@kk.dk">ny-email@kk.dk</a>
```

- **Udviklerkreditering**: Linjen `Udviklet af: Rasmus Paasch` er en kreditering uden kontaktinfo.

---

## 4. Ret tekster på landingsiden

Landingsiden ligger i **`index.html`**. Her er de vigtigste tekster der kan ændres:

### Advarsel om fotosensitivitet

Søg efter `Advarsel om fotosensitivitet`:

```html
<h1>Advarsel om fotosensitivitet</h1>
<p>Dette værktøj bruger blinkende mønstre som kan udløse anfald hos
   personer med fotosensitivitet eller epilepsi.</p>
```

Advarselteksten kan ændres direkte mellem `<p>` og `</p>`.

### Appens titel og beskrivelse

Søg efter `IBOS Skaktern`:

```html
<h1 class="app-title">IBOS Skaktern</h1>
<p class="app-subtitle">Et professionelt værktøj til neurooptometri
   og synstræning</p>
```

### Om-tekst

Søg efter `Om værktøjet`:

```html
<h2>Om værktøjet</h2>
<p>IBOS Skaktern er udviklet til professionelle indenfor
   neurooptometri. ...</p>
```

### Links til vejledning og tilgængelighed

Søg efter `Faglig vejledning`:

```html
<a href="manual.html" ...>Faglig vejledning for professionelle</a>
<a href="accessibility.html" ...>Tilgængelighedserklæring</a>
```

Linkteksterne kan ændres mellem `>` og `</a>`.

### Copyright

Søg efter `© 2024`:

```
© 2024-2025 IBOS
```

---

## 5. Ret en label i appen

Labels i selve appen står i **`app.html`**. Her er et konkret eksempel — knappen "Kopier aktuelt link".

Søg efter `Kopier aktuelt link`:

```html
<button id="copyLinkButton" type="button">Kopier aktuelt link</button>
```

For at ændre knapteksten erstattes teksten mellem `>` og `</button>`:

```html
<button id="copyLinkButton" type="button">Kopier link til udklipsholder</button>
```

> **Vigtigt**: Ændr kun teksten mellem `>` og `<`. Attributter som `id="..."` eller `type="..."` skal ikke røres.

---

## 6. Tjek ændringerne

1. Åbn **`index.html`** i en browser (dobbeltklik på filen).
2. Kontroller at landingsiden ser rigtig ud — tekster, kontaktoplysninger, links.
3. Klik **"Jeg forstår - Fortsæt til værktøj"** for at åbne appen.
4. Åbn indstillingsmenuen og kontroller at labels er korrekte.
5. Klik **"Faglig vejledning for professionelle"** og kontroller at vejledningen vises rigtigt.

Hvis noget ser forkert ud (f.eks. ødelagte tegn eller manglende tekst), kan backuppen bruges til at starte forfra.
