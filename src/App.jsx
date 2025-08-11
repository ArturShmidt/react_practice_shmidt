/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map(product => {
  const category =
    categoriesFromServer.find(categ => categ.id === product.categoryId) || null;
  const user = category
    ? usersFromServer.find(usr => usr.id === category.ownerId) || null
    : null;

  return {
    ...product,
    category,
    user,
  };
});

const visibleByUsers = (prod, userName) => {
  const preparedProducts = [...prod];

  if (userName && userName !== 'All') {
    return preparedProducts.filter(product => product.user.name === userName);
  }

  return preparedProducts;
};

const visibleByCat = (prod, catName) => {
  const preparedProducts = [...prod];

  if (catName && catName !== 'All') {
    return preparedProducts.filter(product => product.category.title === catName);
  }

  return preparedProducts;
}

export const App = () => {
  const [userName, setUserName] = useState('All');
  let visibleProducts = visibleByUsers(products, userName);
  const [catName, setCatName] = useState('All');
  visibleProducts = visibleByCat(visibleProducts, catName);
  const hasProducts = visibleProducts.length > 0;

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={userName === 'All' ? 'is-active' : ''}
                onClick={e => {
                  e.preventDefault();
                  setUserName('All');
                }}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  key={user.id}
                  className={userName === user.name ? 'is-active' : ''}
                  onClick={e => {
                    e.preventDefault();
                    setUserName(user.name);
                  }}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value="qwe"
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  <button
                    data-cy="ClearButton"
                    type="button"
                    className="delete"
                  />
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={catName === 'All' ? 'is-info' : ''}
                onClick={e => {
                  e.preventDefault();
                  setCatName('All');
                }}
              >
                All
              </a>

              {categoriesFromServer.map((cat) => (<a
                data-cy="Category"
                href="#/"
                key={cat.id}
                className={`button ${catName === cat.title ? 'is-info' : ''}`}
                  onClick={e => {
                    e.preventDefault();
                    setCatName(cat.title);
                  }}
              >
                {cat.title}
              </a>))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {!hasProducts && (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}

          <table
            data-cy="ProductTable"
            className="table is-striped is-narrow is-fullwidth"
          >
            <thead>
              <tr>
                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    ID
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Product
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-down" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Category
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-up" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    User
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>
              </tr>
            </thead>

            <tbody>
              {visibleProducts.map(product => {
                let userClassName = '';

                if (product.user) {
                  userClassName =
                    product.user.sex === 'm'
                      ? 'has-text-link'
                      : 'has-text-danger';
                }

                return (
                  <tr key={product.id} data-cy="Product">
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>

                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">
                      {product.category
                        ? `${product.category.icon} - ${product.category.title}`
                        : ''}
                      s
                    </td>

                    <td data-cy="ProductUser" className={userClassName}>
                      {product.category && product.user
                        ? product.user.name
                        : ''}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
