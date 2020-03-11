import React, {useState, useEffect} from 'react';
import './App.css';
import axios from 'axios';
import PostList from './components/PostList';

function App() {
  const [postList, setPostList] = useState([]);
  useEffect(() =>{
    axios
      .get('http://localhost:5000/api/posts')
      .then(res=>setPostList(res.data))
      .catch(err=>console.log("stopped here", err))
    }, [])
  return (
    <PostList posts={postList} updatePosts={setPostList} />

  );
}

export default App;