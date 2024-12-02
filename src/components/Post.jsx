import React from "react";

function Post({
  post: { id, titulo, img, descripcion, likes },
  onLike,
  onDelete,
}) {
  // Manejar la acción de dar "like"
  const handleLike = async () => {
    try {
      const response = await fetch(`http://localhost:3000/posts/${id}/like`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const updatedPost = await response.json();
        onLike(updatedPost); // Notifica al componente padre sobre el cambio en "likes"
      } else {
        console.error("Error al incrementar los likes");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Manejar la acción de eliminar un post
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/posts/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onDelete(id); // Notifica al componente padre sobre la eliminación
      } else {
        console.error("Error al eliminar el post");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="card col-12 col-sm-4 d-inline mx-0 px-3">
      <div className="card-body p-0">
        <img className="card-img-top" src={img} alt={titulo} />
        <div className="p-3">
          <h4 className="card-title">{titulo}</h4>
          <p className="card-text">{descripcion}</p>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <i
                onClick={handleLike}
                className={`fa-heart fa-xl ${
                  likes ? "fa-solid" : "fa-regular"
                }`}
              ></i>
              <span className="ms-1">{likes}</span>
            </div>
            <i onClick={handleDelete} className="fa-solid fa-x"></i>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
