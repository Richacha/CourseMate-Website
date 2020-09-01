"use strict";

let currentUser;

// display user info after loading the page
displayInfo();

function displayInfo() {
  // GET request to get current user's info
  const url = '/userInfoDisplay/getUserDisplayed';

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
        numberOfMembersCell.appendChild(document.createTextNode(userStudyGroupList[i].numOfMembers));

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