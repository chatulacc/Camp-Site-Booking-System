import React from 'react';

export function CardDefault({ name, path, link }) {
  return (
    <div className="card">
      <img src={link} className="card-img-top" alt={name} />
      <div className="card-body">
        <h5 className="card-title">{name}</h5>
        <a href={path} className="btn btn-primary">
          Go to {name}
        </a>
      </div>
    </div>
  );
}
