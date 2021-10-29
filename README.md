# Sermo code test

Läs igenom **hela** detta dokument noggrant så du inte missar någonting. Kom ihåg att ha kul :)

## Problemet

Vi vill att du bygger ett REST API som hanterar CRUD (`create/read/update/delete`) på nedan beskriven modell.

### User Model

```
{
  "id": "xxx",                  // user ID (unikt)
  "username": "github",         // username
  "email": "hello@world.com",   // email address
  "profilePictureUrl": "http://gravatar.com/avatar/sxcvxfadfsa", //Se nedan
  "topStarredRepositories": [] // Se nedan
}
```

## Gravatar

Vi vill att du hämtar en profilbilds url från Gravatar för användaren. Se dokumentation här https://gravatar.com/site/implement/images/

## Github

Vi vill att du hämtar top starred repos från Github för användaren (se api.github.com)

## Avgränsningar

- Du behöver inte implementera någon databas.

### Saker vi tycker är viktiga

_Vi är framförallt intresserade över hur du tar dig an problemet och ditt tankesätt, absolut mer än slutresultatet._

Använd de bibliotek som du tycker är rimliga att använda om detta var en produktionsapplikation. Vi dock är ute efter din kod och dina tankesätt, inte att se hur många bibliotek du kan använda för att abstrahera bort problemet.

Du bör sträva efter så produktionslik kod som möjligt. Genvägar eller förenklingar är helt okej, men då bör du kunna förklara ditt resonemang för oss under genomgång.

### Inlämning

När du anser dig vara klar, gör en pull request mot detta repo så kikar vi igenom det och bokar in en tidsslot för genomgång tillsammans med dig. Under genomgången kommer vi be dig att gå igenom din applikation som om det vore en överlämning till ett annat team.

hepp