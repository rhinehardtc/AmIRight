const postsURL = 'http://localhost:3000/posts/';
const usersURL = 'http://localhost:3000/users/'

document.addEventListener('DOMContentLoaded', () => {
    getPosts();
    createUser();
    loginUser();
    handleLogout();
    sessionDisplayManager();
    console.log(sessionStorage);
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
            <span class="likes">${post.likes} </span>
            people agree.
            <span class="dislikes"> ${post.dislikes} </span>
            people disagree.
        </div>
        </br>
        <button class="add_agree">You Right</button> <button class="add_disagree">You Wrong</button>
    `;

    postDiv.className = "post_div";

    postsContainer.appendChild(postDiv);
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
        sessionStorage.removeItem('user_id')
        console.log('test', sessionStorage);

        sessionDisplayManager();
    });
};

function sessionDisplayManager(){
    const logoutButton = document.getElementById('logout_button');
    const loginButton = document.getElementById('login_button');
    const postButton = document.getElementById('post_button');

    console.log(sessionStorage.length);

    if (sessionStorage.length === 0){
        loginButton.style.display = 'inline';
        logoutButton.style.display = 'none';
        postButton.style.display = 'none';
    } else {
        loginButton.style.display = 'none';
        logoutButton.style.display = 'inline';
        makePost(postButton);
    };
};

function welcomeUser(currentUser){
    console.log(`Welcome, ${currentUser}`);
    console.log(sessionStorage)

    if(!document.getElementById('welcome_header')){
        const welcomeHeader = document.createElement('h3');
        welcomeHeader.className = 'welcome_header';
        welcomeHeader.id = 'welcome_header';

        welcomeHeader.innerText = `Welcome, ${currentUser}`;

        document.getElementById('login').appendChild(welcomeHeader)
    } else {
        document.getElementById('welcome_header').innerText = `Welcome, ${currentUser}`;
    };

    sessionDisplayManager();
};

function makePost(button){
    const postArea = document.getElementById('post_area');
    const postForm = document.getElementById('post_form');
    const cancelPost = document.getElementById('cancel_post')

    button.style.display = 'inline';

    button.addEventListener('click', () => {
        postForm.style.display = 'flex';
    });

    cancelPost.addEventListener('click', () => {
        postForm.style.display = 'none';
    });

    postForm.addEventListener('submit', (e) => {
        e.preventDefault();
        postPost(postArea.value)
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