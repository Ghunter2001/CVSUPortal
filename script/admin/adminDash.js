var usersCounts = new XMLHttpRequest();
usersCounts.open('GET', '/countUsers', true);
usersCounts.onreadystatechange = function () {
  if (usersCounts.readyState === 4 && usersCounts.status === 200) {

    document.getElementById('usersCount').textContent = usersCounts.responseText;
  }
};
usersCounts.send();

var enrolledCounts = new XMLHttpRequest();
enrolledCounts.open('GET', '/countEnrolled', true);
enrolledCounts.onreadystatechange = function () {
  if (enrolledCounts.readyState === 4 && enrolledCounts.status === 200) {

    document.getElementById('enrolledCount').textContent = enrolledCounts.responseText;
  }
};
enrolledCounts.send();

var acadyear = new XMLHttpRequest();
acadyear.open('GET', '/loadAcadYear', true);
acadyear.onreadystatechange = function () {
  if (acadyear.readyState === 4 && acadyear.status === 200) {

    document.getElementById('acadyear').textContent = acadyear.responseText;
  }
};
acadyear.send();


