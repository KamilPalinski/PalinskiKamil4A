class Note {
    constructor(Tytul, zawartosc, kolor, wazne, data) 
    {
        this.Tytul = Tytul;
        this.zawartosc = zawartosc;
        this.kolor = kolor;
        this.wazne = wazne;
        this.data = data;
    }
    
}
   
 window.onload = function () {
     initNotesElements();
 }

function initNotesElements() {
    let notesList = document.getElementById('notesList');
    let notes = getNotes();
    while (notesList.firstChild) {
        notesList.removeChild(notesList.firstChild);
    }
    for (let i = 0; i < notes.length; i++) {
        createNoteElem(notes[i], notesList);
    }
}

function createNoteElem(note) {
    let element=`<li><div class=${note.wazne} style="background:${note.kolor}">
    <p class="date">${note.data.replace('T', '\n').replace('Z', '')}
    </p>
    <h2>${note.Tytul}</h2><p>${note.zawartosc}</p>
    </div>
    </li>`;
     document.getElementById("notesList").insertAdjacentHTML('beforeend', element);
}
function addNote() {
    if(document.getElementById('Tytul').value.length){
    let Tytul = document.getElementById('Tytul').value;
    let zawartosc = document.getElementById('Zawartosc').value;
    let kolor = document.getElementById('Kolor').value;
    let wazne = document.getElementById('Wazne').checked;
    let notatka = new Note(Tytul, zawartosc, kolor, wazne, new Date());
    let notes = getNotes();
    notes.push(notatka);
    window.localStorage.setItem('notes', JSON.stringify(notes));
    initNotesElements();}
     
}
function getNotes() {
    let notes = window.localStorage.getItem('notes');
    if (notes === null || notes === undefined) {
        notes = [];
    } else {
        notes = JSON.parse(notes);
    }
    return notes;
}

function deleteNotes() {
    window.localStorage.clear();
    initNotesElements();
}
