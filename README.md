# arg
Il s'agit d'un petit projet ARG « Protocole Effort » (MBA ESG).

## Journal des accès (users.txt)

Pour enregistrer les visites dans un fichier `users.txt` :

1. Lancer le serveur depuis le dossier `arg` :
   ```bash
   cd arg
   node server.js
   ```
2. Ouvrir **http://localhost:3000/** (ou le lien partagé si tu utilises un tunnel).
3. Chaque ouverture de la page d’accueil ou de la page « Archives » envoie les infos de l’appareil au serveur, qui les écrit dans `users.txt` (une ligne JSON par visite).

Sans serveur (fichiers ouverts en `file://`), le journal n’est pas créé : le navigateur ne peut pas écrire sur ton disque. 
