"use strict";

let currentUser;

// The reason we use hardcode object here instead of class construction is that
// this page only read user info and update user info from server. It never
// creates a new user object.

// TODO phase 2: obtain current user from the server (downloeading the profile pic to current folder)
currentUser = {
  firstName: "Haolin",
  lastName: "Zhang",
  age: "20",
  gender: "Male",
  university: "University of Toronto",
  program: "Computer Science",
  yearOfStudy: "3",
  phoneNumber: "647-676-2988",
  email: "richardhz.zhang@mail.utoronto.ca",
  courseList: [
    {courseCode: "CSC309H1F", courseName: "Programming on Web", section: "LEC 0101", lecturer: "Mark Kazakevich"},
    {courseCode: "CSC373H1F", courseName: "Algorithm Design, Analysis & Complexity", section: "LEC 0101", lecturer: "Michael Brudno"},
    {courseCode: "CSC343H1F", courseName: "Introduction to Databases", section: "LEC 0101", lecturer: "Daniela Rosu"},
    {courseCode: "STA304H1F", courseName: "Surveys, Sampling and Observational Data", section: "LEC 0101", lecturer: "Shivon Sue-Chee"},
    {courseCode: "PSY100H1F", courseName: "Introductory Psychology", section: "LEC 0101", lecturer: "Ashley Waggoner Denton"}
  ],
  studyGroupList: [
    {studyGroupName: "Happy 309 friends", courseCode: "CSC309H1F", numOfMembers: 3},
    {studyGroupName: "GG", courseCode: "CSC373H1F", numOfMembers: 2},
    {studyGroupName: "Hawk", courseCode: "CSC373H1F", numOfMembers: 2}
  ],
  honour: "Hard-working students in all courses.\nKnow many programming languages.",
  hobby: "Learning the guitar from youtube.\nCooking at home.",
  profileImage: "uoft.jpg"
};




// display user info after loading the page
displayInfo();

function displayInfo() {
  // TODO phase 2: downloading the current user's image from server

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
    studyGroupNameLink.href = "../groupPage/groupPage.html";
    studyGroupNameLink.appendChild(document.createTextNode(userStudyGroupList[i].studyGroupName));
    studyGroupNameCell.appendChild(studyGroupNameLink);

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
}





// button listener action
document.querySelector("#button").addEventListener("click", updateInfo);

function updateInfo(e) {
  e.preventDefault();

  // add image selection button
  const fileInput = document.createElement("input");
  fileInput.id = "fileInput";
  fileInput.type = "file";
  document.querySelector("#profilePicContainer").appendChild(fileInput);

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

  // confirm change in profilePic
  const fileInput = document.querySelector("#fileInput");
  if (fileInput.value !== "") {
    currentUser.profileImage = fileInput.value.split("\\").pop();

    // TODO phase 2: upload this new image to server

  }
  fileInput.parentElement.removeChild(fileInput);

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
    if ((courseCodeInputValue !== "") || (courseNameInputValue !== "") || (sectionInputValue !== "") || (lecturerInputValue !== "")) {
      const newCourse = {courseCode: courseCodeInputValue, courseName: courseNameInputValue, section: sectionInputValue, lecturer: lecturerInputValue};
      currentUser.courseList[i-1] = newCourse;
    }
  }
  const numOfRows2 = rows.length;
  for (let i = 0; i < numOfRows2; i++) {
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

  // display updated user info
  displayInfo();

  // TODO phase 2: send updated user info to server

}
