const users = []



// join to chat
const userJoin = (id, username, room) => {
  const user = { id, username, room }

  users.push(user)

  return user

}

// get current user

const getCurrentUser = (id) => {
  return users.find(user => user.id === id)
}

// User Leav Chat

const userLeave = (id) => {
  const index = users.findIndex(user => user.id === id)

  if (index !== -1) {
    return users.splice(index, 1)[0]
  }
}
// GEt room users

const getRoomUser = (room) => {
  return users.filter(user => user.room === room)
}


module.exports = {
  getCurrentUser,
  userJoin,
  userLeave,
  getRoomUser
}