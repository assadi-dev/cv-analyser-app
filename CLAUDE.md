
## Structure du projet
- `src/components/` → composants réutilisables
- `src/hooks/` → custom hooks partagés
- `src/stores/` → stores Zustand
- `src/types/` → types TypeScript partagés
- `src/lib/` → fonctions utilitaires
- `src/app/` → pages Next.js
- `src/api/` → définitions d'API (si nécessaire)
- `src/db/` → définitions de base de données (si nécessaire)

### Composants
- Un composant par fichier
- Nommage en PascalCase : `UserCard.tsx`
- Exporter en default export

### CSS / Tailwind
- Pas de CSS inline
- Pas de fichiers `.css` séparés sauf pour `index.css`
- Utiliser `cn` pour les classes conditionnelles

### Hooks
- Préfixer par `use` : `useAuth`, `useCart`
- Un hook par fichier dans `src/hooks/`

## Convention 
Dans chacune des pages, il faut utiliser les composants suivants :
un dossier hooks contenant les hooks spécifiques à la page
un dossier components contenant les composants spécifiques à la page
un dossier stores contenant les stores spécifiques à la page
un dossier types contenant les types spécifiques à la page
un dossier lib contenant les fonctions utilitaires spécifiques à la page
un dossier api contenant les définitions d'API spécifiques à la page

les appels api se feront tanstack query wrapper avec fetch et les hooks useQuery, useMutation, useInfiniteQuery, etc. doivent être des hooks custom qui utilisent fetch et tanstack query.

exemple :

export const useGetJobs = () => {
 const {data, isLoading, error} = useQuery({
    queryKey: ["jobs"],
    queryFn: () => fetch("/api/jobs").then((res) => res.json()),
  });
  return {data, isLoading, error};
};

les queryKey doivent être des constantes dans le dossier api de la page.

exemple :

export const GET_JOBS_QUERY_KEY = "jobs";

export const useGetJobs = () => {
 const {data, isLoading, error} = useQuery({
    queryKey: [GET_JOBS_QUERY_KEY],
    queryFn: () => fetch("/api/jobs").then((res) => res.json()),
  });
  return {data, isLoading, error};
};

Utiliser nuqs pour la gestion des query params ou des paramètres de recherche ou dans l'url. ils doivent dans un hook custom dans le dossier hooks de la page.

Toutes les pages doivent être responsive et s'adapter à toutes les tailles d'écrans.

toujour utiliser les composants du dossier components de la page. si un composant n'existe pas, il faut le créer dans le dossier components de la page.

les formulaires doivent utiliser react-hook-form et zod pour la validation des données. les hooks de validation doivent être dans le dossier lib de la page.

Les formulaire doive etre dans le dossier form set trouvant dans le dossier components de la page. 

creer un hook paratagée basé sur shadcn/ui pour la gestion des modales. 
prevoir la fonction pour ouvrir et fermer les modales
pouvoir envoyer des props à la modale
definir si oui ou non le verrouillage de la modale au clique externe et appui sur la touche echap
la modal ne doit pas avoir de width fixe, elle doit s'adapter à la taille du contenu.

utiliser sonnar pour les toast et les alertes. prevoir un hook paratager pour les toast et les alertes. qui fait appel à sonnar.

prevoir une fonction pour logger les erreurs dans la console. activer en mode developpement et desactiver en mode production.

chaque methode doit etre catch et les erreurs doivent etre appeler la fonction pour logger les erreurs dans la console.
 

les modales doivent etre dans le dossier modal set trouvant dans le dossier components de la page. 

# Next.js
Les pages.tsx doivent toujour etre en server components.

# Drizzle
Les tables doivent etre dans le dossier db de la page.
Les noms des tables doivent etre au pluriel et en snake_case.

# Auth
Utiliser better-auth pour l'authentification.
apres l'authentification, rediriger l'utilisateur vers la page d'accueil.
apres la deconnexion, rediriger l'utilisateur vers la page de connexion.
apres la creation d'un compte, rediriger l'utilisateur vers la page d'accueil.