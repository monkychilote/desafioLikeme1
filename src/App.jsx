import axios from "axios";
import { useEffect, useState } from "react";
import Form from "./components/Form";
import Post from "./components/Post";

// Inicio de App.jsx o del archivo donde esté agregarPost
async function shortenURL(longURL) {
  try {
    const response = await fetch(
      `http://tinyurl.com/api-create.php?url=${encodeURIComponent(longURL)}`
    );

    if (response.ok) {
      return await response.text(); // Retorna la URL acortada
    } else {
      throw new Error("Error al acortar la URL");
    }
  } catch (error) {
    console.error("Error:", error.message);
    return longURL; // Si hay un error, usa la URL original
  }
}

const urlBaseServer = "http://localhost:3000";

function App() {
  const [titulo, setTitulo] = useState("");
  const [imgSrc, setImgSRC] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [posts, setPosts] = useState([]);

  const getPosts = async () => {
    const { data: posts } = await axios.get(urlBaseServer + "/posts");
    setPosts([...posts]);
  };

  const agregarPost = async () => {
    try {
      // Acorta la URL de la imagen antes de enviarla
      const shortenedImg = await shortenURL(imgSrc);

      const post = {
        titulo,
        img: shortenedImg, // Usa la URL acortada
        descripcion,
      };

      console.log("Datos enviados al backend:", post);

      // Envía el post al backend
      await axios.post(urlBaseServer + "/posts", post);
      getPosts(); // Refresca los posts
    } catch (error) {
      console.error("Error al agregar el post:", error);
    }
  };

  // este método se utilizará en el siguiente desafío
  const like = async (id) => {
    await axios.put(urlBaseServer + `/posts/like/${id}`);
    getPosts();
  };

  // este método se utilizará en el siguiente desafío
  const eliminarPost = async (id) => {
    await axios.delete(urlBaseServer + `/posts/${id}`);
    getPosts();
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className="App">
      <h2 className="py-5 text-center">&#128248; Like Me &#128248;</h2>
      <div className="row m-auto px-5">
        <div className="col-12 col-sm-4">
          <Form
            setTitulo={setTitulo}
            setImgSRC={setImgSRC}
            setDescripcion={setDescripcion}
            agregarPost={agregarPost}
          />
        </div>
        <div className="col-12 col-sm-8 px-5 row posts align-items-start">
          {posts.map((post, i) => (
            <Post key={i} post={post} like={like} eliminarPost={eliminarPost} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
