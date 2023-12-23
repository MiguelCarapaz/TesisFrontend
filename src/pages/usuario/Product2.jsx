import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Link, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import { Navbar2, Footer2, Comentarios2 } from "../../components/usuario/usuario";
import * as actions from "../../redux/action/index";

const Product2 = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [categories, setCategories] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({
    size: "",
    color: "",
  });

  const dispatch = useDispatch();

  const addProductToCart = () => {
    const { size, color } = selectedOptions;

    if (size && color) {
      dispatch(
        actions.agregarAlCarrito({
          ...product,
          id_producto: product.id,
          nombre_producto: product.name,
          talla: size,
          color: color,
        })
      );
    } else {
      console.error("Por favor, selecciona talla y color.");
    }
  };

  const handleSizeChange = (e) => {
    const newSize = e.target.value;
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      size: newSize,
    }));
  };

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      color: newColor,
    }));
  };

  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);
      setLoading2(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/products/${id}`
        );
        const data = await response.json();
        setProduct(data.detail);
        setLoading(false);
        setLoading2(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
        setLoading2(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/category`
        );
        if (response.ok) {
          const categoriasData = await response.json();
          setCategories(categoriasData.detail);
        } else {
          console.error("Error fetching categories:", response.status);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    getProduct();
    fetchCategories();
  }, [id]);

  const Loading = () => {
    return (
      <>
        <div className="container my-5 py-2">
          <div className="row">
            <div className="col-md-6 py-3">
              <Skeleton height={400} width={400} />
            </div>
            <div className="col-md-6 py-5">
              <Skeleton height={30} width={250} />
              <Skeleton height={90} />
              <Skeleton height={40} width={70} />
              <Skeleton height={50} width={110} />
              <Skeleton height={120} />
              <Skeleton height={40} width={110} inline={true} />
              <Skeleton className="mx-3" height={40} width={110} />
            </div>
          </div>
        </div>
      </>
    );
  };

  const ShowProduct = () => {
    const categoryName = categories.find(cat => cat.id === product.category)?.name || "Desconocida";

    return (
      <>
        <div className="container my-5 py-2">
          <div className="row">
            <div className="col-md-6 col-sm-12 py-3">
              <div className="image-container">
                <img
                  className="img-fluid"
                  src={product.imagen?.[currentImageIndex]?.secure_url || ''}
                  alt={product.name}
                />
                {product.imagen && product.imagen.length > 1 && (
                  <>
                    <FaChevronLeft
                      className="arrow left-arrow"
                      onClick={() => setCurrentImageIndex((prevIndex) => (prevIndex - 1 + product.imagen.length) % product.imagen.length)}
                    />
                    <FaChevronRight
                      className="arrow right-arrow"
                      onClick={() => setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.imagen.length)}
                    />
                  </>
                )}
              </div>
              {product.imagen && product.imagen.length > 1 && (
                <div className="thumbnail-container mt-3">
                  {product.imagen.map((img, index) => (
                    <img
                      key={index}
                      className={`thumbnail ${index === currentImageIndex ? 'selected' : ''}`}
                      src={img.secure_url}
                      alt={product.name}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="col-md-6 col-md-6 py-5">
              <h4 className="text-uppercase text-muted">{categoryName}</h4>
              <h1 className="display-5">{product.name}</h1>
              <h3 className="display-6  my-4">${product.precio}</h3>
              <p className="lead">{product.descripcion}</p>
              <div className="form-group">
                <label htmlFor={`selectSize${id}`}>Talla:</label>
                <select
                  className="form-control"
                  id={`selectSize${id}`}
                  onChange={handleSizeChange}
                  value={selectedOptions.size || ""}
                >
                  <option key="" value="" disabled>
                    Selecciona una talla
                  </option>
                  {product.tallas &&
                    Array.isArray(product.tallas) &&
                    product.tallas.map((talla, index) => (
                      <option
                        key={`${talla.name}-${talla.status}`}
                        value={talla.name}
                      >
                        {talla.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor={`selectColor${id}`}>Color:</label>
                <select
                  className="form-control"
                  id={`selectColor${id}`}
                  onChange={handleColorChange}
                  value={selectedOptions.color || ""}
                >
                  <option key="" value="" disabled>
                    Selecciona un color
                  </option>
                  {product.colores &&
                    Array.isArray(product.colores) &&
                    product.colores.map((color, index) => (
                      <option key={index} value={color.name}>
                        {color.name}
                      </option>
                    ))}
                </select>
              </div>
            <button className="btn btn-outline-dark" onClick={addProductToCart}>
              Añadir al carrito
            </button>
            <Link to="/usuario/cart" className="btn btn-dark mx-3">
              Ir al carrito
            </Link>
          </div>
        </div>
        <Comentarios2 productId={product.id} />
        </div>
        </>
        
    );
  };

  return (
    <>
      <Navbar2 />
      <div className="container">
        <div className="row">{loading ? <Loading /> : <ShowProduct />}</div>
        <div className="row my-5 py-5">
          <div className="d-none d-md-block"></div>
        </div>
      </div>
      <Footer2 />
      <style>{`
        .image-container {
          position: relative;
        }
        
        .arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          font-size: 2rem;
          cursor: pointer;
        }
        
        .left-arrow {
          left: 10px;
        }
        
        .right-arrow {
          right: 10px;
        }
        
        .thumbnail-container {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          margin-top: 10px;
        }
        
        .thumbnail {
          width: 60px;
          height: 60px;
          cursor: pointer;
          border: 2px solid #ddd;
          border-radius: 4px;
        }
        
        .selected {
          border-color: #4caf50;
        }
        
        .img-fluid {
          width: 320px; 
          height: 320px; 
        }
      `}</style>
    </>
  );
};
export default Product2;
