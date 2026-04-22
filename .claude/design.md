# Design System — JobMatch / MatchCV

## Identité visuelle

Application web personnelle de suivi de recherche d'emploi.
Style : **SaaS professionnel sombre/clair**, accent violet-bleu, design épuré et fonctionnel.

---

## Couleurs

### Primaires
| Nom | Hex | Usage |
|-----|-----|-------|
| `primary` | `#7C3AED` | Accent principal, boutons CTA, nav active, switch |
| `primary-end` | `#2563EB` | Fin du dégradé principal |
| `primary-gradient` | `linear 90° #7C3AED → #2563EB` | Boutons primaires, badges actifs, slider |

### Sidebar / Dark
| Nom | Hex | Usage |
|-----|-----|-------|
| `sidebar-bg` | `#080F1E` | Fond sidebar |
| `surface-dark` | `#0F172A` | Fond app dark, zones sombres |
| `surface-dark-2` | `#1E293B` | Cartes dark, inputs dark |
| `border-dark` | `#334155` | Bordures en mode dark |

### Surfaces claires
| Nom | Hex | Usage |
|-----|-----|-------|
| `bg-main` | `#F8FAFC` | Fond principal des pages |
| `surface-white` | `#FFFFFF` | Cartes, modales, inputs |
| `surface-light` | `#F1F5F9` | Fond hover, boutons secondaires |
| `surface-muted` | `#F8FAFC` | Fond inputs, zones grises claires |
| `border-light` | `#E2E8F0` | Bordures cartes, inputs |
| `border-muted` | `#F1F5F9` | Séparateurs légers |

### Texte
| Nom | Hex | Usage |
|-----|-----|-------|
| `text-primary` | `#0F172A` | Titres, texte principal |
| `text-secondary` | `#374151` | Texte corps |
| `text-muted` | `#64748B` | Labels, sous-titres |
| `text-subtle` | `#94A3B8` | Placeholders, métadonnées |
| `text-disabled` | `#CBD5E1` | Éléments désactivés |
| `text-on-dark` | `#F1F5F9` | Texte sur fond sombre |

### Statuts
| Statut | Fond | Texte | Point | Usage |
|--------|------|-------|-------|-------|
| Succès / Vert | `#D1FAE5` | `#059669` | `#10B981` | Score ≥80%, Acceptée, connecté |
| Avertissement / Orange | `#FEF3C7` | `#D97706` | `#FBBF24` | Score 60-79%, ATS moyen |
| Erreur / Rouge | `#FEE2E2` | `#B91C1C` | `#EF4444` | Score <60%, Refusée, danger |
| Info / Bleu | `#DBEAFE` | `#1D4ED8` | `#3B82F6` | Envoyée, information |
| Violet | `#EDE9FE` | `#6D28D9` | `#8B5CF6` | Entretien, accent secondaire |
| Neutre | `#F1F5F9` | `#475569` | `#64748B` | À envoyer, neutre |

### Providers IA
| Provider | Couleur |
|----------|---------|
| OpenAI | `#10B981` |
| Anthropic | `#CC785C` |
| Groq | `#F97316` |
| Mistral | `#FF7000` |
| OpenRouter | `#6366F1` |
| Ollama | `#1E293B` |

---

## Typographie

**Police** : Système par défaut (Inter recommandé)

| Rôle | Taille | Poids | Usage |
|------|--------|-------|-------|
| Page title | `22px` | `800` | Titre des pages |
| Section title | `18px` | `800` | Titres sections hero |
| Card title | `15px` | `700` | En-têtes de cartes |
| Body bold | `14px` | `700` | Sous-titres importants |
| Body | `13px` | `400-500` | Texte courant |
| Label | `12px` | `600` | Labels de champs |
| Caption | `11px` | `400` | Métadonnées, dates |
| Micro | `10px` | `600-700` | Badges, tags |
| Nav label | `9px` | `700` | Catégories navigation, `letter-spacing: 1.5` |

---

## Espacement & Layout

### Grille
- **Canvas** : 1440px de large
- **Sidebar** : 220px fixe
- **Topbar** : 56-64px de hauteur
- **Contenu principal** : 1220px (1440 - 220)
- **Padding pages** : `32px`
- **Gap sections** : `20-24px`

### Border Radius
| Taille | Valeur | Usage |
|--------|--------|-------|
| `sm` | `6px` | Petits boutons, icônes |
| `md` | `8px` | Boutons, inputs, badges |
| `lg` | `10-12px` | Cartes secondaires, tags |
| `xl` | `14-16px` | Cartes principales |
| `2xl` | `20px` | Grandes cartes, modales |
| `full` | `9999px` | Pills, avatars, switchs |

### Ombres
```
card:    0 2px 8px  rgba(0,0,0,0.03)
medium:  0 4px 12px rgba(0,0,0,0.05)
modal:   0 20px 60px rgba(0,0,0,0.18)
primary: 0 4px 12px rgba(124,58,237,0.20)
primary-lg: 0 8px 20px rgba(124,58,237,0.30)
```

---

## Composants

### Bouton Primaire (CTA)
```
background: linear-gradient(90deg, #7C3AED, #2563EB)
padding: 10px 20px
border-radius: 8px
font-size: 13-15px
font-weight: 700
color: #FFFFFF
box-shadow: 0 4px 12px rgba(124,58,237,0.30)
```

### Bouton Secondaire
```
background: #F1F5F9
border: 1px solid #E2E8F0
padding: 10px 20px
border-radius: 8px
font-size: 13px
font-weight: 500
color: #475569
```

### Bouton Ghost / Annuler
```
background: #FFFFFF
border: 1px solid #E2E8F0
padding: 10px 20px
border-radius: 8px
color: #64748B
```

### Input / Champ
```
background: #F8FAFC
border: 1px solid #E2E8F0
border-radius: 8-10px
height: 38-42px
padding: 0 12-14px
font-size: 12-13px
color: #374151
placeholder-color: #94A3B8
```

### Carte
```
background: #FFFFFF
border: 1px solid #E2E8F0
border-radius: 14px
padding: 20-24px
box-shadow: 0 2px 8px rgba(0,0,0,0.03)
```

### Badge de statut
```
padding: 4-5px 10-12px
border-radius: 20px
font-size: 10-11px
font-weight: 600
```

### Switch
```
width: 38px
height: 22px
border-radius: 11px
track-active: #7C3AED
thumb: #FFFFFF, width:16px, height:16px, border-radius:8px
thumb-shadow: 0 1px 3px rgba(0,0,0,0.12)
```

### Avatar / Logo placeholder
```
width/height: 30-64px (selon contexte)
border-radius: 50% pour avatars utilisateur
border-radius: 6-10px pour logos entreprise
gradient: linear-gradient(135deg, #7C3AED, #2563EB)
```

### Sidebar nav item (actif)
```
background: linear-gradient(90deg, #7C3AED, #2563EB)
height: 42px
border-radius: 10px
padding: 0 14px
icon-color: #FFFFFF
text: 13px 600 #FFFFFF
```

### Sidebar nav item (inactif)
```
background: transparent
icon-color: #475569
text: 13px 400 #475569
hover: background #1E293B
```

---

## Scores & Indicateurs

### Seuils de score matching
| Score | Couleur fond | Couleur texte | Label |
|-------|-------------|---------------|-------|
| ≥ 80% | `#D1FAE5` | `#059669` | Excellent |
| 60-79% | `#FEF3C7` | `#D97706` | Moyen |
| < 60% | `#F3F4F6` | `#9CA3AF` | Faible |

### Kanban — Couleurs colonnes
| Colonne | Fond | Header | Point |
|---------|------|--------|-------|
| À envoyer | `#F1F5F9` | `#64748B` | `#64748B` |
| Envoyée | `#EFF6FF` | `#1D4ED8` | `#3B82F6` |
| Entretien | `#F5F3FF` | `#6D28D9` | `#8B5CF6` |
| Refusée | `#FEF2F2` | `#B91C1C` | `#EF4444` |
| Acceptée | `#F0FDF4` | `#065F46` | `#10B981` |

---

## Page Login — Panneau gauche

```
background: linear-gradient(160deg, #0A0618, #1E0A4A 50%, #0D1B3E)
text-title: #FFFFFF, 34px, 800
text-sub: #94A3B8, 14px
text-accent: #C4B5FD (violet clair)
testimonial-bg: rgba(255,255,255,0.05)
testimonial-border: rgba(255,255,255,0.08)
```

---

## Dégradés récurrents

```css
/* Bouton principal */
background: linear-gradient(90deg, #7C3AED 0%, #2563EB 100%);

/* Avatar / Logo MatchCV */
background: linear-gradient(135deg, #7C3AED 0%, #2563EB 100%);

/* Score circle */
background: radial-gradient(#4F46E5 0%, #1E1B4B 100%);

/* Page login gauche */
background: linear-gradient(160deg, #0A0618 0%, #1E0A4A 50%, #0D1B3E 100%);

/* Score card (D3) */
background: linear-gradient(145deg, #7C3AED 0%, #2563EB 100%);
```

---

## Icônes

Bibliothèque : **Lucide Icons**
Taille standard : `14-18px`
Couleur inactive : `#94A3B8` ou `#64748B`
Couleur active / accent : `#7C3AED`

---

## Modales

```
overlay: rgba(15,23,42,0.6)
width: 860px
border-radius: 16px
background: #FFFFFF
header-height: 60px
footer-height: 64px
body: layout horizontal 2 colonnes (400px | fill)
col-right-bg: #FAFAFA
```
