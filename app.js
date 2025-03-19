// app.js

document.addEventListener("DOMContentLoaded", function() {
    // ---------------------
    // LOGIN PAGE LOGIC
    // ---------------------
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const role = document.getElementById("role").value;
        
        // In a real app, validate credentials on the server
        localStorage.setItem("currentUser", JSON.stringify({ username, role }));
        
        // Redirect based on the selected role
        if (role === "student") {
          window.location.href = "student.html";
        } else {
          window.location.href = "lunchLady.html";
        }
      });
    }
    
    // ---------------------
    // STUDENT DASHBOARD LOGIC
    // ---------------------
    const notificationDiv = document.getElementById("notification");
    const menuDetails = document.getElementById("menuDetails");
    const registerPickupButton = document.getElementById("registerPickup");
    const recommendationForm = document.getElementById("recommendationForm");
    const votingSection = document.getElementById("votingSection");
    const feedbackForm = document.getElementById("feedbackForm");
    
    if (notificationDiv) {
      // Simulate a pop-up notification after page load
      setTimeout(() => {
        const menu = JSON.parse(localStorage.getItem("todayMenu"));
        if (menu) {
          notificationDiv.innerHTML = `<p>Today's menu is: ${menu.menuName}</p>
            <img src="${menu.menuPhoto}" alt="${menu.menuName}" style="width:100px;">`;
          if(menuDetails) {
            menuDetails.innerText = `${menu.menuName}`;
          }
        } else {
          notificationDiv.innerHTML = "<p>No menu posted for today yet.</p>";
          if(menuDetails) {
            menuDetails.innerText = "No menu available.";
          }
        }
      }, 1000);
    }
    
    // Handle registration for pick-up (registration closes at 11:00 AM)
    if (registerPickupButton) {
      registerPickupButton.addEventListener("click", function() {
        const now = new Date();
        const deadline = new Date();
        deadline.setHours(11, 0, 0, 0);
        
        if (now > deadline) {
          alert("Registration for pick-up is closed.");
          return;
        }
        
        let count = parseInt(localStorage.getItem("pickupCount") || "0", 10);
        count++;
        localStorage.setItem("pickupCount", count);
        alert("You have registered for pick-up!");
      });
    }
    
    // Handle menu recommendation submissions
    if (recommendationForm) {
      recommendationForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const recommendation = document.getElementById("menuRecommendation").value;
        let recs = JSON.parse(localStorage.getItem("recommendations") || "[]");
        recs.push(recommendation);
        localStorage.setItem("recommendations", JSON.stringify(recs));
        alert("Recommendation submitted!");
        recommendationForm.reset();
        updateVotingSection();
      });
    }
    
    // Voting Section functions
    function updateVotingSection() {
      if (votingSection) {
        let recs = JSON.parse(localStorage.getItem("recommendations") || "[]");
        let html = "";
        recs.forEach((rec, index) => {
          html += `<div>
                      <p>${rec}</p>
                      <button onclick="vote(${index})">Vote</button>
                      <span id="voteCount-${index}">${getVoteCount(index)}</span> votes
                   </div>`;
        });
        votingSection.innerHTML = html;
      }
    }
    
    window.vote = function(index) {
      let votes = JSON.parse(localStorage.getItem("votes") || "{}");
      votes[index] = (votes[index] || 0) + 1;
      localStorage.setItem("votes", JSON.stringify(votes));
      updateVotingSection();
    }
    
    function getVoteCount(index) {
      let votes = JSON.parse(localStorage.getItem("votes") || "{}");
      return votes[index] || 0;
    }
    
    if (votingSection) {
      updateVotingSection();
    }
    
    // Handle feedback submission
    if (feedbackForm) {
      feedbackForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const feedback = document.getElementById("feedbackText").value;
        let feedbacks = JSON.parse(localStorage.getItem("feedbacks") || "[]");
        feedbacks.push(feedback);
        localStorage.setItem("feedbacks", JSON.stringify(feedbacks));
        alert("Feedback submitted!");
        feedbackForm.reset();
      });
    }
    
    // ---------------------
    // LUNCH LADY DASHBOARD LOGIC
    // ---------------------
    const menuPostForm = document.getElementById("menuPostForm");
    const registrationCountSpan = document.getElementById("registrationCount");
    const studentFeedbackDiv = document.getElementById("studentFeedback");
    
    if (menuPostForm) {
      menuPostForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const menuName = document.getElementById("menuName").value;
        const menuPhoto = document.getElementById("menuPhoto").value;
        const menuData = {
          menuName,
          menuPhoto,
          postedAt: new Date().toISOString()
        };
        localStorage.setItem("todayMenu", JSON.stringify(menuData));
        alert("Menu posted successfully!");
        menuPostForm.reset();
      });
    }
    
    if (registrationCountSpan) {
      let count = localStorage.getItem("pickupCount") || "0";
      registrationCountSpan.innerText = count;
    }
    
    if (studentFeedbackDiv) {
      let feedbacks = JSON.parse(localStorage.getItem("feedbacks") || "[]");
      let recs = JSON.parse(localStorage.getItem("recommendations") || "[]");
      let html = "<h4>Feedback</h4>";
      feedbacks.forEach((feedback) => {
        html += `<p>${feedback}</p>`;
      });
      html += "<h4>Recommendations</h4>";
      recs.forEach((rec) => {
        html += `<p>${rec}</p>`;
      });
      studentFeedbackDiv.innerHTML = html;
    }
  });
  