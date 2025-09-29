# Work peasant ! React + TypeScript + Phaser 3

Une conversion React moderne du prototype HTML "King Gaze Game", utilisant TypeScript, Phaser 3 et des patterns architecturaux avancés.

## 🏗️ Architecture

### Structure des dossiers
```
src/
├── game/                    # Logique Phaser 3
│   ├── strategies/         # Strategy Pattern (Gaze, Preview)
│   ├── factories/          # Factory Pattern (Buildings)
│   └── managers/           # Gestionnaires (Preview)
├── components/             # Composants React UI
├── stores/                 # Stores Zustand (état global)
├── types/                  # Interfaces TypeScript
├── hooks/                  # Hooks React personnalisés
└── styles/                 # Styles CSS
```

### Patterns utilisés

#### Factory Pattern
- `BuildingFactory`: Création des différents types de bâtiments
- Encapsulation de la logique de création
- Coûts et propriétés centralisés

#### Strategy Pattern
- `GazeStrategy`: Différentes formes de regard royal
- `PreviewStrategy`: Modes d'aperçu (regard, démolition, construction)
- Facilite l'extension avec de nouveaux types

#### Observer Pattern (via Zustand)
- Stores réactifs pour l'état du jeu
- Communication entre Phaser et React
- Mises à jour automatiques de l'UI

## 🛠️ Technologies

- **React 18** - Interface utilisateur réactive
- **TypeScript** - Typage statique robuste
- **Phaser 3** - Moteur de jeu 2D
- **Zustand** - Gestion d'état légère
- **Vite** - Outil de build moderne

## 🎮 Fonctionnalités

### Système de Regard Royal
- Patterns évolutifs (L-shape → 2×2 → 2×2+1 → 3×2)
- Rotation en temps réel
- Activation/désactivation des bâtiments

### Gestion des Ressources
- Or, Nourriture, Pierre, Soldats
- Production automatique des bâtiments actifs
- Coûts et contraintes économiques

### Bâtiments
- **Ferme**: Produit de la nourriture (2 unités/1.5s)
- **Mine**: Produit pierre + or (1 chaque/2.5s)
- **Caserne**: Produit des soldats (max 5, 1/3s)

## 🚀 Utilisation

```bash
# Installation des dépendances
npm install

# Démarrage du serveur de développement
npm run dev

# Build de production
npm run build
```

## 🔧 Hooks personnalisés

### `useBuildingProduction`
- Gestion de la production des bâtiments
- Mise à jour des cooldowns et animations

### `useGameInput`
- Gestion des entrées clavier/souris
- Interaction avec la grille de jeu

## 📚 Stores Zustand

### `gameStore`
- État principal (ressources, regard, modes)
- Actions pour les modifications d'état

### `buildingStore`
- Gestion de la collection de bâtiments
- États d'activation/désactivation

### `eventStore`
- Système d'événements typé
- Communication découplée