'use strict'

const { validate: uuidValidate } = require('uuid');
// const { v4: uuidv4 } = require('uuid');
const { test } = require('tap')
const { build } = require('../helper')

test('post is not broken', async (t) => {
  const app = build(t)

  const res = await app.inject({
    url: '/user',
    method: 'POST',
    payload: {
      username: "upnger",
      email: "pilskytten@hotmail.com"
    }
  })
  const user = JSON.parse(res.payload)
  t.equal(user.username, 'upnger')
  t.equal(user.email, 'pilskytten@hotmail.com')
  t.equal(uuidValidate(user.id), true)
  t.equal(user.profilePictureUrl, 'https://www.gravatar.com/avatar/0c25c4286435728b17b2b0aa16d6cc18')
  if (user.topStarredRepositories) {
    t.type(user.topStarredRepositories, Array)
  }

})

test('get is not broken ', async (t) => {
  const app = build(t)

  const res = await app.inject({
    url: '/user',
    method: 'GET',
  })
  const userArray = JSON.parse(res.payload)
  t.type(userArray, Array)

})
