
+# MenuIR
+
+MenuIR est un prototype d'application web mobile immersive pour restaurateurs, accessible via QR code posé sur les tables. L'expérience propose une carte sous forme de vidéos verticales en arrière-plan, inspirée de TikTok et Instagram.
+
+## Objectifs
+
+- Différencier les restaurateurs via une présentation vidéo immersive.
+- Moderniser l'expérience client sans commande ni paiement en ligne.
+- Mettre en avant le visuel des plats grâce à des vidéos plein écran.
+
+## Fonctionnalités client (menu)
+
+- Navigation par catégories (non scrollables, une active à la fois).
+- Slider horizontal des plats de la catégorie sélectionnée.
+- Vidéos verticales YouTube en fond plein écran (autoplay, boucle, muet par défaut, sans activation du son).
+- Détails du plat dans une card overlay (prix, ingrédients, badge vegan).
+- Filtre Vegan.
+- Bouton « Demander l’addition » avec saisie du numéro de table.
+
+## Fonctionnalités restaurateur (admin)
+
+- Gestion des catégories et des plats.
+- Réorganisation par drag & drop.
+- Analytics de consultation (mock).
+- Notifications des demandes d’addition (mock, alimentées par le `localStorage`).
+
+## Démarrage rapide
+
+1. Lancer un serveur statique :
+
+   ```bash
+   python -m http.server 8000
+   ```
+
+2. Ouvrir l'application :
+
+   - Client : http://localhost:8000/index.html
+   - Admin : http://localhost:8000/admin.html
+
+## Notes techniques
+
+- Application web mobile-first (pas de PWA requise).
+- Connexion internet requise (vidéos YouTube).
+- Architecture pensée pour évoluer vers un SaaS.
 
EOF
)
