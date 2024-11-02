
import './App.css';
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from "react";

function App() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFiltredPosts] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [detailPost, setDetailPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', body: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editPostId, setEditPostId] = useState(null);

  useEffect(() => {
    axios.get("https://jsonplaceholder.typicode.com/posts")
      .then(result => {
        const sortedPosts = result.data.sort((a, b) => b.id - a.id); 
        setPosts(sortedPosts);
        setFiltredPosts(sortedPosts);
      })
      .catch(err => console.error(err));
  }, []);

  const handleSearch = () => {
    if (searchId === '') {
      setFiltredPosts(posts);
    } else {
      const filtred = posts.filter(post => post.id === parseInt(searchId));
      setFiltredPosts(filtred);
    }
  };

  const viewDetailPost = async (postId) => {
    try {
      const result = await axios.get(`https://jsonplaceholder.typicode.com/posts/${postId}`);
      setDetailPost(result.data);
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setDetailPost(null);
  };

  const addOrUpdatePost = () => {
    if (isEditing) {
      const updatedPosts = posts.map(post =>
        post.id === editPostId ? { ...post, title: newPost.title, body: newPost.body } : post
      );
      setPosts(updatedPosts.sort((a, b) => b.id - a.id));
      setFiltredPosts(updatedPosts.sort((a, b) => b.id - a.id));
      setIsEditing(false);
      setEditPostId(null);
    } else {
      const newPostData = { ...newPost, id: posts.length + 1 };
      const updatedPosts = [newPostData, ...posts].sort((a, b) => b.id - a.id); 
      setPosts(updatedPosts);
      setFiltredPosts(updatedPosts);
    }
    setNewPost({ title: '', body: '' });
  };

  const startEditing = (post) => {
    setNewPost({ title: post.title, body: post.body });
    setIsEditing(true);
    setEditPostId(post.id);
  };

  return (
    <div className="container">
      <form>
        <input type="text"
          placeholder="Recherche par ID"
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button type="button" className="btn btn-warning m-2" onClick={handleSearch}>Rechercher</button>
        <h2>Liste des publications</h2>
        
        {}
        <div>
          <input
            type="text"
            placeholder="Titre"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            className="form-control my-2"
          />
          <textarea
            placeholder="Contenu"
            value={newPost.body}
            onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
            className="form-control my-2"
          />
          <button type="button" className="btn btn-success m-2" onClick={addOrUpdatePost}>
            {isEditing ? "Mettre à jour" : "Ajouter"}
          </button>
        </div>

        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {
              filteredPosts.length > 0 ? filteredPosts.map(post => (
                <tr key={post.id}>
                  <td>{post.id}</td>
                  <td>{post.title}</td>
                  <td>
                    <button type="button" className="btn btn-danger m-2" onClick={() => {
                      setFiltredPosts(filteredPosts.filter(item => item !== post));
                      setPosts(posts.filter(item => item.id !== post.id));
                    }}>Supprimer</button>
                    <button type="button" className="btn btn-info m-2" onClick={() => viewDetailPost(post.id)}>Voir Détail</button>
                    <button type="button" className="btn btn-primary m-2" onClick={() => startEditing(post)}>Éditer</button>
                  </td>
                </tr>
              )) : <td colSpan={3} className="text-center fw-bold">Aucune publication</td>
            }
          </tbody>
        </table>

        {
          isModalOpen && detailPost && (
            <div className="modale">
              <div className="modale-content">
                <span className="close-button" onClick={closeModal}>&times;</span>
                <label>ID :</label>
                <input type="text" className="form-control" readOnly value={detailPost.id} />
                <label>Titre :</label>
                <input type="text" className="form-control" readOnly value={detailPost.title} />
                <label>Body :</label>
                <textarea className="form-control" readOnly value={detailPost.body} />
              </div>
            </div>
          )
        }
      </form>
    </div>
  );
}

export default App;
