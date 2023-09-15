import { useState } from 'react'
import NoteContext from './NoteContext'


const NoteState = (props) => {
  const host = "http://localhost:5000";
  const initialNotes = [];
  const [notes, setNotes] = useState(initialNotes)

  // GEt all note
  const getNotes = async () => {
    // API CALL 
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",
      headers: {
        'Content-Type': 'application-json',
        'auth-token': localStorage.getItem('token')
      }
    });
    const json = await response.json();
    setNotes(json)
  }

  // Add note
  const addNote = async (title, description, tag) => {
    // Call API
      try {
        const response = await fetch(`${host}/api/notes/addnote`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'auth-token': localStorage.getItem('token')
          },
          body: JSON.stringify({title, description, tag}),
        });
    
        const note = await response.json();
        setNotes(notes.concat(note))
      } catch (error) {
        console.error("Error:", error);
      }
  }

  // Delete note
  const deleteNote = async (id) => {
    // Call API
    try{
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application-json',
        'auth-token': localStorage.getItem('token')
      }
    });
    const json = await response.json();

    const newNotes = notes.filter((note) => {
      return note._id !== id;
    })
    setNotes(newNotes)
  } catch (error) {
    console.error("Error:", error);
  }
}

  // Edit note
  const editNote = async (id, title, description, tag) => {
    // API call
    try{
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application-json',
        'auth-token': localStorage.getItem('token')
      },
      body: JSON.stringify({ title, description, tag })
    });
    const json = await response.json();

    const newNotes = JSON.parse(JSON.stringify(notes))

    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
    }
    setNotes(newNotes)
  } catch (error) {
    console.error("Error:", error);
  }
}


  return (
    <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
      {props.children}
    </NoteContext.Provider>
  )
}


export default NoteState;
