// Import Firebase modules
import { auth, db } from "./firebase-config.js";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail, 
  onAuthStateChanged, 
  updateProfile, 
  updateEmail 
} from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-storage.js";

const storage = getStorage();

// Improved Search Functionality
async function searchBusinesses() {
  const queryInput = document.getElementById("searchInput").value.trim();
  const locationInput = document.getElementById("locationInput").value.trim();
  const resultsContainer = document.getElementById("resultsContainer");
  resultsContainer.innerHTML = "Searching...";
  
  const businessRef = collection(db, "businesses");
  let searchQuery = query(businessRef);

  if (queryInput && locationInput) {
    searchQuery = query(businessRef, where("name", "==", queryInput), where("location", "==", locationInput));
  } else if (queryInput) {
    searchQuery = query(businessRef, where("name", "==", queryInput));
  } else if (locationInput) {
    searchQuery = query(businessRef, where("location", "==", locationInput));
  }

  try {
    const querySnapshot = await getDocs(searchQuery);
    resultsContainer.innerHTML = "";
    if (querySnapshot.empty) {
      resultsContainer.innerHTML = "No results found.";
    } else {
      querySnapshot.forEach(doc => {
        const business = doc.data();
        const businessElement = document.createElement("div");
        businessElement.classList.add("business-result");
        businessElement.innerHTML = `
          <h3>${business.name}</h3>
          <p>Type: ${business.type}</p>
          <p>Location: ${business.location}</p>
        `;
        resultsContainer.appendChild(businessElement);
      });
    }
  } catch (error) {
    resultsContainer.innerHTML = "Error fetching results.";
    console.error("Error searching businesses:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const searchButton = document.getElementById("searchButton");
  if (searchButton) {
    searchButton.addEventListener("click", searchBusinesses);
  }
  
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("keypress", function(event) {
      if (event.key === "Enter") searchBusinesses();
    });
  }
});

// Rating & Review System
async function submitReview(businessId, rating, reviewText) {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("You must be logged in to submit a review.");
    
    await addDoc(collection(db, "reviews"), {
      businessId,
      userId: user.uid,
      rating,
      reviewText,
      createdAt: serverTimestamp()
    });
    alert("Review submitted!");
  } catch (error) {
    alert("Error submitting review: " + error.message);
  }
}

async function loadReviews(businessId) {
  const reviewsContainer = document.getElementById("reviewsContainer");
  reviewsContainer.innerHTML = "";
  
  const q = query(collection(db, "reviews"), where("businessId", "==", businessId));
  const querySnapshot = await getDocs(q);
  
  querySnapshot.forEach(doc => {
    const review = doc.data();
    const div = document.createElement("div");
    div.classList.add("review-item");
    div.innerHTML = `<p>Rating: ${review.rating} ⭐</p><p>${review.reviewText}</p>`;
    reviewsContainer.appendChild(div);
  });
}
