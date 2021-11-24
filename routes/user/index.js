'use strict'

const axios = require('axios').default;
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto')

// in-memory database mock
function initDatabase(params) {
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
    findUser: (id) => Users.find(user => user.id == id)
  }
}

const db = initDatabase();

async function getTopStarredRepositories(username) {
  if (!username) {
    return []
  }
  try {
    const { data } = await axios.get('https://api.github.com/users/' + username + '/repos?sort=stargazers_count&per_page=5')
    return data

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
module.exports = async function (fastify, opts) {

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
  }, async function (request, reply) {
    const dbUsers = db.getUsers()

    const fullUsersPromise = addTopStarredRepositoriesToUsers(dbUsers)

    if (request.query.hasTopStarredRepositories) {
      return await fullUsersPromise.filter(user => user.topStarredRepositories && topStarredRepositories.length)
    }
    return fullUsersPromise
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
  }, async function (request, reply) {
    const newUser = request.body
    newUser.profilePictureUrl = getProfilePictureUrl(newUser.email)
    const savedUser = db.saveUser(newUser)
    return addTopStarredRepositories(savedUser)
  })

}
