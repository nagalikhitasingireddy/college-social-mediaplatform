document.addEventListener("DOMContentLoaded", function () {
    loadDefaultMemes();
});

function loadDefaultMemes() {
    const defaultMemes = [
        { src: "https://i.imgflip.com/1bij.jpg", caption: "This is fine", likes: 10, comments: 3 },
        { src: "https://i.imgflip.com/26am.jpg", caption: "One does not simply", likes: 15, comments: 5 },
        { src: "https://i.imgflip.com/4acd.jpg", caption: "Change my mind", likes: 8, comments: 2 }
    ];

    defaultMemes.forEach(meme => addMemeToGallery(meme.src, meme.caption, meme.likes, meme.comments));
}

function uploadMeme() {
    const memeInput = document.getElementById("memeImage");
    const captionInput = document.getElementById("memeCaption");
    
    if (memeInput.files.length === 0 || captionInput.value.trim() === "") {
        alert("Please select an image and enter a caption.");
        return;
    }

    const memeFile = memeInput.files[0];
    const memeURL = URL.createObjectURL(memeFile);
    const memeCaption = captionInput.value;

    addMemeToGallery(memeURL, memeCaption, 0, 0);
    memeInput.value = "";
    captionInput.value = "";
}

function addMemeToGallery(imageSrc, caption, likes = 0, comments = 0) {
    const memeGallery = document.getElementById("memeGallery");

    const memeDiv = document.createElement("div");
    memeDiv.classList.add("meme-item");

    memeDiv.innerHTML = `
        <img src="${imageSrc}" alt="Meme">
        <div class="meme-details">
            <p class="caption">${caption}</p>
            <div class="meme-actions">
                <button class="like-btn" onclick="likeMeme(this)">❤️ ${likes}</button>
                <button class="comment-btn" onclick="commentMeme(this)">💬 ${comments}</button>
            </div>
        </div>
    `;

    memeGallery.insertBefore(memeDiv, memeGallery.firstChild);
    updateLeaderboard();
}

function likeMeme(button) {
    let currentLikes = parseInt(button.textContent.split(" ")[1]);
    currentLikes++;
    button.innerHTML = `❤️ ${currentLikes}`;
    updateLeaderboard();
}

function commentMeme(button) {
    let commentText = prompt("Enter your comment:");
    if (commentText) {
        let currentComments = parseInt(button.textContent.split(" ")[1]);
        currentComments++;
        button.innerHTML = `💬 ${currentComments}`;
    }
}

function scrollToUpload() {
    document.getElementById("uploadSection").scrollIntoView({ behavior: "smooth" });
}

function toggleSidebar() {
    document.querySelector(".sidebar").classList.toggle("expanded");
}

function updateLeaderboard() {
    const memes = document.querySelectorAll(".meme-item");
    let memeData = [];

    memes.forEach(meme => {
        let caption = meme.querySelector(".caption").textContent;
        let likes = parseInt(meme.querySelector(".like-btn").textContent.split(" ")[1]);
        memeData.push({ caption, likes });
    });

    memeData.sort((a, b) => b.likes - a.likes);
    const leaderboard = document.getElementById("leaderboard");
    leaderboard.innerHTML = "";

    memeData.slice(0, 3).forEach(meme => {
        let listItem = document.createElement("li");
        listItem.textContent = `${meme.caption} - ❤️ ${meme.likes}`;
        leaderboard.appendChild(listItem);
    });
}
