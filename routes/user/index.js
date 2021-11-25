'use strict'

const axios = require('axios').default;
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto')

// in-memory database mock
function initDatabase() {
  const Users = []
  return {
    getUsers: () => Users.map(user => ({ ...user })),
    saveUser: (newUser) => {
      const userToSave = {
        ...newUser,
        id: uuidv4()
      }
      Users.push(userToSave)
      return userToSave
    },
    findUser: (id) => Users.find(user => user.id == id),
    removeUser: (id) => {
      const index = Users.findIndex(user => user.id == id)
      if (index === -1) {
        return undefined
      }
      return Users.splice(index, 1)[0]
    },
    updateUser: (userChanges) => {
      const dbUser = Users.find(user => user.id == userChanges.id)
      if (!dbUser) {
        return undefined
      }
      Object.assign(dbUser, userChanges)
      return { ...dbUser }
    }
  }
}

const db = initDatabase();
const githubPerPage = 100;
async function getAllRepos(username, startPageNumber = 1) {
  const { data: repos } = await axios.get(`https://api.github.com/users/${username}/repos?per_page=${githubPerPage}`)
  console.log(repos, `https://api.github.com/users/${username}/repos?per_page=${githubPerPage}`);
  if (repos.length < githubPerPage) {
    return repos
  }
  return [...repos, ...getAllRepos(username, startPageNumber + 1)]
}

async function getTopStarredRepositories(username, limit = 5) {
  if (!username) {
    return []
  }
  try {
    const repos = await getAllRepos(username);
    repos.sort((repoA, repoB) => repoB.stargazers_count - repoA.stargazers_count)
    return repos.slice(0, limit)

  } catch (error) {
    if (error.response?.status) {
      return undefined
    }
    throw error
  }
}

function getProfilePictureUrl(email) {
  const hash = crypto.createHash('md5').update(email).digest("hex")
  return 'https://www.gravatar.com/avatar/' + hash
}

async function addTopStarredRepositories(user) {
  return {
    ...user,
    topStarredRepositories: await getTopStarredRepositories(user.username)
  }
}

function addTopStarredRepositoriesToUsers(users) {
  const promises = users.map(addTopStarredRepositories)
  return Promise.all(promises)
}

const userSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: "uuid" },
    username: { type: 'string' },
    email: { type: 'string', format: "email" },
    profilePictureUrl: { type: 'string', format: "uri" },
    topStarredRepositories: {
      type: 'array', items: {
        type: 'object', properties: {
          name: { type: 'string' },
          stargazers_count: { type: 'number' }
        }
      }
    },
  }
}
module.exports = async function (fastify) {

  fastify.get('/', {
    schema: {
      querystring: {
        hasTopStarredRepositories: { type: 'boolean', default: false },
      },
      response: {
        200: {
          type: 'array',
          items: userSchema
        }
      }
    }
  }, async function (request) {
    const dbUsers = db.getUsers()

    const fullUsersPromise = addTopStarredRepositoriesToUsers(dbUsers)

    if (request.query.hasTopStarredRepositories) {
      return await fullUsersPromise.filter(user => user.topStarredRepositories && user.topStarredRepositories.length)
    }
    return fullUsersPromise
  })
  fastify.get('/:id', {
    schema: {
      params: {
        id: { type: 'string', format: "uuid" }
      },
      response: {
        200: userSchema
      }
    }
  }, async function (request) {
    const dbUser = db.findUser(request.params.id)
    if (!dbUser) {
      return fastify.httpErrors.notFound()
    }
    return addTopStarredRepositories(dbUser)
  })

  fastify.post('/', {
    schema: {
      body: {
        type: 'object',
        properties: {
          username: { type: 'string' },
          email: { type: 'string', format: "email" },
        },
        required: ['username', 'email']
      },
      response: {
        200: userSchema
      }
    }
  }, async function (request) {
    const newUser = request.body
    newUser.profilePictureUrl = getProfilePictureUrl(newUser.email)
    const savedUser = db.saveUser(newUser)
    return addTopStarredRepositories(savedUser)
  })

  fastify.delete('/:id', {
    schema: {
      params: {
        id: { type: 'string', format: "uuid" }
      },
      response: {
        200: { userSchema }
      }
    }
  }, async function (request) {
    const dbUser = db.removeUser(request.params.id)
    if (!dbUser) {
      return fastify.httpErrors.notFound()
    }
    return dbUser
  })

  fastify.put('/', {
    schema: {
      body: {
        type: 'object',
        properties: {
          id: { type: 'string', format: "uuid" },
          username: { type: 'string' },
          email: { type: 'string', format: "email" },
        },
        required: ['id']
      },
      response: {
        200: userSchema
      }
    }
  }, async function (request) {
    const updatedUser = db.updateUser(request.body)
    if (!updatedUser) {
      return fastify.httpErrors.notFound()
    }
    return addTopStarredRepositories(updatedUser)
  })

}
