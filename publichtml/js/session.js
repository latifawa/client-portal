// Shared by all the hub pages: who is logged in

const currentUser = JSON.parse(localStorage.getItem("user"));

// 1. nobody logged in → go to the login page
if (!currentUser) {
  window.location.href = "login.html";
}

// 2. HUMAIN staff only see admin; clients never see admin
const onAdminPage = window.location.pathname.includes("admin");
if (currentUser && currentUser.role == "Staff" && !onAdminPage) {
  window.location.href = "admin.html";
}
if (currentUser && currentUser.role != "Staff" && onAdminPage) {
  window.location.href = "dashboard.html";
}

document.addEventListener("DOMContentLoaded", () => {
  // 3. fill the sidebar (only on pages that have these ids)
  if (document.getElementById("orgName")) {
    document.getElementById("orgName").textContent = currentUser.org_name;
  }
  if (document.getElementById("orgPlan")) {
    document.getElementById("orgPlan").textContent = currentUser.plan + " plan";
  }
  if (document.getElementById("userName")) {
    document.getElementById("userName").textContent = currentUser.full_name;
  }

  // 4. log out: forget the user, then the link goes to index.html
  if (document.getElementById("logoutLink")) {
    document.getElementById("logoutLink").addEventListener("click", () => {
      localStorage.removeItem("user");
    });
  }
});