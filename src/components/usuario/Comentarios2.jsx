import React, { useEffect, useState, useContext } from 'react';
import StarRating2 from './StarRating2';
import { AuthContext } from '../../context/AuthProvider';
import Swal from 'sweetalert2'; // Importa SweetAlert2

const Comentario = ({ comentario }) => (
  <div style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px' }}>
    <StarRating2 rating={comentario.calificacion} starSize="32px" filledColor="gold" emptyColor="lightgray" />
    <p style={{ marginTop: '5px' }}>
      <strong>Usuario:</strong> {`${comentario.user_id.nombre} ${comentario.user_id.apellido}`}
    </p>
    <p>{comentario.descripcion}</p>
  </div>
);

const Comentarios2 = ({ productId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const { auth, perfilLoaded } = useContext(AuthContext);

  const [newComment, setNewComment] = useState({
    descripcion: '',
    calificacion: 0,
  });

  const [userComment, setUserComment] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [initialCommentsLoaded, setInitialCommentsLoaded] = useState(false);

  const [commentError, setCommentError] = useState('');

  const hasUserCommented = () => {
    return userComment !== null && comments.length > 0;
  };

  const fetchComments2 = async () => {
    setLoading(true);
    try {
      const storedId = localStorage.getItem('id');
      console.log('Stored ID:', storedId);

      if (!perfilLoaded || !storedId) {
        console.error('ID de usuario no válido:', storedId);
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/comments?id_producto=${productId}`);
      const data = await response.json();

      const fetchedComments = data.detail
        .map((detailItem) => detailItem.result || [])
        .flat()
        .filter((comment) => comment.id_producto === productId);

      setComments(fetchedComments);

      const userComment = fetchedComments.find((comment) => comment.user_id?.id === storedId);
      setUserComment(userComment);

      console.log('Comentarios del producto:', fetchedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
      setInitialCommentsLoaded(true);
    }
  };

  useEffect(() => {
    fetchComments2();
  }, [productId]);

  const handleRatingChange = (rating) => {
    setNewComment((prevComment) => ({ ...prevComment, calificacion: rating }));
  };

  const handleCommentChange = (event) => {
    setNewComment((prevComment) => ({ ...prevComment, descripcion: event.target.value }));
    setCommentError(''); // Limpiar mensaje de error al escribir en el campo
  };

  const handlePostComment = async () => {
    try {
      const storedId = localStorage.getItem('id');
      console.log('Stored ID:', storedId);

      if (!perfilLoaded || !storedId) {
        console.error('ID de usuario no válido:', storedId);
        return;
      }

      if (!newComment.descripcion) {
        setCommentError('Campo de comentario obligatorio');
        return;
      }

      if (hasUserCommented()) {
        setShowMessage(true);
        return;
      }

      const method = hasUserCommented() ? 'PUT' : 'POST';
      const url = hasUserCommented()
        ? `${import.meta.env.VITE_API_BASE_URL}/comments/${userComment._id}`
        : `${import.meta.env.VITE_API_BASE_URL}/comments`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.authToken}`,
        },
        body: JSON.stringify({
          descripcion: newComment.descripcion,
          user_id: storedId,
          id_producto: productId,
          calificacion: newComment.calificacion,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        fetchComments2();
        setNewComment({ descripcion: '', calificacion: 0 });
        setCommentError(''); // Limpiar mensaje de error
        setShowMessage(false);

        Swal.fire({
          icon: 'success',
          title: 'Comentario creado exitosamente',
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        const errorData = await response.json();
        console.error('Error al realizar la solicitud POST/PUT:', errorData);
      }
    } catch (error) {
      console.error('Error en la solicitud POST/PUT:', error);
    }
  };

  const handleUpdateComment = async () => {
    try {
      const storedId = localStorage.getItem('id');
      console.log('Stored ID:', storedId);

      if (!perfilLoaded || !storedId) {
        console.error('ID de usuario no válido:', storedId);
        return;
      }

      if (!newComment.descripcion) {
        setCommentError('Campo de comentario obligatorio');
        return;
      }

      if (!userComment || !userComment.id) {
        console.error('No hay comentario para actualizar');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/comments/${userComment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.authToken}`,
        },
        body: JSON.stringify({
          descripcion: newComment.descripcion,
          user_id: storedId,
          id_producto: productId,
          calificacion: newComment.calificacion,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        fetchComments2();
        setNewComment({ descripcion: '', calificacion: 0 });
        setCommentError(''); // Limpiar mensaje de error
        setShowMessage(false);

        Swal.fire({
          icon: 'success',
          title: 'Comentario actualizado exitosamente',
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        const errorData = await response.json();
        console.error('Error al realizar la solicitud PUT:', errorData);
      }
    } catch (error) {
      console.error('Error en la solicitud PUT:', error);
    }
  };

  return (
    <>
      {loading && <p>Cargando comentarios...</p>}
      {!loading && (
        <div>
          <h3>Comentarios:</h3>
          {comments.length === 0 && <p>No hay comentarios disponibles.</p>}
          {comments.map((comment) => (
            <Comentario key={comment.id} comentario={comment} />
          ))}
          <div style={{ marginTop: '20px' }}>
            <h5>Agregar Comentario:</h5>
            <StarRating2
              rating={newComment.calificacion}
              onRatingChange={handleRatingChange}
              starSize="32px"
              filledColor="gold"
              emptyColor="lightgray"
              clickable
            />
            <textarea
              placeholder="Escribe tu comentario..."
              value={newComment.descripcion}
              onChange={handleCommentChange}
            ></textarea>
            {commentError && <p style={{ color: 'red', marginTop: '10px' }}>{commentError}</p>}
            <div>
              {hasUserCommented() ? (
                <>
                  <button onClick={handleUpdateComment} className="btn btn-primary mt-2" disabled={showMessage}>
                    Actualizar Comentario
                  </button>
                  {showMessage && (
                    <p style={{ color: 'red', marginTop: '10px' }}>
                      Ya has comentado en este producto. Puedes actualizar tu comentario.
                    </p>
                  )}
                </>
              ) : (
                <button onClick={handlePostComment} className="btn btn-primary mt-2">
                  Publicar Comentario
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Comentarios2;
