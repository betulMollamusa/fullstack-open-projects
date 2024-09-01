
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery, useMutation } from '@tanstack/react-query';
import Menu from './components/Menu';
import AnecdoteList from './components/AnecdoteList';
import Anecdote from './components/Anecdote';
import CreateNew from './components/CreateNew';
import About from './components/About';
import Footer from './components/Footer';
import { setNotification } from './redux/notificationSlice.js';
import { setBlogs, addBlog } from './redux/blogSlice.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const App = () => {
  const dispatch = useDispatch();
  const blogs = useSelector(state => state.blogs);
  const notification = useSelector(state => state.notification);

  const { data: blogData } = useQuery('blogs', () => fetch('http://localhost:3000/anecdotes').then(res => res.json()), {
    onSuccess: (data) => dispatch(setBlogs(data)),
  });

  const addNewMutation = useMutation(newBlog => {
    return fetch('http://localhost:3000/anecdotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBlog)
    }).then(res => res.json());
  }, {
    onSuccess: (data) => {
      dispatch(addBlog(data));
      dispatch(setNotification(`A new anecdote "${data.content}" created!`));
      setTimeout(() => {
        dispatch(setNotification(''));
      }, 5000);
    }
  });

  if (blogData) {
    return (
      <Router>
        <QueryClientProvider client={queryClient}>
          <div>
            <Menu />
            {notification && <div>{notification}</div>}
            <Routes>
              <Route path='/' element={<AnecdoteList anecdotes={blogs} />} />
              <Route path='/create' element={<CreateNew addNew={addNewMutation.mutate} setNotification={dispatch(setNotification)} />} />
              <Route path='/about' element={<About />} />
              <Route path='/anecdotes/:id' element={<Anecdote anecdotes={blogs} />} />
            </Routes>
            <Footer />
          </div>
        </QueryClientProvider>
      </Router>
    );
  }

  return null;
};

export default App;
