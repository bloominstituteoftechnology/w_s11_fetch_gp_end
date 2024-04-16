import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

const StyledBook = styled.li`
  text-decoration: ${props => props.$finished ? 'line-through' : 'initial'};
`

const getInitialForm = () => ({ title: '', author: '', finished: false })

export default function Books() {
  const [books, setBooks] = useState([])
  const [bookForm, setBookForm] = useState(getInitialForm)
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

  const deleteBook = id => {
    setEditingId(null)
    setBookForm(getInitialForm())
    fetch(`/api/books/${id}`, { method: 'DELETE' })
      .then(() => fetchBooks())
      .catch(err => console.error('Failed to delete the book', err))
  }

  const onSubmit = (event) => {
    event.preventDefault()
    const url = editingId ? `/api/books/${editingId}` : '/api/books'

    fetch(url, {
      method: editingId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookForm),
    })
      .then(() => {
        fetchBooks()
        setEditingId(null)
        setBookForm(getInitialForm())
      })
      .catch(err => console.error('Failed to save the book', err))
  }

  const onChange = (event) => {
    const { name, value, type, checked } = event.target
    setBookForm({
      ...bookForm, [name]: type === 'checkbox' ? checked : value
    })
  }

  const editMode = book => {
    setEditingId(book.id)
    setBookForm(book)
  }

  return (
    <div>
      <h2>Books</h2>
      <ul>
        {books.map(book => (
          <StyledBook key={book.id} $finished={book.finished}>
            {book.title} by {book.author}
            <div>
              <button onClick={() => editMode(book)}>Edit</button>
              <button onClick={() => deleteBook(book.id)}>Delete</button>
            </div>
          </StyledBook>
        ))}
      </ul>
      <form onSubmit={onSubmit}>
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
