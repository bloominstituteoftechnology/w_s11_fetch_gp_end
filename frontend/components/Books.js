import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

const StyledBook = styled.li`
  text-decoration: ${props => props.$finished ? 'line-through' : 'initial'};
`

export default function Books() {
  const [books, setBooks] = useState([])
  const [bookForm, setBookForm] = useState({ title: '', author: '', finished: false })
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = () => {
    fetch('/api/books')
      .then(res => res.json())
      .then(data => setBooks(data))
      .catch(err => console.error('Failed to fetch books', err))
  }

  const handleFormChange = (event) => {
    const { name, value, type, checked } = event.target
    setBookForm({
      ...bookForm,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const url = editingId ? `/api/books/${editingId}` : '/api/books'
    const method = editingId ? 'PUT' : 'POST'

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookForm)
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
    fetch(`/api/books/${id}`, { method: 'DELETE' })
      .then(() => fetchBooks())
  }

  return (
    <div>
      <h2>Books Component</h2>
      <ul>
        {books.map(book => (
          <StyledBook key={book.id} $finished={book.finished}>
            {book.title} by {book.author}
            <button onClick={() => handleEdit(book)}>Edit</button>
            <button onClick={() => handleDelete(book.id)}>Delete</button>
          </StyledBook>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          value={bookForm.title}
          onChange={handleFormChange}
          placeholder="Title"
        />
        <input
          name="author"
          value={bookForm.author}
          onChange={handleFormChange}
          placeholder="Author"
        />
        <label>
          Finished:
          <input
            type="checkbox"
            name="finished"
            checked={bookForm.finished}
            onChange={handleFormChange}
          />
        </label>
        <button type="submit">{editingId ? 'Update Book' : 'Add Book'}</button>
      </form>
    </div>
  )
}
