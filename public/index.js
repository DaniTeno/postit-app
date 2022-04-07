const d = document;
const url = window.location.origin;
const postWall = d.querySelector('.post-wall');
const userNotes = d.getElementById('user-notes');
const createNoteForm = d.getElementById('create-note');

const noData = (msg) => {
    const div = d.createElement('div');
    div.classList.add('no-data', )
    div.innerHTML = `
        <p class="text-w">${msg}</p>
    `;
    return div
}

const userNoteTemplate = ({content, date, _id}) => {
    const note = d.createElement('div');
    note.setAttribute('id', `${_id}`);
    note.classList.add('user-note');
    note.innerHTML = `   
        <nav class="buttons">
            <button class="edit-note" data-note-id="${_id}">Edit</button>
            <button class="delete-note" data-note-id="${_id}">X</button>
        </nav>
        <p class="content">${content}</p>
        <p class="date">${date}</p>
    `;
    return note;
};

const noteTemplate = ({content, date, user, _id}) => {
    const note = d.createElement('div');
    const {nickname} = user
    note.setAttribute('id', `${_id}`);
    note.classList.add('posted-note');
    note.innerHTML = `   
        <p class="user">${nickname}</p>
        <p class="content">${content}</p>
        <p class="date">${date}</p>
    `;
    return note;
};

const renderNotes = async () => {
    getUserNotes();
    await fetch(`${url}/api/notes`)
    .then(res => res.ok ? res.json() : Promise.reject(res))
    .then(notes => {
        if(!notes.length) return postWall.insertAdjacentElement('afterbegin', noData('...Well, nothing to show for now'))
        notes.forEach(note => {
            postWall.insertAdjacentElement('afterbegin', noteTemplate(note))
        });
    });
    deleteNoteEvent; //estos eventos van en las notas de usuario, no en global: cambiar
    editNoteEvent();
};

const postNoteEvent = d.addEventListener("click", async (e) => {
    if(e.target == createNoteForm.send) {
        e.preventDefault();
        if(!localStorage.getItem('user')) return
        const {user} = JSON.parse(localStorage.getItem('user'));
        const date = `${new Date().getDate()}/${new Date().getMonth()+1}/${new Date().getFullYear()}`;
        await fetch(`${url}/api/notes/post`, {
            method: "POST",
            headers: {
                "content-type" : "application/json",
                "authorization" : JSON.parse(localStorage.getItem('user')).token
            },
            body: JSON.stringify({
                userId: user._id,
                content: createNoteForm.content.value,
                date,
                user: {
                    nickname: user.name,
                    email: user.email,
                }
            })
        });
        createNoteForm.reset();
        postWall.innerHTML = null;
        userNotes.innerHTML = null;
        renderNotes();
    };
});

const getUserNotes = async () => {
    if(!localStorage.getItem('user')) {
        createNoteForm.send.classList.add('disabled')
        createNoteForm.send.value = 'Log in first'
        userNotes.insertAdjacentElement('afterbegin', noData('You need to be logged in'))
        return 
    }
    const {user} = JSON.parse(localStorage.getItem('user'));
    const userTitle = d.getElementById('user-title')
    userTitle.textContent = `Hi, ${user.name}!` || 'Hi, guest!';
    await fetch(`${url}/api/notes/${user._id}`, {    
        headers: {
            "authorization" : JSON.parse(localStorage.getItem('user')).token
        },
    })
    .then(res => res.ok ? res.json() : Promise.reject(res))
    .then(json => {
        if(!json.notes.length) return userNotes.insertAdjacentElement('afterbegin', noData(`You haven't post anything yet`))
        json.notes.forEach(note => {
            userNotes.insertAdjacentElement('beforeend', userNoteTemplate(note))
        });
    });
};

const editNoteEvent = () => {
    const editNoteBtn = d.querySelectorAll('.edit-note');
    const date = `${new Date().getDate()}/${new Date().getMonth()+1}/${new Date().getFullYear()}`;
    const user = JSON.parse(localStorage.getItem('user'));
    editNoteBtn.forEach(button =>  {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            if(e.target.textContent == 'Edit') {
                e.target.parentNode.nextElementSibling.outerHTML = `
                    <textarea class="content">${e.target.parentNode.nextElementSibling.textContent}</textarea>
                `;    
                setTimeout(() => e.target.textContent = 'Save', 100);
            };
            if(e.target.textContent == 'Save') {
                if(!localStorage.getItem('user')) return alert('Need to be logged in to post a note');
                fetch(`${url}/api/notes/${button.dataset.noteId}`, {
                    method: "PUT",
                    headers: {
                        'content-type' : 'application/json',
                        "authorization" : JSON.parse(localStorage.getItem('user')).token
                    },
                    body: JSON.stringify({
                        content: e.target.parentNode.nextElementSibling.value,
                        date,
                        user: {
                            nickname: user.user.name,
                            email: user.user.email,
                        }
                    })
                })
                .then(res => res.ok ? res.json() : Promise.reject(res))
                .then(json => {
                    postWall.innerHTML = null;
                    userNotes.innerHTML = null;
                    renderNotes();
                });
            }
        });
    });
};

const deleteNoteEvent = d.addEventListener('click', async (e) => {
    const deleteNoteBtn = d.querySelectorAll('.delete-note');
    deleteNoteBtn.forEach(async button =>  {
        if(e.target == button) {
            if(!localStorage.getItem('user')) return alert('Need to be logged in to post a note');
            await fetch(`${url}/api/notes/${button.dataset.noteId}`, {
                method: "DELETE",  
                headers: {
                    "authorization" : JSON.parse(localStorage.getItem('user')).token
                },
            })
            .then(res => res.ok ? res.json() : Promise.reject(res))
            .then(json => {
                postWall.innerHTML = null;
                userNotes.innerHTML = null;
                renderNotes();
            });
        };
    });
});

const logout = () => {
    const logBtn = d.getElementById('log-btn')
    if(localStorage.getItem('user')) logBtn.textContent = "Log out"
    d.addEventListener('click', (e)=>{
        if(e.target == logBtn && logBtn.textContent == "Log out"){
            localStorage.removeItem('user')
            location.reload();
        } else return
    })
}

document.addEventListener("DOMContentLoaded", async () => {
    logout()
    await renderNotes();
    postNoteEvent;
});
