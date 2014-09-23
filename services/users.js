var tags = {
  1: {id: 1, name: "tag1"},
  2: {id: 2, name: "tag2"},
  3: {id: 3, name: "tag3"},
  4: {id: 4, name: "tag4"}};

var categories = {
  1: {id: 1, name: "Dogs"},
  2: {id: 2, name: "Cats"},
  3: {id: 3, name: "Rabbits"},
  4: {id: 4, name: "Lions"}};

var users = {
  1: {id: 1, 
		  category: categories[2], 
		  name: "Cat 1", 
		  urls: ["url1", "url2"], 
		  tags: [tags[1], tags[2]],
		  status: "available"},
  2: {id: 2, 
      category: categories[2], 
      name: "Cat 2", 
      urls: ["url1", "url2"], 
      tags: [tags[2], tags[3]],
      status: "available"},
  3: {id: 3, 
      category: categories[2], 
      name: "Cat 3", 
      urls: ["url1", "url2"], 
      tags: [tags[3], tags[4]],
      status: "available"},
  4: {id: 4, 
      category: categories[1], 
      name: "Dog 1", 
      urls: ["url1", "url2"], 
      tags: [tags[1], tags[2]],
      status: "available"},
  5: {id: 5, 
      category: categories[1], 
      name: "Dog 2", 
      urls: ["url1", "url2"], 
      tags: [tags[2], tags[3]],
      status: "available"},
  6: {id: 6, 
      category: categories[1], 
      name: "Dog 3", 
      urls: ["url1", "url2"], 
      tags: [tags[3], tags[4]],
      status: "available"},
  7: {id: 7, 
      category: categories[4], 
      name: "Lion 1", 
      urls: ["url1", "url2"], 
      tags: [tags[1], tags[2]],
      status: "available"},
  8: {id: 8, 
      category: categories[4], 
      name: "Lion 2", 
      urls: ["url1", "url2"], 
      tags: [tags[2], tags[3]],
      status: "available"},
  9: {id: 9, 
      category: categories[4], 
      name: "Lion 3", 
      urls: ["url1", "url2"], 
      tags: [tags[3], tags[4]],
      status: "available"},
  10: {id: 10, 
      category: categories[3], 
      name: "Rabbit 1", 
      urls: ["url1", "url2"], 
      tags: [tags[3], tags[4]],
      status: "available"}
};

exports.getUserById = function getUserById(id) {
  return users[id];
}

exports.addUser = function addUser(user){
  users[user.id] = user;
}

exports.deleteUser = function deleteUser(id) {
  delete users[id];
}