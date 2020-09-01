"use strict";

let currentUser;

// The reason we use hardcode object here instead of class construction is that
// this page only read user info and update user info from server. It never
// creates a new user object.

// below get current user from the server (downloeading the profile pic to current folder)
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
  // downloading the current user's image from server

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
