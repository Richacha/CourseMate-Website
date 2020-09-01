"use strict";

let currentUser;
let allUserList;
let messageHistory;
let currentChatingFriend = null;

// TODO phase 2: obtain current user, all user list, message history from the server (downloeading all friends' profile pics to current folder)
currentUser = {
  id: "0",
  friendList: [
    {id: "1", firstName: "a", lastName: "Zhang", profileImage: "1.jpg"},
    {id: "2", firstName: "b", lastName: "Zhang", profileImage: "2.jpg"},
    {id: "3", firstName: "c", lastName: "Zhang", profileImage: "3.jpg"},
    {id: "4", firstName: "d", lastName: "Zhang", profileImage: "4.jpeg"},
    {id: "5", firstName: "e", lastName: "Zhang", profileImage: "5.jpeg"},
    {id: "6", firstName: "f", lastName: "Zhang", profileImage: "6.jpeg"},
  ],
  profileImage: "0.jpg"
};

allUserList = [
  {id: "0", firstName: "Haolin", lastName: "Zhang", profileImage: "0.jpg"},
  {id: "1", firstName: "a", lastName: "Zhang", profileImage: "1.jpg"},
  {id: "2", firstName: "b", lastName: "Zhang", profileImage: "2.jpg"},
  {id: "3", firstName: "c", lastName: "Zhang", profileImage: "3.jpg"},
  {id: "4", firstName: "d", lastName: "Zhang", profileImage: "4.jpeg"},
  {id: "5", firstName: "e", lastName: "Zhang", profileImage: "5.jpeg"},
  {id: "6", firstName: "f", lastName: "Zhang", profileImage: "6.jpeg"},
  {id: "7", firstName: "g", lastName: "Zhang", profileImage: "7.jpeg"},
  {id: "8", firstName: "g", lastName: "Zhang", profileImage: "8.jpeg"},
  {id: "9", firstName: "h", lastName: "Zhang", profileImage: "9.jpeg"},
  {id: "10", firstName: "h", lastName: "Zhang", profileImage: "10.jpeg"},
  {id: "11", firstName: "i", lastName: "Zhang", profileImage: "11.jpeg"},
  {id: "12", firstName: "j", lastName: "Zhang", profileImage: "12.jpeg"},
  {id: "13", firstName: "k", lastName: "Zhang", profileImage: "13.jpeg"},
  {id: "14", firstName: "k", lastName: "Zhang", profileImage: "14.jpeg"},
  {id: "15", firstName: "Haolin", lastName: "Zhang", profileImage: "15.jpg"},
  {id: "16", firstName: "a", lastName: "Zhang", profileImage: "16.jpg"}
];

messageHistory = [
  {
    chatters: ["0", "1"],
    history: [
      {sender: "0", message: "How are you?"},
      {sender: "0", message: "You ok?"},
      {sender: "1", message: "I am fine."}
    ]
  },
  {
    chatters: ["0", "2"],
    history: [
      {sender: "2", message: "You go class?"},
      {sender: "2", message: "Save a seat..."},
      {sender: "0", message: "Sure."}
    ]
  },
  {
    chatters: ["0", "3"],
    history: [
      {sender: "0", message: "I cannot come today!"},
      {sender: "3", message: "Why?"},
      {sender: "0", message: "Busy for due."}
    ]
  },
  {
    chatters: ["0", "4"],
    history: [
      {sender: "4", message: "I am sleepy."},
      {sender: "0", message: "Go home together?"},
      {sender: "4", message: "Yeah!!!"}
    ]
  },
  // {
  //   chatters: ["0", "5"],
  //   history: [
  //     {sender: "0", message: "Yo."},
  //     {sender: "0", message: "You there?"},
  //     {sender: "0", message: "Give me a call."}
  //   ]
  // },
  {
    chatters: ["0", "6"],
    history: [
      {sender: "6", message: "I don't undertand this question."},
      {sender: "6", message: "Give me some help."},
      {sender: "6", message: "Yo..."}
    ]
  },
];


// display all friends after loading the page
displayFriendList();

function displayFriendList() {
  const friendList = document.querySelector("#friendList");
  for (let i = 0; i < currentUser.friendList.length; i++) {
    const listRow = document.createElement("div");
    listRow.className = "listRow";
    const friendImage = document.createElement("img");
    friendImage.className = "friendImage";
    friendImage.src = currentUser.friendList[i].profileImage;
    const friendName = document.createElement("span");
    friendName.className = "friendName";
    friendName.addEventListener("click", showChatingMessage)
    const nameText = document.createTextNode(currentUser.friendList[i].firstName + " " + currentUser.friendList[i].lastName + "\xa0\xa0\xa0\xa0" + "id: " + currentUser.friendList[i].id);
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "btn btn-sm deleteButton";
    deleteButton.appendChild(document.createTextNode(" - "));
    deleteButton.addEventListener("click", deleteFriend);
    friendName.appendChild(nameText);
    listRow.appendChild(friendImage);
    listRow.appendChild(friendName);
    listRow.appendChild(deleteButton);
    friendList.appendChild(listRow);
  }
}


// when click on friend name, chating messages will appear
function showChatingMessage(e) {
  const targetString = e.target.textContent;
  const friendId = targetString.split(": ")[1];
  currentChatingFriend = friendId;

  // TODO phase 2: obtain message history between current user and this friend
  let chat = null;
  for (let i = 0; i < messageHistory.length; i++) {
    if (messageHistory[i].chatters.includes(friendId)) {
      chat = messageHistory[i];
      break;
    }
  }

  // find message history, display it
  const chatingMessages = document.querySelector("#chatingMessages")
  const userImage = currentUser.profileImage;
  let friendImage = null;
  for (let i = 0; i < currentUser.friendList.length; i++) {
    if (currentUser.friendList[i].id === friendId) {
      friendImage = currentUser.friendList[i].profileImage;
      break;
    }
  }

  // clear all current display in chatingMessages
  while (chatingMessages.children.length !== 0) {
    chatingMessages.removeChild(chatingMessages.firstElementChild);
  }


  // if no message history (never chat before), return immediately
  if (chat === null) {
    return;
  }


  for (let i = 0; i < chat.history.length; i++) {
    if (chat.history[i].sender === friendId) {
      const chatRow = document.createElement("div");
      chatRow.className = "chatRow";
      const chatLeftImage = document.createElement("img");
      chatLeftImage.className = "chatLeftImage";
      chatLeftImage.src = friendImage;
      const leftOneMessageContainer = document.createElement("div");
      leftOneMessageContainer.className = "leftOneMessageContainer";
      const oneMessage = document.createElement("div");
      oneMessage.className = "oneMessage";
      oneMessage.appendChild(document.createTextNode(chat.history[i].message));
      leftOneMessageContainer.appendChild(document.createElement("br"));
      leftOneMessageContainer.appendChild(oneMessage);
      chatRow.appendChild(chatLeftImage);
      chatRow.appendChild(leftOneMessageContainer);
      chatingMessages.appendChild(chatRow);
    } else {
      const chatRow = document.createElement("div");
      chatRow.className = "chatRow";
      const chatRightImage = document.createElement("img");
      chatRightImage.className = "chatRightImage";
      chatRightImage.src = userImage;
      const rightOneMessageContainer = document.createElement("div");
      rightOneMessageContainer.className = "rightOneMessageContainer";
      const oneMessage = document.createElement("div");
      oneMessage.className = "oneMessage";
      oneMessage.appendChild(document.createTextNode(chat.history[i].message));
      rightOneMessageContainer.appendChild(document.createElement("br"));
      rightOneMessageContainer.appendChild(oneMessage);
      chatRow.appendChild(chatRightImage);
      chatRow.appendChild(rightOneMessageContainer);
      chatingMessages.appendChild(chatRow);
    }
  }
}



// when click sendingTextButton, sended message will display in chatingMessages and also get recorded in messageHistory
document.querySelector("#sendingTextButton").addEventListener("click", sendMessage);

function sendMessage() {
  const sendingMessage = document.querySelector("#sendingTextArea").value;
  if (currentChatingFriend === null || sendingMessage === "") {
    return;
  }

  // display in chatingMessages
  const chatRow = document.createElement("div");
  chatRow.className = "chatRow";
  const chatRightImage = document.createElement("img");
  chatRightImage.className = "chatRightImage";
  chatRightImage.src = currentUser.profileImage;
  const rightOneMessageContainer = document.createElement("div");
  rightOneMessageContainer.className = "rightOneMessageContainer";
  const oneMessage = document.createElement("div");
  oneMessage.className = "oneMessage";
  oneMessage.appendChild(document.createTextNode(sendingMessage));
  rightOneMessageContainer.appendChild(document.createElement("br"));
  rightOneMessageContainer.appendChild(oneMessage);
  chatRow.appendChild(chatRightImage);
  chatRow.appendChild(rightOneMessageContainer);
  chatingMessages.appendChild(chatRow);

  // find this chat in messageHistory
  let chat = null;
  for (let i = 0; i < messageHistory.length; i++) {
    if (messageHistory[i].chatters.includes(currentChatingFriend)) {
      chat = messageHistory[i];
      break;
    }
  }

  // no past messages
  if (chat === null) {
    const newChat = {
        chatters: [currentUser.id, currentChatingFriend],
        history: [
          {sender: currentUser.id, message: sendingMessage}
        ]
    };

    // TODO phase 2: upload this new chat to server
    messageHistory.push(newChat);
    return;
  }

  // TODO phase 2: update this chat
  chat.history.push({sender: currentUser.id, message: sendingMessage});
}



// when searchButton is clicked, all users with same searched full name will display in strangerList
document.querySelector("#searchButton").addEventListener("click", searchForStranger);

function searchForStranger() {
  const searchedFullName = document.querySelector("#userSearch").value;
  const seperatedName = searchedFullName.split(" ");

  // TODO phase 2: obtain strangers named searchedFullName and also dowanload their profile pic
  const friendIdList = currentUser.friendList.map(function (friend) {
    return friend.id;
  });
  const targetUserList = allUserList.filter(function (user) {
    return (user.firstName === seperatedName[0]) && (user.lastName === seperatedName[1]) && (user.id !== currentUser.id) && !(friendIdList.includes(user.id));
  })

  // clear all current display in strangerList
  const strangerList = document.querySelector("#strangerList");
  while (strangerList.children.length !== 0) {
    strangerList.removeChild(strangerList.firstElementChild);
  }

  // add each stranger in targetUserList to strangerList
  for (let i = 0; i < targetUserList.length; i++) {
    const listRow = document.createElement("div");
    listRow.className = "listRow";
    const friendImage = document.createElement("img");
    friendImage.className = "friendImage";
    friendImage.src = targetUserList[i].profileImage;
    const friendName = document.createElement("a");
    friendName.className = "friendName";
    // redirect to userInfoDisplay html page to display this stranger's info
    friendName.href = "../userInfoDisplay/userInfoDisplay.html";
    friendName.appendChild(document.createTextNode(searchedFullName + "\xa0\xa0\xa0\xa0" + "id: " + targetUserList[i].id));
    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.className = "btn btn-sm addButton";
    addButton.appendChild(document.createTextNode("+ Add"));
    addButton.addEventListener("click", makeFriend);
    listRow.appendChild(friendImage);
    listRow.appendChild(friendName);
    listRow.appendChild(addButton);
    strangerList.appendChild(listRow);
  }
}


// when click deleteButton, delete friend from currentUser.friendList
function deleteFriend(e) {
  const oldFriendId = e.target.previousSibling.textContent.split(": ")[1];

  // remove e.target from friendList
  document.querySelector("#friendList").removeChild(e.target.parentElement);

  // TODO phase 2: delete this friend from currentUser.friendList and upload this update to user
  for (let i = 0; i < currentUser.friendList.length; i++) {
    if (currentUser.friendList[i].id === oldFriendId) {
      currentUser.friendList.splice(i, 1);
      break;
    }
  }

  // delete all current display of chat with this deleted friend in chatingMessages
  const chatingMessages = document.querySelector("#chatingMessages");
  while (chatingMessages.children.length !== 0) {
    chatingMessages.removeChild(chatingMessages.firstElementChild);
  }
}


// when click addButton, add stranger to currentUser.friendList
function makeFriend(e) {
  const newFriendId = e.target.previousSibling.textContent.split(": ")[1];

  // remove e.target from strangerList
  document.querySelector("#strangerList").removeChild(e.target.parentElement);

  // TODO phase 2: obtain the whole user object with id newFriendId
  const newFriend = allUserList.filter(function (user) {
    return user.id === newFriendId;
  })[0];

  // TODO phase 2: add newFriend to currentUser.friendList and upload to server
  currentUser.friendList.push(newFriend);

  // display newFriend at beginning of friendList
  const friendList = document.querySelector("#friendList");
  const listRow = document.createElement("div");
  listRow.className = "listRow";
  const friendImage = document.createElement("img");
  friendImage.className = "friendImage";
  friendImage.src = newFriend.profileImage;
  const friendName = document.createElement("span");
  friendName.className = "friendName";
  friendName.addEventListener("click", showChatingMessage)
  const nameText = document.createTextNode(newFriend.firstName + " " + newFriend.lastName + "\xa0\xa0\xa0\xa0" + "id: " + newFriend.id);
  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "btn btn-sm deleteButton";
  deleteButton.appendChild(document.createTextNode(" - "));
  deleteButton.addEventListener("click", deleteFriend);
  friendName.appendChild(nameText);
  listRow.appendChild(friendImage);
  listRow.appendChild(friendName);
  listRow.appendChild(deleteButton);
  friendList.insertBefore(listRow, friendList.firstElementChild);
}
