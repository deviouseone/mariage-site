# Instructions — Branchement RSVP → Google Sheet

## Étape 1 : Créer le Google Sheet

1. Va sur [sheets.google.com](https://sheets.google.com)
2. Crée un nouveau classeur et nomme-le : **RSVP Mariage Antoine & Morgane**

### Onglet "RÉPONSES" (données brutes)

3. Renomme l'onglet par défaut en **RÉPONSES**
4. En **ligne 1**, mets ces en-têtes (une par colonne A→L) :

| A | B | C | D | E | F | G | H | I | J | K | L |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Date/Heure | Nom | Prénom | Email | Mairie | After-Mairie | Houppa & Soirée | Shabbat Vendredi | Shabbat Samedi | Car | Allergies | ID soumission |

5. **Mise en forme de la ligne d'en-tête** : sélectionne A1:L1 → Gras, fond gris clair, figer la ligne (Affichage > Figer > 1 ligne)

### Mise en forme conditionnelle (vert/rouge)

6. Sélectionne la plage **A2:L1000**
7. Va dans **Format > Mise en forme conditionnelle**
8. Ajoute une **première règle** :
   - Type : **La formule personnalisée est**
   - Formule (Sheet en français) : `=ET($E2="Oui";$G2="Oui")`
   - Formule (Sheet en anglais) : `=AND($E2="Oui",$G2="Oui")`
   - Couleur de fond : **Vert clair** (#d9ead3)
9. Ajoute une **deuxième règle** :
   - Type : **La formule personnalisée est**
   - Formule (Sheet en français) : `=ET($E2="Non";$G2="Non")`
   - Formule (Sheet en anglais) : `=AND($E2="Non",$G2="Non")`
   - Couleur de fond : **Rouge clair** (#f4cccc)

### Onglet "DASHBOARD" (vue d'ensemble)

10. Crée un **nouvel onglet** et nomme-le **DASHBOARD**
11. Copie-colle la structure suivante :

**Cellule A1** : `TABLEAU DE BORD RSVP` (en gras, taille 18)

**Cellule A3** : `Total soumissions`
**Cellule B3** : `=COUNTA(RÉPONSES!B2:B)`

**Cellule A4** : `Total "Oui" Mairie`
**Cellule B4** : `=NB.SI(RÉPONSES!E2:E,"Oui")`

**Cellule A5** : `Total "Non" Mairie`
**Cellule B5** : `=NB.SI(RÉPONSES!E2:E,"Non")`

**Cellule A6** : `Total "Oui" Houppa & Soirée`
**Cellule B6** : `=NB.SI(RÉPONSES!G2:G,"Oui")`

**Cellule A7** : `Total "Non" Houppa & Soirée`
**Cellule B7** : `=NB.SI(RÉPONSES!G2:G,"Non")`

**Cellule A8** : `Total "Oui" After-Mairie`
**Cellule B8** : `=NB.SI(RÉPONSES!F2:F,"Oui")`

**Cellule A9** : `Total "Oui" Shabbat Vendredi`
**Cellule B9** : `=NB.SI(RÉPONSES!H2:H,"Oui")`

**Cellule A10** : `Total "Oui" Shabbat Samedi`
**Cellule B10** : `=NB.SI(RÉPONSES!I2:I,"Oui")`

**Cellule A11** : `Total "Oui" Car (navette)`
**Cellule B11** : `=NB.SI(RÉPONSES!J2:J,"Oui")`

**Cellule A13** : `Personnes avec régime spécial`
**Cellule B13** : `=NB.SI.ENS(RÉPONSES!K2:K,"<>")`

**Cellule A15** : `DÉTAIL RÉGIMES SPÉCIAUX` (en gras)

**Cellule A16** : `Nom`
**Cellule B16** : `Prénom`
**Cellule C16** : `Allergies / Régime`

**Cellule A17** : `=IFERROR(FILTER(RÉPONSES!B2:B,RÉPONSES!K2:K<>""),"")`
**Cellule B17** : `=IFERROR(FILTER(RÉPONSES!C2:C,RÉPONSES!K2:K<>""),"")`
**Cellule C17** : `=IFERROR(FILTER(RÉPONSES!K2:K,RÉPONSES!K2:K<>""),"")`

### Partage

12. Clique sur **Partager** (en haut à droite)
13. Ajoute **morganechaigneau@hotmail.fr** en tant qu'**Éditrice**

---

## Étape 2 : Configurer Google Apps Script

1. Dans le Google Sheet, va dans **Extensions > Apps Script**
2. **Supprime** tout le code par défaut (`function myFunction()...`)
3. Copie-colle le contenu du fichier `google-apps-script.js` fourni dans ce dossier
4. Clique sur **💾 Enregistrer** (ou Ctrl+S)
5. Nomme le projet : **RSVP Mariage**

---

## Étape 3 : Déployer en Application Web

1. Dans Apps Script, clique sur **Déployer > Nouveau déploiement**
2. Clique sur l'engrenage ⚙️ à côté de "Sélectionner le type" → choisis **Application Web**
3. Configure :
   - **Description** : RSVP Mariage v1
   - **Exécuter en tant que** : **Moi** (ton compte Google)
   - **Qui a accès** : **Tout le monde**
4. Clique sur **Déployer**
5. Google va te demander d'autoriser l'accès → clique **Autoriser** → choisis ton compte → **Avancé** → **Accéder à RSVP Mariage (non sécurisé)** → **Autoriser**
6. **COPIE l'URL** de déploiement (elle ressemble à : `https://script.google.com/macros/s/AKfycbx.../exec`)

---

## Étape 4 : Connecter au site

1. Ouvre le fichier `index.html`
2. Cherche le commentaire :
   ```
   // ⚠️ COLLER VOTRE URL GOOGLE APPS SCRIPT ICI ⚠️
   ```
3. Remplace `'APPS_SCRIPT_URL_HERE'` par l'URL copiée à l'étape 3 :
   ```javascript
   const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx.../exec';
   ```
4. Sauvegarde le fichier
5. Redéploie le site (push git / upload Netlify / etc.)

---

## Étape 5 : Tester

1. Ouvre le site dans ton navigateur
2. Va au formulaire RSVP
3. Remplis un test :
   - Nom : **Test**
   - Prénom : **Essai**
   - Email : **test@test.com**
   - Coche quelques OUI/NON
4. Clique sur **ENVOYER MA RÉPONSE**
5. Vérifie :
   - ✅ Le message de confirmation s'affiche sur le site
   - ✅ Une nouvelle ligne apparaît dans l'onglet **RÉPONSES** du Google Sheet
   - ✅ Le **DASHBOARD** se met à jour automatiquement
   - ✅ Un email de notification arrive sur **ant.guesdon@gmail.com** et **morganechaigneau@hotmail.fr**
6. Supprime la ligne de test du Google Sheet une fois validé

---

## En cas de problème

- **Le bouton ne fait rien** : ouvre la console du navigateur (F12 > Console) et vérifie s'il y a une erreur. L'URL est probablement mal collée.
- **Erreur CORS** : vérifie que dans le déploiement Apps Script, "Qui a accès" est bien sur "Tout le monde".
- **Pas d'email reçu** : vérifie les spams. Google limite l'envoi à ~100 emails/jour sur les comptes gratuits.
- **Mise à jour du script** : si tu modifies le code Apps Script, tu dois faire un **nouveau déploiement** (Déployer > Gérer les déploiements > Modifier > Nouvelle version).
