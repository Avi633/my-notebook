import React, { useContext, useState } from 'react'
import noteContext from '../context/notes/NoteContext'

function AddNote(props) {
    const context = useContext(noteContext)
    const { addNote } = context;

    const [note, setNote] = useState({
        title: '',
        description: '',
        tag: ''
    })

    const handleClick = (e) => {
        e.preventDefault();
        addNote(note.title, note.description, note.tag)
        props.showAlert("Added successfully", "success")
        setNote({ title: '', description: '', tag: ''})
    }

    const handleChange = (e) => {
        setNote({
            ...note,
            [e.target.name]: e.target.value
        })

    }
    return (
        <>
            <div className="container my-3">
                <h2>Add Note</h2>
                <form className='my-3'>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Title</label>
                        <input type="text" className="form-control" id="title" name="title" onChange={handleChange} value={note.title} minLength={5} required/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Description</label>
                        <input type="text" className="form-control" id="description" name="description" onChange={handleChange} value={note.description} minLength={5} required/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="tag" className="form-label">Tag</label>
                        <input type="text" className="form-control" id="tag" name="tag" onChange={handleChange} value={note.tag} minLength={5} required/>
                    </div>
                    <button disabled={note.title.length< 5 || note.description.length<5} type="submit" className="btn btn-primary" onClick={handleClick}>Add</button>
                </form>
            </div>
        </>
    )
}

export default AddNote