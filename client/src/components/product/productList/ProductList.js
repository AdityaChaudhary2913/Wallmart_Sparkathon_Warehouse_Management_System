import React, { useEffect, useState } from "react";
import { SpinnerImg } from "../../loader/Loader";
import "./productList.scss";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { AiOutlineEye } from "react-icons/ai";
import Search from "../../search/Search";
import { useDispatch, useSelector } from "react-redux";
import {
  FILTER_PRODUCTS,
  selectFilteredPoducts,
} from "../../../redux/features/product/filterSlice";
import ReactPaginate from "react-paginate";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import {
  deleteProduct,
  getProducts,
} from "../../../redux/features/product/productSlice";
import { Link } from "react-router-dom";

const ProductList = ({ products, isLoading }) => {
  const [search, setSearch] = useState("");
  const [warehouseMap, setWarehouseMap] = useState({});
  const filteredProducts = useSelector(selectFilteredPoducts);

  const dispatch = useDispatch();

  const shortenText = (text, n) => {
    if (text && text.length > n) {
      return text.substring(0, n).concat("...");
    }
    return text;
  };

  const delProduct = async (id) => {
    await dispatch(deleteProduct(id));
    await dispatch(getProducts());
  };

  const confirmDelete = (id) => {
    confirmAlert({
      title: "Delete Product",
      message: "Are you sure you want to delete this product.",
      buttons: [
        {
          label: "Delete",
          onClick: () => delProduct(id),
        },
        {
          label: "Cancel",
        },
      ],
    });
  };

  // Pagination setup
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(filteredProducts.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(filteredProducts.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, filteredProducts]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % filteredProducts.length;
    setItemOffset(newOffset);
  };

  useEffect(() => {
    dispatch(FILTER_PRODUCTS({ products, search }));
  }, [products, search, dispatch]);

  // Fetch warehouse data for each product
  useEffect(() => {
    const fetchWarehouseData = async () => {
      const warehouseData = {};
      for (let product of filteredProducts) {
        if (product.currentStop) {
          const warehouse = await getWarehouse(product.currentStop);
          warehouseData[product._id] = warehouse; // Map warehouse data by product ID
        }
      }
      setWarehouseMap(warehouseData);
    };

    if (filteredProducts.length > 0) {
      fetchWarehouseData();
    }
  }, [filteredProducts]);

  const getWarehouse = async (id) => {
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    const API_URL = `${BACKEND_URL}/api/warehouses/${id}`;

    try {
      const res = await fetch(API_URL, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  return (
    <div className="product-list">
      <hr />
      <div className="table">
        <div className="--flex-between --flex-dir-column">
          <span>
            <h3>Inventory Items</h3>
          </span>
          <span>
            <Search
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </span>
        </div>

        {isLoading && <SpinnerImg />}

        <div className="table">
          {!isLoading && products.length === 0 ? (
            <p>-- No product found, please add a product...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>s/n</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Value</th>
                  <th>Current Location</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {currentItems.map((product, index) => {
                  const { _id, name, category, price, quantity } = product;
                  const warehouse = warehouseMap[_id];

                  return (
                    <tr key={_id}>
                      <td>{index + 1}</td>
                      <td>{shortenText(name, 16)}</td>
                      <td>{category}</td>
                      <td>
                        {"$"}
                        {price}
                      </td>
                      <td>{quantity}</td>
                      <td>
                        {"$"}
                        {price * quantity}
                      </td>
                      <td>{warehouse ? shortenText(warehouse.name, 16) : "Loading..."}</td>
                      <td className="icons">
                        <span>
                          <Link to={`/product-detail/${_id}`}>
                            <AiOutlineEye size={25} color={"purple"} />
                          </Link>
                        </span>
                        <span>
                          <Link to={`/edit-product/${_id}`}>
                            <FaEdit size={20} color={"green"} />
                          </Link>
                        </span>
                        <span>
                          <FaTrashAlt
                            size={20}
                            color={"red"}
                            onClick={() => confirmDelete(_id)}
                          />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        <ReactPaginate
          breakLabel="..."
          nextLabel="Next"
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          pageCount={pageCount}
          previousLabel="Prev"
          renderOnZeroPageCount={null}
          containerClassName="pagination"
          pageLinkClassName="page-num"
          previousLinkClassName="page-num"
          nextLinkClassName="page-num"
          activeLinkClassName="activePage"
        />
      </div>
    </div>
  );
};

export default ProductList;
