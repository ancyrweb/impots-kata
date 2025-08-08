# Workshop DDD AncyrAcademy

## Session 1

Pour calculer le prix d'un trajet, l'algorithme prend en compte la distance parcouru et le multiplie par un taux fixe. Ce taux fixe varie selon que la course est intra-muros ou extra-muros.
Dans le cadre d'un trajet intra-muros, ce tarif est de 1.2€ par km. Si extra-muros, le prix passe à 1.65€ par km.

Notions : Value Objects, Domain Objects.

## Session 2

### Exercice 1

Le taux à appliquer selon la situation (intramuros/extramuros) n'est plus fixe. 
Il doit désormais être récupéré depuis un système tier.

Les utilisateurs peuvent désormais préciser si la distance du trajet est en mètres ou en kilomètres.

Le prix de retour peut-être en euros ou en dollars selon le besoin de l'utilisateur. Le taux de change est également calculé depuis un système tier.

### Exercice 2

Un usager obtient une réduction de 10% sur son trajet s'il a déjà pris 2 trajets au cours du mois. 
En d'autres termes, chaque mois, après 2 trajets, tous les autres trajets pris au cours du moins offrent -10% à l'usager.

Hint : il faudra certainement sauvegarder l'information des trajets effectués par l'utilisateur identifié par `userId`.

Notions : Value Objects, Application Services, Domain Services, Repositories, Entities.

## Session 3

### Exercice 1


L'utilisateur ne peut désormais plus indiquer en paramètre une distance mais plutôt un point de départ et un point d'arrivée.

Il peut fournir cette information sous deux formes :

- Avec deux coordonnées géographiques (longitude / latitude)
- Avec deux adresses postales

L'application doit-être capable de gérer les deux et de convertir cette information en un objet Distance. Pour l'instant, cela se fera via un objet situé dans l'infrastructure (un Geocoder)

Exemple d'appel :
```json
{
  "path": {
    "type": "addresses",
    "from": "123 Main St, Paris",
    "to": "456 Elm St, Lyon"
  },
  "currency": "EUR",
  "userId": "johndoe"
}
```

```json
{
  "path": {
    "type": "geographic-points",
    "from": {
      "latitude": 48.8566,
      "longitude": 2.3522
    },
    "to": {
      "latitude": 45.7640,
      "longitude": 4.8357
    }
  },
  "currency": "EUR",
  "userId": "johndoe"
}
```

### Exercice 2

Le Geocoder ne retourne plus une Distance mais une série de segments représentant le chemin à suivre (indiqué dans le code ci-dessous).

Vous aurez besoin de transformer cette série de segments en objets de votre domaine.

Calculez le prix à partir de ces nouvelles informations. Notez que le prix au kilomètre reste toujours le même (selon qu'il s'agisse d'un segment urbain ou rural). 
Prenez également en compte le prix du péage.


```json
[
  {
    "type": "departure",
    "city": "Paris"
  },
  {
    "type": "urban-road",
    "distance": 411
  },
  {
    "type": "urban-road",
    "distance": 1443
  },
  {
    "type": "exit",
    "city": "Paris"
  },
  {
    "type": "toll",
    "price": 4.50,
    "currency": "EUR"
  },
  {
    "type": "highway",
    "distance": 27
  },
  {
    "type": "entrance",
    "city": "Bourges"
  },
  {
    "type": "urban-road",
    "distance": 4657
  },
  {
    "type": "arrival",
    "city": "Bourges"
  }
]
```

La représentation possède les contraintes suivantes :
- Urban Road = URBAN (le prix au km est de 1.2€)
- Highway = RURAL (le prix au km est de 1.65€)
- La distance de Urban Road est en mètres
- La distance de Highway est en kilomètres
- Le prix du péage s'ajoute au prix total
- Le prix du péage est toujours en Euros

**Astuce**

A partir de ce moment là, je vous recommande d'écrire des tests bien placés et de produire différents scénarios (comme celui présenté à droite). 
Ce sera plus simple de tester les différents cas possible et de réaliser l'exercice suivant.

Testez depuis le point le plus extérieur sans passer par l'infrastructure : ciblez directement le service PriceCalculator.


### Exercice 3

Le calcul du prix dépend du type de trajet.

- Le prix au km dans Marseille est de 1.70€ / km
- Le prix au km dans Paris est de 1.25€ / km
- Dans les autres villes, le prix est de 1.2€ / km
- Le prix à l'extérieur des villes (autoroutes) ne change pas (1.65€ / km)

### Exercice 4

- Le prix au km dans Paris est de 1.25€ / km pour les 10 premiers kilomètres, puis 1€ par km