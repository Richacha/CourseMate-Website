"use strict";
const log = console.log;

let currentUser;
let currentChatingFriend = null;
let currentUserFriends;
let targetUserList;
let chat;

// display all friends after loading the page
displayFriendList();


function displayFriendList() {
  const url = '/friendList/userinfo';

  fetch(url)
  .then((res) => {
      if (res.status === 200) {
         return res.json()
     } else {
          alert('Could not get user info')
     }
  })
  .then((json) => {
    currentUser = json
    return Promise.resolve("get current user done")
  }).then((result) => {
      const url = "/friendList/friends";

      const request = new Request(url, {
          method: 'POST',
          body: JSON.stringify({"list": currentUser.friendList}),
          headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
          },
      });
      fetch(request).then((friends) => {
        return friends.json()
      }).then((friends) => {
        currentUserFriends = friends

        const friendList = document.querySelector("#friendList");
        const oldLength = friendList.children.length
        for (let i = 0; i < oldLength; i++) {
          friendList.removeChild(friendList.lastElementChild)
        }


        for (let i = 0; i < currentUserFriends.length; i++) {
          const listRow = document.createElement("div");
          listRow.className = "listRow";
          const friendImage = document.createElement("img");
          friendImage.className = "friendImage";
          friendImage.src = currentUserFriends[i].profileImage;
          friendImage.addEventListener("click", showFriendProfile)
          const friendName = document.createElement("span");
          friendName.className = "friendName";
          friendName.addEventListener("click", showChatingMessage)
          const nameText = document.createTextNode(currentUserFriends[i].firstName + " " + currentUserFriends[i].lastName);
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
      })

  }).catch((error) => {
      console.log(error)
  })
}


function showFriendProfile(e) {
  const index = Array.prototype.indexOf.call(e.target.parentElement.parentElement.children, e.target.parentElement)
  const friendId = currentUserFriends[index]._id

  const url = '/userInfoDisplay/changeUserDisplayedId';
  // The data we are going to send in our request
  let data = {
      userDisplayedId: friendId
  }
  // Create our request constructor with all the parameters we need
  const request = new Request(url, {
      method: 'post',
      body: JSON.stringify(data),
      headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
      },
  });
  fetch(request)
  .then(function(res) {
    window.location.href = "/userInfoDisplay/webpage"
  }).catch((error) => {
      console.log(error)
  })
}



function showStrangerProfile(e) {
  const index = Array.prototype.indexOf.call(e.target.parentElement.parentElement.children, e.target.parentElement)
  const strangerId = targetUserList[index]._id

  const url = '/userInfoDisplay/changeUserDisplayedId';
  // The data we are going to send in our request
  let data = {
      userDisplayedId: strangerId
  }
  // Create our request constructor with all the parameters we need
  const request = new Request(url, {
      method: 'post',
      body: JSON.stringify(data),
      headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
      },
  });
  fetch(request)
  .then(function(res) {
    window.location.href = "/userInfoDisplay/webpage"
  }).catch((error) => {
      console.log(error)
  })
}






// when click on friend name, chating messages will appear
function showChatingMessage(e) {
  const index = Array.prototype.indexOf.call(e.target.parentElement.parentElement.children, e.target.parentElement)
  const friendId = currentUserFriends[index]._id
  currentChatingFriend = currentUserFriends[index]

  const url = '/friendList/friendChat/' + friendId;

  fetch(url)
  .then((res) => {
    log(res.status)
      if (res.status === 200) {
         return res.json()
     } else {
          alert('Could not get friend chat')
     }
  })
  .then((json) => {
      chat = json[0];
      const chatingMessages = document.querySelector("#chatingMessages")
      // clear all current display in chatingMessages
      while (chatingMessages.children.length !== 0) {
        chatingMessages.removeChild(chatingMessages.firstElementChild);
      }
      for (let i = 0; i < chat.history.length; i++) {
        if (chat.history[i].sender === friendId) {
          const chatRow = document.createElement("div");
          chatRow.className = "chatRow";
          const chatLeftImage = document.createElement("img");
          chatLeftImage.className = "chatLeftImage";
          chatLeftImage.src = currentChatingFriend.profileImage;
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
          chatRightImage.src = currentUser.profileImage;
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
  }).catch((error) => {
      console.log(error)
  })
}



// when click sendingTextButton, sended message will display in chatingMessages and also get recorded in messageHistory
document.querySelector("#sendingTextButton").addEventListener("click", sendMessage);

function sendMessage() {
  const sendingMessage = document.querySelector("#sendingTextArea").value;
  if (currentChatingFriend === null || sendingMessage === "") {
    return;
  }

  const url = '/friendList/sendMessage/';
  // The data we are going to send in our request
  let data = {
      friendId: currentChatingFriend._id,
      message: sendingMessage
  }
  // Create our request constructor with all the parameters we need
  const request = new Request(url, {
      method: 'post',
      body: JSON.stringify(data),
      headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
      },
  });
  fetch(request)
  .then(function(res) {
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
    document.querySelector("#sendingTextArea").value = "";
  }).catch((error) => {
      console.log(error)
  })
}



// when searchButton is clicked, all users with same searched full name will display in strangerList
document.querySelector("#searchButton").addEventListener("click", searchForStranger);

function searchForStranger() {
  const searchedFullName = document.querySelector("#userSearch").value;
  const seperatedName = searchedFullName.split(" ");
  const url = "/friendList/userinfo/" + seperatedName[0] + "/" + seperatedName[1]

  fetch(url)
  .then((res) => {
      if (res.status === 200) {
         return res.json()
     } else {
          alert('Could not get students')
     }
  })
  .then((json) => {
      targetUserList = json

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
        friendImage.addEventListener("click", showStrangerProfile)
        const friendName = document.createElement("a");
        friendName.className = "friendName";
        // redirect to userInfoDisplay html page to display this stranger's info
        friendName.href = "";
        friendName.style = "pointer-events: none; cursor: default;";
        friendName.appendChild(document.createTextNode(searchedFullName));
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
  }).catch((error) => {
      console.log(error)
  })
}


// when click deleteButton, delete friend from currentUser.friendList
function deleteFriend(e) {
  const index = Array.prototype.indexOf.call(e.target.parentElement.parentElement.children, e.target.parentElement)
  const oldFriendId = currentUserFriends[index]._id

  // remove e.target from friendList
  document.querySelector("#friendList").removeChild(e.target.parentElement);

  const url = '/friendList/deleteFriend/' + oldFriendId;

  // Create our request constructor with all the parameters we need
  const request = new Request(url, {
      method: 'PATCH',
      body: JSON.stringify({}),
      headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
      },
  });
  fetch(request)
  .then(function(res) {
      // delete all current display of chat with this deleted friend in chatingMessages
      const chatingMessages = document.querySelector("#chatingMessages");
      while (chatingMessages.children.length !== 0) {
        chatingMessages.removeChild(chatingMessages.firstElementChild);
      }
      displayFriendList();
  }).catch((error) => {
      console.log(error)
  })
}


// when click addButton, add stranger to currentUser.friendList
function makeFriend(e) {
  const index = Array.prototype.indexOf.call(e.target.parentElement.parentElement.children, e.target.parentElement)
  const strangerId = targetUserList[index]._id

  // remove e.target from strangerList
  document.querySelector("#strangerList").removeChild(e.target.parentElement);
  const url = '/friendList/makeFriend/' + strangerId;

  // Create our request constructor with all the parameters we need
  const request = new Request(url, {
      method: 'PATCH',
      body: JSON.stringify({}),
      headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
      },
  });
  fetch(request)
  .then(function(res) {
      displayFriendList();
  }).catch((error) => {
      console.log(error)
  })
}
