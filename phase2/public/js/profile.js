"use strict";

let currentUser;

// display user info after loading the page
displayInfo();

function displayInfo() {

  const url = '/profile/userinfo';

  fetch(url)
  .then((res) => {
      if (res.status === 200) {
         return res.json()
     } else {
          alert('Could not get user info')
     }
  })
  .then((json) => {
      currentUser = json.user
      // profilePic
      document.querySelector("#profilePic").src = currentUser.profileImage;

      // infoForm part
      const infoForm = document.querySelector("#infoForm");
      const infoFormChildren = infoForm.children;
      for (let i = 0; i < infoFormChildren.length; i++) {
        const span = infoFormChildren[i].children[1];
        const textNode = document.createTextNode(currentUser[span.id]);
        span.appendChild(textNode);
      }

      // descriptionForm part
      const studyGroupList = document.querySelector("#studyGroupList");
      const tbody1 = studyGroupList.firstElementChild;
      const userStudyGroupList = currentUser.studyGroupList;
      for (let i = 0; i < userStudyGroupList.length; i++) {
        const newRow = document.createElement("tr");
        const studyGroupNameCell = document.createElement("td");
        const courseCodeCell = document.createElement("td");
        const numberOfMembersCell = document.createElement("td");

        const studyGroupNameLink = document.createElement("a");
        studyGroupNameLink.id = userStudyGroupList[i]._id
        studyGroupNameLink.appendChild(document.createTextNode(userStudyGroupList[i].groupName));
        studyGroupNameCell.appendChild(studyGroupNameLink);
        studyGroupNameLink.addEventListener("click", linkToGroup)
        studyGroupNameLink.href = ""

        courseCodeCell.appendChild(document.createTextNode(userStudyGroupList[i].courseCode));
        numberOfMembersCell.appendChild(document.createTextNode(userStudyGroupList[i].members.length));

        newRow.appendChild(studyGroupNameCell);
        newRow.appendChild(courseCodeCell);
        newRow.appendChild(numberOfMembersCell);
        tbody1.appendChild(newRow);
      }
      const courseList = document.querySelector("#courseList");
      const tbody2 = courseList.firstElementChild;
      const userCourseList = currentUser.courseList;
      for (let i = 0; i < userCourseList.length; i++) {
        const newRow = document.createElement("tr");
        const courseCodeCell = document.createElement("td");
        const courseNameCell = document.createElement("td");
        const sectionCell = document.createElement("td");
        const lecturerCell = document.createElement("td");

        courseCodeCell.appendChild(document.createTextNode(userCourseList[i].courseCode));
        courseNameCell.appendChild(document.createTextNode(userCourseList[i].courseName));
        sectionCell.appendChild(document.createTextNode(userCourseList[i].section));
        lecturerCell.appendChild(document.createTextNode(userCourseList[i].lecturer));

        newRow.appendChild(courseCodeCell);
        newRow.appendChild(courseNameCell);
        newRow.appendChild(sectionCell);
        newRow.appendChild(lecturerCell);
        tbody2.appendChild(newRow);
      }
      document.querySelector("#honour").appendChild(document.createTextNode(currentUser.honour));
      document.querySelector("#hobby").appendChild(document.createTextNode(currentUser.hobby));

  }).catch((error) => {
      console.log(error)
  })

}



function linkToGroup(e){
  e.preventDefault();
  let id = e.target.id
  let request = new Request('/groups/group', {
        method: 'post', 
        body: JSON.stringify({id: id}),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });
    fetch(request)
    .then(function(res) {
        if (res.status === 200) {
            return res.json()           
        } else {
        alert("Cannot update")
        }
    }).then((json) => {
      window.location.href = "/groupPage/webpage"
      return json;
  }).catch((error) => {
        console.log(error)
    })
}

// button listener action
document.querySelector("#button").addEventListener("click", updateInfo);

function updateInfo(e) {
  e.preventDefault();

  // replace all span in infoForm to input
  const spanTextList = document.querySelectorAll(".spanText");
  for (let i = 0; i < spanTextList.length; i++) {
    const targetRow = spanTextList[i].parentElement;
    const text = spanTextList[i].textContent;
    const newInput = document.createElement("input");
    newInput.className = "formInput";
    newInput.type = "text";
    newInput.name = spanTextList[i].id;
    newInput.placeholder = text;
    targetRow.removeChild(targetRow.lastElementChild);
    targetRow.appendChild(newInput);
  }

  // replace all text in td in courseList to input
  const cellList = document.querySelector("#courseList").querySelectorAll("td");
  for (let i = 0; i < cellList.length; i++) {
    const text = cellList[i].textContent;
    const newInput = document.createElement("input");
    newInput.type = "text";
    newInput.placeholder = text;
    cellList[i].removeChild(cellList[i].firstChild);
    cellList[i].appendChild(newInput);
  }

  // replace all p in descriptionForm to textarea
  const honourP = document.querySelector("#honour");
  const honourRow = honourP.parentElement;
  const textForHonour = honourP.textContent;
  const newHonourTextArea = document.createElement("textarea");
  newHonourTextArea.id = "honour";
  newHonourTextArea.className = "descriptionInput";
  newHonourTextArea.placeholder = textForHonour;
  honourRow.removeChild(honourRow.lastElementChild);
  honourRow.appendChild(newHonourTextArea);

  const hobbyP = document.querySelector("#hobby");
  const hobbyRow = hobbyP.parentElement;
  const textForHobby = hobbyP.textContent;
  const newHobbyTextArea = document.createElement("textarea");
  newHobbyTextArea.id = "hobby";
  newHobbyTextArea.className = "descriptionInput";
  newHobbyTextArea.placeholder = textForHonour;
  hobbyRow.removeChild(hobbyRow.lastElementChild);
  hobbyRow.appendChild(newHobbyTextArea);

  // change the update button to confirm button
  e.target.textContent = "Confirm";
  e.target.removeEventListener("click", updateInfo);
  e.target.addEventListener("click", confirmInfo);
}



// button listener action
function confirmInfo(e) {
  e.preventDefault();

  // confirm all changes in infoForm
  const infoFormInputList = document.querySelector("#infoForm").querySelectorAll("input");
  for (let i = 0; i < infoFormInputList.length; i++) {
    if (infoFormInputList[i].value !== "") {
      currentUser[infoFormInputList[i].name] = infoFormInputList[i].value;
    }
    const targetRow = infoFormInputList[i].parentElement;
    const newSpan = document.createElement("span");
    newSpan.id = infoFormInputList[i].name;
    newSpan.className = "spanText";
    targetRow.removeChild(targetRow.lastElementChild);
    targetRow.appendChild(newSpan);
  }

  // remove all rows in studyGroupList
  const body1 = document.querySelector("#studyGroupList").firstElementChild;
  const numOfRows1 = body1.children.length;
  for (let i = 0; i < numOfRows1; i++) {
    body1.removeChild(body1.lastElementChild);
  }

  // confirm all changes in courseList
  const body2 = document.querySelector("#courseList").firstElementChild;
  const rows =  body2.children;
  for (let i = 1; i < rows.length; i++) {
    const courseCodeInputValue = rows[i].children[0].firstElementChild.value;
    const courseNameInputValue = rows[i].children[1].firstElementChild.value;
    const sectionInputValue = rows[i].children[2].firstElementChild.value;
    const lecturerInputValue = rows[i].children[3].firstElementChild.value;
  
    if (courseCodeInputValue != "") {
      currentUser.courseList[i-1].courseCode = courseCodeInputValue;
    }
    if (courseNameInputValue != "") {
      currentUser.courseList[i-1].courseName = courseNameInputValue;
    }
    if (sectionInputValue != "") {
      currentUser.courseList[i-1].section = sectionInputValue;
    }
    if (lecturerInputValue != "") {
      currentUser.courseList[i-1].lecturer = lecturerInputValue;
    }
  }
  const numOfRows2 = rows.length;
  for (let i = 1; i < numOfRows2; i++) {
    body2.removeChild(body2.lastElementChild);
  }

  // confirm all changes in honour
  const honourTextArea = document.querySelector("#honour");
  const honourRow = honourTextArea.parentElement;
  if (honourTextArea.value !== "") {
    currentUser.honour = honourTextArea.value;
  }
  const newHonourP = document.createElement("p");
  newHonourP.id = "honour";
  newHonourP.className = "descriptionText";
  honourRow.removeChild(honourTextArea);
  honourRow.appendChild(newHonourP);

  // confirm all changes in hobby
  const hobbyTextArea = document.querySelector("#hobby");
  const hobbyRow = hobbyTextArea.parentElement;
  if (hobbyTextArea.value !== "") {
    currentUser.hobby = hobbyTextArea.value;
  }
  const newHobbyP = document.createElement("p");
  newHobbyP.id = "hobby";
  newHobbyP.className = "descriptionText";
  hobbyRow.removeChild(hobbyTextArea);
  hobbyRow.appendChild(newHobbyP);

  // change the confirm button to update button
  e.target.textContent = "Update Information";
  e.target.removeEventListener("click", confirmInfo);
  e.target.addEventListener("click", updateInfo);


  const url = '/profile/update';
  // The data we are going to send in our request
  let data = currentUser

  // Create our request constructor with all the parameters we need
  const request = new Request(url, {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
      },
  });
  fetch(request)
  .then(function(res) {
      if (res.status === 200) {
          displayInfo();
      } else {
          console.log("user info updated fail")
      }

  }).catch((error) => {
      console.log(error)
  })
}


function logOff() {
  const url = '/users/logoff';

  fetch(url)
  .then((res) => {

  }).catch((error) => {
      console.log(error)
  })
}
