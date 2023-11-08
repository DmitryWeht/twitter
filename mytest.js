const root = document.querySelector("#root");
const postsContainer = document.createElement("div");
postsContainer.classList.add("posts-container");
root.append(postsContainer);

const reactionsData = {};

const showPost = (body, reactions, image, userName) => {
  const postContainer = document.createElement("div");
  postContainer.classList.add("post-container");

  const userImage = document.createElement("img");
  userImage.classList.add("user-image");

  userImage.src = image;

  const name = document.createElement("h2");
  name.innerText = userName;

  const postBody = document.createElement("p");
  postBody.innerText = body;

  const reactionsContainer = document.createElement("div");
  reactionsContainer.classList.add("reactions-container");

  // const replyButton = document.createElement("button");
  // replyButton.innerText = "Ответить";

  // const retweetButton = document.createElement("button");
  // retweetButton.innerText = "Ретвит";

  const likeButton = document.createElement("span");
  likeButton.innerHTML = "&#x2665;";
  likeButton.classList.add("like-button");
  likeButton.style.color = "gray"; // Красный цвет
  likeButton.style.fontWeight = "bold"; // Жирный стиль
  likeButton.style.fontSize = "24px"; // Увеличиваем размер шрифта

  let isLiked = false;

  const updateLikeButton = () => {
    if (isLiked) {
      likeButton.style.color = "red"; // Изменяем цвет при убирании лайка
    } else {
      likeButton.style.color = "gray";
    }
  };

  likeButton.addEventListener("click", () => {
    isLiked = !isLiked; // Инвертируем состояние
    updateLikeButton(); // Обновляем стиль
    const currentReactions = parseInt(reactionsValue.innerText, 10);
    if (isLiked) {
      reactionsValue.innerText = currentReactions + 1;
    } else {
      reactionsValue.innerText = currentReactions - 1;
    }
  });

  //   likeButton.addEventListener("click", () => {
  // //     const currentReactions = parseInt(reactionsValue.innerText, 10);
  // //     reactionsValue.innerText = currentReactions + 1;
  // //   });

  const reactionsValue = document.createElement("span");
  reactionsValue.innerText = reactions;

  reactionsContainer.append(likeButton, reactionsValue); // Переместил likeButton перед reactionsValue
  postContainer.append(userImage, name, postBody, reactionsContainer);

  postsContainer.prepend(postContainer); // теперь появляется твит в начале, а не в конце
};

const getAllPosts = async (url, callback) => {
  const response = await fetch(url);
  const data = await response.json();
  callback(data.posts);
};

const getUserDataAndShow = async (posts) => {
  const onlyPosts = posts.slice(0, 10);
  for (const post of onlyPosts) {
    try {
      const { username, image } = await getUser(post.userId);
      showPost(post.body, post.reactions, image, username);
    } catch (error) {
      console.error("Error", error);
    }
  }
};

const addPost = async (data) => {
  try {
    const { userId, body } = await postPost(data);
    const { image, username } = await getUser(userId);
    showPost(body, 0, image, username);
  } catch (error) {
    console.log(error);
  }
};

const createForm = async () => {
  const { id, image, username } = await getUser(10);

  const userName = document.createElement("h3");
  userName.innerText = username;
  const userImage = document.createElement("img");
  userImage.src = image;

  const form = document.createElement("form");
  const input = document.createElement("input");
  input.placeholder = "What's happening";
  const button = document.createElement("button");
  button.type = "submit";
  button.textContent = "Tweet";
  form.append(userImage, userName, input, button);
  root.prepend(form);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const dataObject = {
      body: input.value,
      userId: id,
    };
    try {
      await addPost(dataObject);
      input.value = "";
    } catch (error) {
      console.error("Error", error);
    }
  });
};

const postPost = async (data) => {
  const response = await fetch("https://dummyjson.com/posts/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Error");
  }

  const postData = await response.json();
  return postData;
};

const getUser = async (userId) => {
  const userResponse = await fetch(`https://dummyjson.com/users/${userId}`);
  const userData = await userResponse.json();
  return userData;
};

document.addEventListener("DOMContentLoaded", () => {
  getAllPosts("https://dummyjson.com/posts", (posts) =>
    getUserDataAndShow(posts)
  );
  createForm();
});
