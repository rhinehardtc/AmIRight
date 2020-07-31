const postsURL = 'http://localhost:3000/posts/';
const usersURL = 'http://localhost:3000/users/'
const likesURL = 'http://localhost:3000/likes/'

document.addEventListener('DOMContentLoaded', () => {
    getPosts();
    createUser();
    loginUser();
    handleLogout();
    sessionDisplayManager();
});

function getPosts(){
    fetch(postsURL)
    .then(response => response.json())
    .then(json => {
        for(const post of json){
            console.log(post);
            showPost(post);
        };
    });
};

function showPost(post){
    const postsContainer = document.getElementById('posts_container');
    const postDiv = document.createElement('div');
    const likes = [];
    const dislikes = [];

    for (const like of post.likes){
        if (like.agree === true){
            likes.push(like)
        }
    }
    for (const like of post.likes){
        if (like.disagree === true){
            dislikes.push(like)
        }
    }

    let likePerson = "person";
    let dislikePerson = "person";

    let agree = "agrees";
    let disagree = "disagrees";

    if (likes.length > 1 || likes.length === 0){
        likePerson = "people";
        agree = "agree";
    };

    if(dislikes.length > 1 || dislikes.length === 0){
        dislikePerson = "people";
        disagree = "disagree";
    };

    postDiv.innerHTML = `
        <h3>Posted By: ${post.user.name}</h3>
        
        <div class="dropdown">
            <button class="dots"></button>
            <div class="dropdown-content">
                <h5 class="delete_post">Delete Post</h5>
                <h5 class="flag_post">Flag Post</h5>
                <h5 class="exit_dropdown">Nevermind</h5>
            </div>
        </div>

        </br>
        <p class="post_content">${post.content}</p>
        <p class="am_i_right">Am I right?</p>
        </br>
        <div class="counts">
            <span class="likes" id="${post.id}like">${likes.length} </span>
            ${likePerson} ${agree}.
            <span class="dislikes" id="${post.id}dislike"> ${dislikes.length} </span>
            ${dislikePerson} ${disagree}.
        </div>
        </br>
        <button class="add_agree" id="${post.id}agree">✓</button> <button class="add_disagree" id="${post.id}disagree">✖︎</button>
    `;

    postDiv.className = "post_div";
    postDiv.name = post.user.name;
    postDiv.id = post.id;

    const dotMenu = postDiv.getElementsByClassName('dots')[0];

    dotMenu.addEventListener('click', () => {
        postDiv.getElementsByClassName('dropdown-content')[0].style.display = 'block';
        if(postDiv.name !== sessionStorage["user_name"]){
            postDiv.getElementsByClassName('delete_post')[0].style.display = 'none';
        };
    });

    postDiv.getElementsByClassName('exit_dropdown')[0].addEventListener('click', () => {
        postDiv.getElementsByClassName('dropdown-content')[0].style.display = 'none';
    });

    postDiv.getElementsByClassName('delete_post')[0].addEventListener('click', () => {
        postDiv.remove();
        deletePost(post);
    });


    postsContainer.appendChild(postDiv);

    addLike(post);
    addDislike(post);
};

function deletePost(post){
    console.log(post.id);
    fetch(`${postsURL}${post.id}`, {
        method: 'DELETE'
    });
};

function createUser(){
    const signUp = document.getElementById('sign_up');
    const createForm = document.getElementById('create_form');
    
    const cancelSignUp = document.getElementById('cancel');
    
    signUp.addEventListener('click', () => {
        createForm.style.display = "flex";
    });

    cancelSignUp.addEventListener('click', () => {
        createForm.style.display = "none";
    });

    createForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const createUserName = document.getElementById('create_username');
        const createPassword = document.getElementById('create_password');
        postUser(createUserName.value, createPassword.value);
        createUserName.value = "";
        createPassword.value = "";
        createForm.style.display = "none";
    });
};

function postUser(name, password){

    fetch(usersURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify({
            "name": name,
            "password": password
        })
    })
    .then(response => response.json())
    .then(json => console.log(json))
};

function loginUser(){
    const loginButton = document.getElementById('login_button');
    const loginForm = document.getElementById('login_form');

    const cancelLogin = document.getElementById('cancel_login');

    loginButton.addEventListener('click', () => {
        loginForm.style.display = 'flex';
    });

    cancelLogin.addEventListener('click', () => {
        loginForm.style.display = 'none';
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const loginUserName = document.getElementById('login_username');
        const loginPassword = document.getElementById('login_password');
        getUser(loginUserName.value, loginPassword.value);
        loginUserName.value = "";
        loginPassword.value = "";
        loginForm.style.display = "none";
    });
};

function getUser(name, password){
    fetch(usersURL)
    .then(response => response.json())
    .then(json => {
        for(const user of json){
            if(user.name === name && user.password === password){
                const currentUser = user.name;
                sessionStorage.setItem('user_name', currentUser);
                sessionStorage.setItem('user_id', user.id);

                if (document.getElementById('welcome_header')){
                    document.getElementById('welcome_header').innerText = "";
                };

                welcomeUser(currentUser);
            };
        }
    });
};

function handleLogout(){
    const logoutButton = document.getElementById('logout_button');

    logoutButton.addEventListener('click', () => {
        if (document.getElementById('welcome_header')){
            document.getElementById('welcome_header').innerText = `Goodbye, ${sessionStorage["user_name"]}.`;
        };
        
        if (!document.getElementById('welcome_header')){
            const welcomeHeader = document.createElement('h3');

            welcomeHeader.className = "welcome_header";
            welcomeHeader.id = "welcome_header";

            welcomeHeader.innerText = `Goodbye, ${sessionStorage["user_name"]}.`;

            document.getElementById('login').appendChild(welcomeHeader);
        };

        sessionStorage.removeItem('user_name');
        sessionStorage.removeItem('user_id');
        console.log('test', sessionStorage);

        location.reload();
    });
};

function sessionDisplayManager(){
    const logoutButton = document.getElementById('logout_button');
    const loginButton = document.getElementById('login_button');
    const postButton = document.getElementById('post_button');
    const userPostFilter = document.getElementById('filter_by_user_button');

    console.log(sessionStorage.length);

    if (sessionStorage.length === 0){
        loginButton.style.display = 'inline';
        logoutButton.style.display = 'none';
        postButton.style.display = 'none';
        userPostFilter.style.display = 'none';
    } else {
        loginButton.style.display = 'none';
        logoutButton.innerText = `Logout ${sessionStorage.user_name}`;
        logoutButton.style.display = 'inline';
        userPostFilter.style.display = 'inline';
        filterUserPosts(userPostFilter);
        makePost(postButton);
    };
};

function filterUserPosts(button){
    const allPostDivs = document.getElementsByClassName('post_div');

    button.addEventListener('click', () => {
        if(button.innerText === "Show my posts"){
            button.innerText = "Show all posts";
            for(const postDiv of allPostDivs){
                if(postDiv.name !== sessionStorage["user_name"]){
                    postDiv.style.display = 'none';
                };
            };
        } else {
            button.innerText = "Show my posts";
            for(const postDiv of allPostDivs){
                postDiv.style.display = 'block';
            };
        };
    });
};

function welcomeUser(currentUser){
    console.log(`Welcome, ${currentUser}`);
    console.log(sessionStorage);

    if(!document.getElementById('welcome_header')){
        const welcomeHeader = document.createElement('h3');
        welcomeHeader.className = 'welcome_header';
        welcomeHeader.id = 'welcome_header';

        welcomeHeader.innerText = `Welcome, ${currentUser}`;

        document.getElementById('login').appendChild(welcomeHeader);
    } else {
        document.getElementById('welcome_header').innerText = `Welcome, ${currentUser}`;
    };

    sessionDisplayManager();
};

function makePost(button){
    const postArea = document.getElementById('post_area');
    const postForm = document.getElementById('post_form');
    const cancelPost = document.getElementById('cancel_post');

    button.style.display = 'inline';

    button.addEventListener('click', () => {
        postForm.style.display = 'flex';
    });

    cancelPost.addEventListener('click', () => {
        postForm.style.display = 'none';
    });

    postForm.addEventListener('submit', (e) => {
        e.preventDefault();
        postPost(postArea.value);
        postArea.value = "";
        postForm.style.display = 'none';
    });
};

function postPost(content){
    fetch(postsURL, {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify({
            "content": content,
            "user_id": sessionStorage["user_id"]
        })
    })
    .then(response => response.json())
    .then(json => getPost(json))
};

function getPost(post){
    fetch(`${postsURL}${post.id}`)
    .then(response => response.json())
    .then(json => showPost(json))
};

function addLike(post){
    const agreeButton = document.getElementById(`${post.id}agree`);

    agreeButton.addEventListener("click", () => {
        if(post.user.id === parseInt(sessionStorage.user_id, 10)){

            alert('Cannot like your own post.');

        } else if(sessionStorage.length > 0){
            let patchCheck = false;
            let thisLike;

            for (const like of post.likes){
                console.log(like.user_id, parseInt(sessionStorage.user_id, 10));
                if (like.user_id === parseInt(sessionStorage.user_id, 10)){
                    patchCheck = true;
                    console.log(like);
                    thisLike = like;
                };
            };
            
            console.log(patchCheck, thisLike);

            if (patchCheck === false){
                document.getElementById(`${post.id}like`).innerHTML++;
                postLike(post);
            } else {
                if(thisLike.disagree === true){
                    document.getElementById(`${post.id}like`).innerHTML++;
                    document.getElementById(`${post.id}dislike`).innerHTML--;
                };
                patchLike(thisLike);
                thisLike.disagree = false;
            };

        } else {
            alert('Must be logged in to like a post.');
        };
    });
};

function postLike(post) {
    fetch(likesURL, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({
            user_id: sessionStorage.user_id,
            post_id: post.id,
            agree: true,
            disagree: false
        })
    })
    .then(response => response.json())
    .then(json => console.log(json))
};

function addDislike(post){
    const disagreeButton = document.getElementById(`${post.id}disagree`);
    disagreeButton.addEventListener("click", () => {
        if(post.user.id === parseInt(sessionStorage.user_id, 10)){
            alert('Cannot dislike your own post.');
        } else if(sessionStorage.length > 0){
            let patchCheck = false;
            let thisLike;

            for (const like of post.likes){
                console.log(like.user_id, parseInt(sessionStorage.user_id, 10));
                if (like.user_id === parseInt(sessionStorage.user_id, 10)){
                    patchCheck = true;
                    console.log(like);
                    thisLike = like;
                };
            };
            
            console.log(patchCheck, thisLike);

            if (patchCheck === false){
                document.getElementById(`${post.id}dislike`).innerHTML++;
                postDislike(post);
            } else {
                if(thisLike.agree === true){
                    document.getElementById(`${post.id}like`).innerHTML--;
                    document.getElementById(`${post.id}dislike`).innerHTML++;
                };
                patchDislike(thisLike);
                thisLike.agree = false
            };
        } else {
            alert('Must be logged in to dislike a post.');
        };
    });
};

function postDislike(post) {
    fetch(likesURL, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({
            user_id: post.user.id,
            post_id: post.id,
            agree: false,
            disagree: true
        })
    })
    .then(response => response.json())
    .then(json => console.log(json))
};


function patchLike(like){
    fetch(`${likesURL}${like.id}`, {
        method: "PATCH",
        headers: {
            "Content-type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({
            agree: true,
            disagree: false
        })
    })
    .then(response => response.json())
    .then(json => console.log(json))
};

function patchDislike(like){
    fetch(`${likesURL}${like.id}`, {
        method: "PATCH",
        headers: {
            "Content-type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({
            agree: false,
            disagree: true
        })
    })
    .then(response => response.json())
    .then(json => console.log(json))
};
