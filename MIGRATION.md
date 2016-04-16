<h2>Version 2.0 : Liste des évolutions au fil des versions</h2>

Evolutions :
<ul>
  <li>
    Technique
    <ul>
      <li><code>v2.0.0b0</code> Passage de Grunt.js à Gulp.js pour la gestion du projet</li>
    </ul>
  </li>
  <li>
    Fonctionnel
    <ul>
      <li>
        <code>v2.0.0b0</code>
        <ul>
          <li>Nouvelle page calendrier : Visualisation des matchs par date</li>
          <li>Page connexion : Le champ de l'adresse e-mail est maintenant un véritable champ "mail"</li>
          <li>Mobilité : Le menu supérieur de droite se ferme automatiquement après un choix de page</li>
          <li>Les noms des équipes ont été revus pour être plus courts quand on regarde les différentes pages sur mobile, sur le site web version bureau ils restent comme avant</li>
          <li>Page équipe : Dans la liste des 5 derniers matchs, désormais on peut voir pour quel compétition le match s'est disputé (championnat, coupe...)</li>
        </ul>
      </li>
      <li>
        <code>v2.0.0b1</code>
        <ul>
          <li>[FIX] Page "coupe" - Si plusieurs niveaux, boucle infinie sur le calcul des tours : Remplacement de <code>Math.max()</code> par <code>_.max()</code>, lors du calcul des étapes d'une coupe</li>
        </ul>
      </li>
    </ul>
  </li>
  <li>
    Amélioration des temps d'accès
    <ul>
      <li>
        <code>v2.0.0b0</code> Ne plus utiliser moment-with-locales.min.js mais moment.min.js + locales-fr.js (579Ko -> 460Ko)</li>
      <li>
        <code>v2.0.0b0</code> Amélioration de la gestion des images
        <hr>
        <pre>Lorsque l'image est affichée sur le site, elle est enregistrée dans le cache du navigateur 
pour les prochains accès. Or, lorsqu'on change les images (jusqu'à présent, les images 
étaient différentes mais avaient le même nom), le cache du navigateur n'est pas forcémment 
rechargé et on peut se retrouver avec les vieilles images. Pour certains cas, on rajoutait 
dans l'URL de l'image un numéro random pour qu'elle soit rechargée à chaque fois, mais avec 
cette solution le cache du navigateur ne sert plus à rien.</pre>
        <hr>
        Solution :
        <ul>
          <li>Numéro de version pour chaque image (utilisateur, équipes, photos d'équipes...)</li>
          <li>Incrémentation de la version à chaque changement d'image</li>
          Le cache du navigateur est utilisé complètement, et l'image est bien rechargée à chaque modification.
        </ul>
      </li>
    </ul>
  </li>
</ul>