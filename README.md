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
}
```

Vid listning av användare vill vi dessutom få ytterligare attribut på en user:
"profilePictureUrl" - Detta skulle kunna hämtas från t ex Gravatar (se dokumentation https://sv.gravatar.com/site/implement/images/)
"topStarredRepositories" - Top starred repos från Github för användaren

### Funktionalitet

Vi förväntar oss att följande funktionalitet är implementerad:

- APIet följer typiskta RESTful API design patterns
- Felhantering

### Saker vi tycker är viktiga

_Vi är framförallt intresserade över hur du tar dig an problemet och ditt tankesätt, absolut mer än slutresultatet._

Använd de bibliotek som du tycker är rimliga att använda om detta var en produktionsapplikation. Vi dock är ute efter din kod och dina tankesätt, inte att se hur många bibliotek du kan använda för att abstrahera bort problemet.

Saker du bör ta med i ditt tankesätt:

- Din kod bör vara ren, tydlig och enkel att extenda vid behov.
- Stabil testning och testapproach
- Använd dig av design best practices för ditt API

### Inlämning

När du anser dig vara klar, gör en pull request mot detta repo så kikar vi igenom det och bokar in en tidsslot för genomgång tillsammans med dig. Under genomgången kommer vi be dig att gå igenom din applikation som om det vore en överlämning till ett annat team.
