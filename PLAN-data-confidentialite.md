# Plan — Section "Données & Confidentialité" (parametres)

Statut : **plan validé, aucun code écrit**. Repris depuis une session de planification — à implémenter plus tard.

Portée : les items "Supprimer toutes les analyses" et "Réinitialiser l'application" dans
`src/app/(dashboard)/parametres/_components/DataSection.tsx`. L'export ("Exporter mes données")
est **volontairement ignoré** pour l'instant.

## Constat (état actuel)

`DataSection.tsx` est un mock : les boutons "Supprimer toutes les analyses" et "Réinitialiser
l'application" n'ont aucun `onClick`. Côté backend (`cv-analyser-api`), rien n'existe pour ces
deux actions — pas même un delete unitaire d'analyse. Seul "Supprimer mon compte" est déjà
fonctionnel (`authClient.deleteUser()` → `POST /api/v1/account/remove`).

Capacités backend déjà présentes, réutilisables comme patron :

| Action | Existe ? | Détail |
|---|---|---|
| Supprimer toutes les candidatures | ✅ `DELETE /candidatures/remove/all` | Déjà câblé, sert de patron |
| Supprimer tous les CV | ✅ `DELETE /cvs/remove/all` | Déjà câblé, nettoie aussi les fichiers disque |
| Supprimer toutes les analyses | ❌ | Rien — même pas de delete unitaire |
| Reset applicatif global | ❌ | Aucun endpoint orchestrateur |

Point de modèle important : `Analyse.user_id` est une FK **directe** vers `users` (pas via
`candidature_id`), et `Candidature.analyse_id` est en `ON DELETE SET NULL`. Donc supprimer
toutes les analyses d'un utilisateur ne touche pas ses candidatures — cohérent avec le texte
déjà affiché dans l'UI.

Piège identifié et évité : `PreferenceRepository.clear_all_user_settings` existe mais n'est
appelé par aucune route, et **supprime la ligne** `preferences` au lieu de la remettre à zéro
(seule l'inscription recrée cette ligne). À ne pas réutiliser tel quel.

## Décision prise avec l'utilisateur

**"Réinitialiser l'application" ne touche pas du tout à la table `preferences`** — ni les
préférences IA (provider/modèle/clé API/URL de base), ni les autres (langue, seuil ATS, niveau
de détail). Choix fait pour rester simple et sûr plutôt que de faire un reset partiel
champ-par-champ de la table préférences.

**Copie UI à changer** (actuelle : *"Supprime toutes les données, analyses, candidatures et
préférences. Irréversible."*) — remplacer par quelque chose qui indique explicitement que les
préférences sont conservées, ex. :

> "Supprime vos candidatures, CV et analyses. Vos préférences (IA, langue, seuil ATS) sont
> conservées. Irréversible."

(Formulation finale à valider avec l'utilisateur au moment de l'implémentation.)

## Plan d'implémentation

### 1. Supprimer toutes les analyses (à construire, backend puis frontend)

Backend (`cv-analyser-api`) :
- `AnalyseRepository.delete_all_user_analyses(user_id)` — même patron que
  `CandidatureRepository.delete_all_user_candidature` (bulk `DELETE` par `user_id` + commit).
- Méthode de service correspondante dans `analyse_service.py`.
- Route `DELETE /api/v1/analyses/remove/all`, `Depends(get_current_user_id)`.

Frontend (`cv-analyser-app`) :
- Proxy Next.js (nouveau dossier sous `src/app/api/`, à nommer en suivant la convention des
  routes existantes, ex. `(analyses)/analyses/remove/all/route.ts`).
- `_api`/`_hooks` de la page `parametres` : `useDeleteAllAnalyses` (mutation TanStack Query).
- Modale de confirmation **simple** (pas de mot à taper) — action moins critique que la
  suppression de compte puisque les candidatures survivent.

### 2. Réinitialiser l'application (le plus gros morceau, à orchestrer)

Portée exacte : supprime candidatures (+ contacts, + kanban en cascade), CV (+ fichiers disque),
analyses, conversations de chat. Ne touche pas : profil (nom/titre), compte, préférences (voir
décision ci-dessus).

Backend :
- Nouveau service orchestrant, **dans une seule transaction**, les 4 suppressions :
  candidatures → CVs → analyses (point 1) → conversations de chat (nouveau — aucun bulk-delete
  n'existe encore pour `chat_conversations`, à créer sur le même patron).
- Route `POST /api/v1/account/reset` (même famille que `POST /api/v1/account/remove` déjà
  existant).

Frontend :
- Proxy Next.js pour la nouvelle route.
- Modale de confirmation **"tapez RÉINITIALISER"** — même rigueur que la suppression de compte,
  car quasi aussi destructeur.
- Après succès : invalider **tout** le cache TanStack Query (plutôt que d'énumérer les query
  keys une par une) puisque dashboard, candidatures, kanban et analyses deviennent tous obsolètes
  d'un coup.
- Mettre à jour la copie UI dans `DataSection.tsx` (voir section précédente).

## Prochaine étape

Reprendre l'implémentation dans l'ordre : backend section 1 → backend section 2 → frontend
section 1 → frontend section 2. Valider la formulation finale de la copie UI avant de coder
la partie 2 côté frontend.
