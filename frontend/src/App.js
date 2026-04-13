import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [formData, setFormData] = useState({ idno: '', firstname: '', lastname: '', course: '' });
  const [editId, setEditId] = useState(null);

  const API_URL = 'http://localhost:5000';

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/students`);
      if (!response.ok) throw new Error('Failed to fetch students');
      const data = await response.json();
      setStudents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to add student');
      setShowModal(false);
      setFormData({ idno: '', firstname: '', lastname: '', course: '' });
      fetchStudents();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/students`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editId, ...formData }),
      });
      if (!response.ok) throw new Error('Failed to update student');
      setEditModal(false);
      setFormData({ idno: '', firstname: '', lastname: '', course: '' });
      setEditId(null);
      fetchStudents();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student?')) return;
    try {
      const response = await fetch(`${API_URL}/students/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete student');
      fetchStudents();
    } catch (err) {
      alert(err.message);
    }
  };

  const openEdit = (student) => {
    setEditId(student.id);
    setFormData({ idno: student.idno, firstname: student.firstname, lastname: student.lastname, course: student.course });
    setEditModal(true);
  };

  if (loading) return <div className="loading">Loading students...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="App">
      <div className="header">
        <h1>SCHOOL V1.0</h1>
      </div>

      <div className="content-card">
        <div className="card-header">
          <h2>STUDENTS</h2>
          <button className="add-btn" onClick={() => setShowModal(true)}>+ ADD NEW</button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>IDNO</th>
                <th>LASTNAME</th>
                <th>FIRSTNAME</th>
                <th>COURSE</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student.id}>
                  <td>{index + 1}</td>
                  <td>{student.idno}</td>
                  <td>{student.lastname}</td>
                  <td>{student.firstname}</td>
                  <td>{student.course}</td>
                  <td className="actions">
                    <button onClick={() => openEdit(student)} className="edit-btn">✏️</button>
                    <button onClick={() => handleDelete(student.id)} className="delete-btn">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add Student</h2>
            <form onSubmit={handleAdd}>
              <input
                placeholder="ID Number"
                value={formData.idno}
                onChange={(e) => setFormData({...formData, idno: e.target.value})}
                required
              />
              <input
                placeholder="First Name"
                value={formData.firstname}
                onChange={(e) => setFormData({...formData, firstname: e.target.value})}
                required
              />
              <input
                placeholder="Last Name"
                value={formData.lastname}
                onChange={(e) => setFormData({...formData, lastname: e.target.value})}
                required
              />
              <input
                placeholder="Course"
                value={formData.course}
                onChange={(e) => setFormData({...formData, course: e.target.value})}
                required
              />
              <div className="modal-buttons">
                <button type="submit">Add</button>
                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Student</h2>
            <form onSubmit={handleUpdate}>
              <input
                placeholder="ID Number"
                value={formData.idno}
                onChange={(e) => setFormData({...formData, idno: e.target.value})}
                required
              />
              <input
                placeholder="First Name"
                value={formData.firstname}
                onChange={(e) => setFormData({...formData, firstname: e.target.value})}
                required
              />
              <input
                placeholder="Last Name"
                value={formData.lastname}
                onChange={(e) => setFormData({...formData, lastname: e.target.value})}
                required
              />
              <input
                placeholder="Course"
                value={formData.course}
                onChange={(e) => setFormData({...formData, course: e.target.value})}
                required
              />
              <div className="modal-buttons">
                <button type="submit">Update</button>
                <button type="button" onClick={() => {setEditModal(false); setEditId(null);}}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;