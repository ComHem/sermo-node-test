# Sermo code test

## Setup

1. Install [NVM - Node Version Manager](https://github.com/nvm-sh/nvm)
   - We use NVM to make sure we're all using the same Node.js and NPM versions
2. `git clone` this project and `cd` into the project directory
3. Switch to the Node.js and NPM versions used by this project: `nvm use --latest-npm`
4. Install NPM dependencies: `npm install`
5. Copy the `.env.example` file to create `.env` and replace the values with your development values
6. List available project scripts: Run `npm run` or look in `package.json`
   - To get started you probably want to run `test`, `build` and `start`.

## Environment variables

Environment variables used by the project are loaded by [dotenv](https://www.npmjs.com/package/dotenv) from the `.env` file.

The `.env` file is used when you are developing locally, when deployed to production the environment variables will be set by a secrets manager.

Document all the environment variables in the `.env.example` file. That file is used for creating the `.env` file when setting up the project.

---

# ORIGINAL README BELOW

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
