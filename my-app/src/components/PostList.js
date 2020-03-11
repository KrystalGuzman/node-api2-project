import React, { useState } from "react";
import axios from "axios";

const initialPost = {
  title: "",
  contents: ""
};

const PostList = ({ posts, updatePosts }) => {
  console.log("posts",posts);
  const [editing, setEditing] = useState(false);
  const [postToEdit, setPostToEdit] = useState(initialPost);
  const [postToDelete, setPostToDelete] = useState();
  const [adding, setAdding] = useState(false);
  const [postToAdd, setPostToAdd] = useState({
    title: "",
    contents: ""
  });

  const addPost = e => {
    axios
      .post('http://localhost:5000/api/posts', postToAdd)
      .then(res => {
        // setPostToAdd(res.data)
        console.log(res.data);
        updatePosts(...posts, res.data);
        console.log('Post Added!');
      })
      .catch(err => console.log(err));
  };

  const editPost = post => {
    setEditing(true);
    setPostToEdit(post);
  };

  const saveEdit = e => {
    e.preventDefault();
    // Make a put request to save your updated post
    // think about where will you get the id from...
    // where is is saved right now?
    axios
    .put(`http://localhost:5000/api/posts/${postToEdit.id}`, postToEdit)
    .then(res => {
      console.log(res.data);
      axios
      .get(`http://localhost:5000/api/posts`)
      .then(response => {
        updatePosts(response.data);
        window.location.reload();
      });
    })
    .catch(err => console.log(err));
  };

  const deletePost = post => {
    // make a delete request to delete this post
    axios
    .delete( `http://localhost:5000/api/posts/${post.id}`)
    .then(res => {
      console.log("delete:",res)
      setPostToDelete(res)
      window.location.reload();
    })
    .catch(err => console.log(err))
  };

  return (
    <div className="posts-wrap">
      <p>posts</p>
      <ul>
        {posts.map(post => (
          <li key={post.title} onClick={() => editPost(post)}>
            <span>
              <span className="delete" onClick={e => {
                    e.stopPropagation();
                    deletePost(post)
                  }
                }>
                  x
              </span>{" "}
              {post.title}
            </span>
            <div
              className="post-box"
            />
          </li>
        ))}
      </ul>
      {editing && (
        <form onSubmit={saveEdit}>
          <legend>edit post</legend>
          <label>
            title:
            <input
              onChange={e =>
                setPostToEdit({ ...postToEdit, title: e.target.value })
              }
              value={postToEdit.name}
            />
          </label>
          <label>
            contents:
            <input
              onChange={e =>
                setPostToEdit({
                  ...postToEdit,
                  contents: e.target.value
                })
              }
              value={postToEdit.contents}
            />
          </label>
          <div className="button-row">
            <button type="submit">save</button>
            <button onClick={() => setEditing(false)}>cancel</button>
          </div>
        </form>
      )}
      <span className="add" onClick={() => setAdding(true)}>add post</span>
      {adding && (
        <form className="add-form" onSubmit={addPost}>
          <legend>add post</legend>
          <label>
            title:
            <input
              onChange={e =>
                setPostToAdd({ ...postToAdd, title: e.target.value })
              }
              value={postToAdd.title}
            />
          </label>
          <label>
            contents:
            <input
              onChange={e =>
                setPostToAdd({
                  ...postToAdd,
                  contents: e.target.value
                })
              }
              value={postToAdd.contents}
            />
          </label>
          <div className="button-row">
            <button type="submit">add</button>
            <button onClick={() => setAdding(false)}>cancel</button>
          </div>
        </form>
      )}
      <div className="spacer" />

    </div>
  );
};

export default PostList;
