import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PackageUser.css';
import NavigationUser from '../NavigationUser';
import Footer from '../Footer';

const PackagesUser = () => {
  const [packagesData, setPackagesData] = useState([]);

  const fetchPackages = async () => {
    try {
      const response = await fetch('http://localhost:5000/package');
      if (!response.ok) {
        throw new Error('Failed to fetch packages');
      }
      const data = await response.json();

      // Construct the full image URL and ensure forward slashes
      const packagesWithImageUrl = data.map(pkg => ({
        ...pkg,
        image: pkg.image ? `http://localhost:5000/uploads/${pkg.image.replace(/\\/g, '/')}` : null
      }));

      setPackagesData(packagesWithImageUrl);
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  return (
    <div>
      <NavigationUser/>
      <div className="container my-5">
      <h1 className="text-center mb-4">Our Camping Packages</h1>
      <div className="row">
        {packagesData.map((pkg, index) => (
          <div className="col-md-6 col-lg-3 mb-4" key={index}>
            <div className="card package-card">
              {pkg.image && <img src={pkg.image} className="card-img-top" alt={pkg.name} />}
              <div className="card-body">
                <h5 className="card-title">{pkg.name}</h5>
                <p className="card-text">{pkg.description}</p>
                <p className="package-price">Rs.{pkg.price}.00/=</p>
                <button className="btn btn-success">Enroll Now</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
      <Footer/>
    </div>
  );
};

export default PackagesUser;
