const postsURL = 'http://localhost:3000/posts/';

document.addEventListener('DOMContentLoaded', () => {
    getPosts();
});

function getPosts(){
    fetch(postsURL)
    .then(response => response.json())
    .then(json => {
        for(const post of json){
            console.log(post)
            showPost(post)
        }
    })
};

function showPost(post){
    const postsContainer = document.getElementById('posts_container');
    const postDiv = document.createElement('div');

    postDiv.innerHTML = `
        <h3>Posted By: ${post.user.name}</h3>
        </br>
        <p class="post_content">${post.content}</p>
        <p class="am_i_right">Am I right?</p>
        </br>
        <div class="counts">
            <span class="likes">${post.likes.length} </span>
            people agree.
            <span class="dislikes"> ${post.dislikes.length} </span>
            people disagree.
        </div>
        </br>
        <button class="add_agree">You Right</button> <button class="add_disagree">You Wrong</button>
    `;

    postDiv.className = "post_div";

    postsContainer.appendChild(postDiv);
};

