import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newUrl, setNewUrl] = useState('');

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.getAll().then(blogs => setBlogs(blogs));
    }
  }, []);

  useEffect(() => {
    if (user) {
      blogService.getAll().then(blogs => setBlogs(blogs));
    }
  }, [user]);

  const handleSignup = (event) => {
    event.preventDefault();
    const existingUsers = JSON.parse(window.localStorage.getItem('users')) || [];
    if (existingUsers.find(u => u.username === signupUsername)) {
      setErrorMessage('Username already taken');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }
    const newUser = { username: signupUsername, password: signupPassword };
    const updatedUsers = [...existingUsers, newUser];
    window.localStorage.setItem('users', JSON.stringify(updatedUsers));
    setUser(newUser);
    window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(newUser));
    setSignupUsername('');
    setSignupPassword('');
    setSuccessMessage('User registered successfully');
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handleLogin = (event) => {
    event.preventDefault();
    const users = JSON.parse(window.localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === loginUsername && u.password === loginPassword);
    if (user) {
      setUser(user);
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user));
      setLoginUsername('');
      setLoginPassword('');
      setSuccessMessage('Logged in successfully');
      setTimeout(() => setSuccessMessage(''), 5000);
    } else {
      setErrorMessage('Wrong username or password');
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  const handleLogout = () => {
    setUser(null);
    window.localStorage.removeItem('loggedBlogAppUser');
  };

  const handleBlogSubmit = async (event) => {
    event.preventDefault();
    if (!user) {
      setErrorMessage('You need to be logged in to create a blog');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }
  
    const newBlog = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
      user: user.username
    };
  
    try {
      const returnedBlog = await blogService.create(newBlog);
      setBlogs(blogs.concat(returnedBlog));
      setNewTitle('');
      setNewAuthor('');
      setNewUrl('');
      setSuccessMessage('Blog created successfully');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('Error creating blog:', error);
      setErrorMessage('Error creating blog');
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        <form onSubmit={handleLogin}>
          <div>
            Username:
            <input
              type="text"
              value={loginUsername}
              onChange={({ target }) => setLoginUsername(target.value)}
              required
            />
          </div>
          <div>
            Password:
            <input
              type="password"
              value={loginPassword}
              onChange={({ target }) => setLoginPassword(target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
        <h2>Sign up</h2>
        <form onSubmit={handleSignup}>
          <div>
            Username:
            <input
              type="text"
              value={signupUsername}
              onChange={({ target }) => setSignupUsername(target.value)}
              required
            />
          </div>
          <div>
            Password:
            <input
              type="password"
              value={signupPassword}
              onChange={({ target }) => setSignupPassword(target.value)}
              required
            />
          </div>
          <button type="submit">Sign Up</button>
        </form>
      </div>
    );
  }

  // Kullanıcıya ait blogları filtrele
  const userBlogs = blogs.filter(blog => blog.user === user.username);

  return (
    <div>
      <h2>blogs</h2>
      <p>{user.username} is logged in</p>
      <button onClick={handleLogout}>Logout</button>
      <h2>Create New Blog</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <form onSubmit={handleBlogSubmit}>
        <div>
          Title:
          <input
            type="text"
            value={newTitle}
            onChange={({ target }) => setNewTitle(target.value)}
            required
          />
        </div>
        <div>
          Author:
          <input
            type="text"
            value={newAuthor}
            onChange={({ target }) => setNewAuthor(target.value)}
            required
          />
        </div>
        <div>
          URL:
          <input
            type="text"
            value={newUrl}
            onChange={({ target }) => setNewUrl(target.value)}
            required
          />
        </div>
        <button type="submit">Create</button>
      </form>
      <h2>Your Blogs</h2>
      {userBlogs.map(blog => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
