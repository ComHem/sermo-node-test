# Sermo code test
Detta repo är en fork på tele2/conhem repot som gjorde i samband med intervju.

Jag valde att bygga REST API:et med fastify. Fastify liknar express vilket gör att många utvecklare känner igen sig och sätter in sig snabbt men att man ändå får enkel tillgång till enligt mig viktiga funktioner som tex validering av ingående och utgående data.
För testning valde jag att använda tap som är det verktyg för testning fastify använder i sin boilerplate. Hade det varit ett riktigt projekt hade jag nog valt jest.

## Quick start

För att komma igång kör
```
npm run dev
```
Detta startar api:et i utvecklar läge vilket innebär att den automatiskt startar om varje gång du ändrar koden.
för att komma åt api:et besök http://127.0.0.1:3000 eller http://127.0.0.1:3000/user 

## Uppgiften
> # Sermo code test
> 
> Läs igenom **hela** detta dokument noggrant så du inte missar någonting. Kom ihåg att ha kul :)
> 
> ## Problemet
> 
> Vi vill att du bygger ett REST API som hanterar CRUD (`create/read/update/delete`) på nedan beskriven modell.
> 
> ### User Model
> 
> ```
> {
>   "id": "xxx",                  // user ID (unikt)
>   "username": "github",         // username
>   "email": "hello@world.com",   // email address
>   "profilePictureUrl": "http://gravatar.com/avatar/sxcvxfadfsa", //Se nedan
>   "topStarredRepositories": [] // Se nedan
> }
> ```
> 
> ## Gravatar
> 
> Vi vill att du hämtar en profilbilds url från Gravatar för användaren. Se dokumentation här https://gravatar.com/site/implement/images/
> 
> ## Github
> 
> Vi vill att du hämtar top starred repos från Github för användaren (se api.github.com)
> 
> ## Avgränsningar
> 
> - Du behöver inte implementera någon databas.
> 
> ### Saker vi tycker är viktiga
> 
> _Vi är framförallt intresserade över hur du tar dig an problemet och ditt tankesätt, absolut mer än slutresultatet._
> 
> Använd de bibliotek som du tycker är rimliga att använda om detta var en produktionsapplikation. Vi dock är ute efter din kod och dina tankesätt, inte att se hur många bibliotek du kan använda för att abstrahera bort problemet.
> 
> Du bör sträva efter så produktionslik kod som möjligt. Genvägar eller förenklingar är helt okej, men då bör du kunna förklara ditt resonemang för oss under genomgång.
> 
> ### Inlämning
> 
> När du anser dig vara klar, gör en pull request mot detta repo så kikar vi igenom det och bokar in en tidsslot för genomgång tillsammans med dig. Under genomgången kommer vi be dig att gå igenom din applikation som om det vore en överlämning till ett annat team.
