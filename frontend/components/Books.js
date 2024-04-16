import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'

const StyledBook = styled.li`
  text-decoration: ${props => props.$finished ? 'line-through' : 'initial'};
`

export default function Books() {
  const [books, setBooks] = useState([])
  const [bookForm, setBookForm] = useState({ title: '', author: '', finished: false })
  const [editingId, setEditingId] = useState(null)
  const controllerRef = useRef(new AbortController)

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = () => {
    fetch('/api/books', { signal: controllerRef.current.signal })
      .then(res => res.json())
      .then(data => setBooks(data))
      .catch(err => console.error('Failed to fetch books', err))
  }

  const onChange = (event) => {
    const { name, value, type, checked } = event.target
    setBookForm({
      ...bookForm,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const url = editingId ? `/api/books/${editingId}` : '/api/books'

    fetch(url, {
      method: editingId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookForm),
      signal: controllerRef.current.signal,
    })
      .then(() => {
        fetchBooks()
        setEditingId(null)
        setBookForm({ title: '', author: '', finished: false })
      })
      .catch(err => console.error('Failed to save the book', err))
  }

  const handleEdit = book => {
    setEditingId(book.id)
    setBookForm(book)
  }

  const handleDelete = id => {
    setEditingId(null)
    setBookForm({ title: '', author: '', finished: false })
    fetch(`/api/books/${id}`, {
      method: 'DELETE',
      signal: controllerRef.current.signal,
    })
      .then(() => fetchBooks())
      .catch(err => console.log('Failed to delete the book', err))
  }

  return (
    <div>
      <h2>Books Component</h2>
      <ul>
        {books.map(book => (
          <StyledBook key={book.id} $finished={book.finished}>
            {book.title} by {book.author}
            <div>
              <button onClick={() => handleEdit(book)}>Edit</button>
              <button onClick={() => handleDelete(book.id)}>Delete</button>
            </div>
          </StyledBook>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          value={bookForm.title}
          onChange={onChange}
          placeholder="Title"
        />
        <input
          name="author"
          value={bookForm.author}
          onChange={onChange}
          placeholder="Author"
        />
        <label>
          Finished:
          <input
            type="checkbox"
            name="finished"
            checked={bookForm.finished}
            onChange={onChange}
          />
        </label>
        <button type="submit">{editingId ? 'Update Book' : 'Add Book'}</button>
      </form>
    </div>
  )
}
