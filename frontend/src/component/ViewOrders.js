import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import Navigation from './NavigationInventory';

const mockOrders = [
  {
    id: 1,
    items: [
      { itemId: 1, quantity: 5, supplier: 'Supplier A', notes: 'Urgent' },
      { itemId: 2, quantity: 10, supplier: 'Supplier B', notes: '' },
    ],
    dateAdded: '2024-08-24',
  },
  {
    id: 2,
    items: [
      { itemId: 3, quantity: 3, supplier: 'Supplier C', notes: '' },
    ],
    dateAdded: '2024-08-23',
  },
];

export default function ViewOrder() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // Replace with actual data fetching
    setOrders(mockOrders);
  }, []);

  const handleUpdate = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const handleDelete = (orderId) => {
    // Placeholder for delete logic
    console.log('Delete order with ID:', orderId);
    setOrders(orders.filter(order => order.id !== orderId));
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedOrder(null);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log('Updated order:', selectedOrder);
    // Add logic to update the order in your backend or state
    handleModalClose();
  };

  const handleInputChange = (e, itemId, field) => {
    const { value } = e.target;
    setSelectedOrder({
      ...selectedOrder,
      items: selectedOrder.items.map(item =>
        item.itemId === itemId ? { ...item, [field]: value } : item
      )
    });
  };

  return (
    <div className="container mt-5">
       <div className="navigation">
        
        <Navigation/>
       </div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>View Orders</h2>
        <Link to="/new-order">
          <button className="btn btn-info">Back to New Order</button>
        </Link>
      </div>
      {orders.length === 0 ? (
        <p>No orders available</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="mb-4">
            <h4>Order ID: {order.id}</h4>
            <p>Date Added: {order.dateAdded}</p>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Item Name</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Supplier</th>
                  <th scope="col">Notes</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{`Item ${item.itemId}`}</td> {/* Replace with actual item name */}
                    <td>{item.quantity}</td>
                    <td>{item.supplier}</td>
                    <td>{item.notes}</td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm me-2"
                        onClick={() => handleUpdate(order)}
                      >
                        Update
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(order.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}

      {/* Modal for Updating Order */}
      {selectedOrder && (
        <div className={`modal fade ${modalVisible ? 'show' : ''}`} style={{ display: modalVisible ? 'block' : 'none' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Order ID: {selectedOrder.id}</h5>
                <button type="button" className="btn-close" onClick={handleModalClose}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleFormSubmit}>
                  {selectedOrder.items.map((item) => (
                    <div key={item.itemId} className="mb-3">
                      <label htmlFor={`quantity-${item.itemId}`} className="form-label">
                        Quantity for Item {item.itemId}
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id={`quantity-${item.itemId}`}
                        value={item.quantity}
                        onChange={(e) => handleInputChange(e, item.itemId, 'quantity')}
                        required
                      />
                      <label htmlFor={`supplier-${item.itemId}`} className="form-label mt-3">
                        Supplier for Item {item.itemId}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id={`supplier-${item.itemId}`}
                        value={item.supplier}
                        onChange={(e) => handleInputChange(e, item.itemId, 'supplier')}
                        required
                      />
                      <label htmlFor={`notes-${item.itemId}`} className="form-label mt-3">
                        Notes for Item {item.itemId}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id={`notes-${item.itemId}`}
                        value={item.notes}
                        onChange={(e) => handleInputChange(e, item.itemId, 'notes')}
                      />
                    </div>
                  ))}
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={handleModalClose}>
                      Close
                    </button>
                    <button type="submit" className="btn btn-primary">Save changes</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
