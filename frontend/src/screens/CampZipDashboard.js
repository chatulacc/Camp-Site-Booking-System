import React from 'react';
import { CardDefault } from './FunctionCard';

export default function CampZipDashboard() {
  const cardData = [
    {
      name: 'Booking',
      path: '/Bookingdil',
      link: 'https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
      name: 'Camping Packages',
      path: '/camp-packages',
      link: 'https://images.pexels.com/photos/1322068/pexels-photo-1322068.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
      name: 'Tour Guides',
      path: '/tour-guides',
      link: 'https://images.pexels.com/photos/2258339/pexels-photo-2258339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
      name: 'Camping Events',
      path: '/addE',
      link: 'https://images.pexels.com/photos/2480520/pexels-photo-2480520.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
      name: 'Inventory Items',
      path: '/inv-management',
      link: 'https://images.pexels.com/photos/28896646/pexels-photo-28896646/free-photo-of-cozy-camper-van-in-sunlit-forest-setting.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
    {
      name: 'Inquaries',
      path: '/feedback-management',
      link: 'https://images.pexels.com/photos/891059/pexels-photo-891059.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
      name: 'Supplier Manager',
      path: '/supman',
      link: 'https://images.pexels.com/photos/28902994/pexels-photo-28902994/free-photo-of-scenic-camping-in-uinta-mountains-utah.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
      name: 'Employee',
      path: '/Emplo',
      link: 'https://images.pexels.com/photos/28886804/pexels-photo-28886804/free-photo-of-winter-camping-adventure-in-westernohe-forest.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
  ];

  // Split cards into two groups
  const leftCards = cardData.slice(0, 4);
  const rightCards = cardData.slice(4, 8);

  return (
    <div className="container my-5">
      <div className="row">
        {/* Left Column */}
        <div className="col-md-6">
          {leftCards.map((card, index) => (
            <div className="mb-4" key={index}>
              <CardDefault name={card.name} path={card.path} link={card.link} />
            </div>
          ))}
        </div>
        {/* Right Column */}
        <div className="col-md-6">
          {rightCards.map((card, index) => (
            <div className="mb-4" key={index}>
              <CardDefault name={card.name} path={card.path} link={card.link} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
