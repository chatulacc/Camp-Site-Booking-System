import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaPinterest, FaChevronDown } from 'react-icons/fa';


const Footer = () => {
  return (
    <footer 
      className="py-5 text-white" 
      style={{
        backgroundImage: "linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.pexels.com/photos/28811916/pexels-photo-28811916/free-photo-of-scenic-view-of-emerald-lake-in-canadian-rockies.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#2C3E50' // fallback color
      }}>
      <div className="container">
        <div className="row">
          <div className="col-lg-3 col-md-6 mb-4 mb-lg-0">
            <h5 className="text-uppercase mb-3">Inspiration</h5>
            <ul className="list-unstyled">
              {['Dog-friendly camping', 'Lodge holidays', 'Tipis, yurts and glamping', 'Static caravans', 'Camping holidays', 'Camping pods', 'Holiday parks', 'Touring caravans', 'Motorhomes and camper vans', 'More inspiration...'].map((item, index) => (
                <li key={index}><a href="#" className="text-white-50 text-decoration-none">{item}</a></li>
              ))}
            </ul>
          </div>
          <div className="col-lg-3 col-md-6 mb-4 mb-lg-0">
            <h5 className="text-uppercase mb-3">About Campzip.com</h5>
            <ul className="list-unstyled">
              {['Customer FAQs', 'About us', 'Jobs', 'Terms and conditions', 'Privacy policy', 'Site map', 'Log in', 'Widget builder', 'Contact us'].map((item, index) => (
                <li key={index}><a href="#" className="text-white-50 text-decoration-none">{item}</a></li>
              ))}
            </ul>
          </div>
          <div className="col-lg-3 col-md-6 mb-4 mb-lg-0">
            <h5 className="text-uppercase mb-3">Promote your site</h5>
            <ul className="list-unstyled">
              {['Log in to manager portal', 'Site manager FAQs', 'Add your campsite', 'Testimonials', 'Integration - API and calendar', 'Contact Pitchup.com'].map((item, index) => (
                <li key={index}><a href="#" className="text-white-50 text-decoration-none">{item}</a></li>
              ))}
            </ul>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="mb-4 position-relative">
              <select className="form-select bg-transparent text-white border-0" style={{paddingRight: '40px'}}>
                <option>British English</option>
              </select>
              <FaChevronDown className="position-absolute top-50 translate-middle-y end-0 me-3 text-white" />
            </div>
            <div className="position-relative">
              <select className="form-select bg-transparent text-white border-0" style={{paddingRight: '40px'}}>
                <option>British Pound</option>
              </select>
              <FaChevronDown className="position-absolute top-50 translate-middle-y end-0 me-3 text-white" />
            </div>
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-md-12 text-center">
            <div className="d-flex justify-content-center">
              {[
                { icon: FaFacebookF, bgColor: '#3b5998' },
                { icon: FaTwitter, bgColor: '#1DA1F2' },
                { icon: FaInstagram, bgColor: '#E1306C' },
                { icon: FaLinkedinIn, bgColor: '#0077b5' },
                { icon: FaPinterest, bgColor: '#E60023' }
              ].map(({ icon: Icon, bgColor }, index) => (
                <a 
                  href="#" 
                  key={index}
                  className="me-3 rounded-circle d-flex align-items-center justify-content-center" 
                  style={{ width: '40px', height: '40px', backgroundColor: bgColor, transition: 'transform 0.3s' }}
                  onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.1)')}
                  onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <Icon className="text-white" size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
