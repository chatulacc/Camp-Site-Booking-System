import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import Swal from "sweetalert2";

function UpdateBookingScreen() {
  const location = useLocation();
  const bookingDetails = location.state?.bookingDetails || {};
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    camplocation: bookingDetails.camplocation || "",
    fromDate: bookingDetails.fromDate
      ? moment(bookingDetails.fromDate).format("YYYY-MM-DD")
      : "",
    toDate: bookingDetails.toDate
      ? moment(bookingDetails.toDate).format("YYYY-MM-DD")
      : "",
    event: bookingDetails.event || "",
    package: bookingDetails.package || "",
    items: bookingDetails.items || [{ name: "", count: 1 }],
    tourGuide: bookingDetails.tourGuide || "no",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!bookingDetails) {
      navigate("/profile"); // Redirect if no booking details are passed
    }
  }, [bookingDetails, navigate]);

  const handleChange = (e, index = null) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked ? "yes" : "no" });
    } else if (name === "items") {
      const updatedItems = [...formData.items];
      updatedItems[index][e.target.dataset.field] = value;
      setFormData({ ...formData, items: updatedItems });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addItemField = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: "", count: 1 }],
    });
  };

  const removeItemField = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: updatedItems });
  };

  const calculateTotalAmount = () => {
    const rentPerDay = getRentPerDay(formData);
    const numberOfDays = calculateNumberOfDays(
      formData.fromDate,
      formData.toDate
    );
    return rentPerDay * numberOfDays;
  };

  const getRentPerDay = (data) => {
    const rentRates = {
      event: { stargazing: 1000, campfire: 1500, bbq: 2000 },
      package: { family: 3000, friends: 4000, couple: 2500 },
      items: { tent: 500, bag: 200, bbq_machine: 700 },
      camplocation: {
        forest_camp: 1200,
        desert_camp: 1000,
        mountain_camp: 1500,
      },
    };

    const eventRent = rentRates.event[data.event] || 0;
    const packageRent = rentRates.package[data.package] || 0;
    const itemRent = data.items.reduce(
      (total, item) => total + (rentRates.items[item.name] || 0) * item.count,
      0
    );
    const campLocationRent = rentRates.camplocation[data.camplocation] || 0;

    return eventRent + packageRent + itemRent + campLocationRent;
  };

  const calculateNumberOfDays = (fromDate, toDate) => {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    return Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;
  };

  const validateForm = () => {
    let formErrors = {};
    const today = new Date().setHours(0, 0, 0, 0);

    if (!formData.camplocation) {
      formErrors.camplocation = "Camp location is required.";
    }

    if (!formData.fromDate) {
      formErrors.fromDate = "From date is required.";
    } else if (new Date(formData.fromDate) < today) {
      formErrors.toDate = "From date cannot be a past date.";
    }

    if (!formData.toDate) {
      formErrors.toDate = "To date is required.";
    } else if (new Date(formData.toDate) < new Date(formData.fromDate)) {
      formErrors.toDate = "To date cannot be earlier than from date.";
    } else if (new Date(formData.toDate) < today) {
      formErrors.toDate = "To date cannot be a past date.";
    }

    if (!formData.event) {
      formErrors.event = "Event selection is required.";
    }

    if (!formData.package) {
      formErrors.package = "Package selection is required.";
    }

    formData.items.forEach((item, index) => {
      if (!item.name) {
        formErrors[`itemName${index}`] = `Item name is required for item ${
          index + 1
        }.`;
      }
      if (item.count < 1) {
        formErrors[
          `itemCount${index}`
        ] = `Item count should be at least 1 for item ${index + 1}.`;
      }
    });

    if (!formData.tourGuide) {
      formErrors.tourGuide = "Please select.";
    }

    setErrors(formErrors);

    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return; // Prevent submission if validation fails

    const totalamount = calculateTotalAmount();

    const updatedData = {
      camplocation: formData.camplocation,
      fromDate: formData.fromDate,
      toDate: formData.toDate,
      event: formData.event,
      package: formData.package,
      items: formData.items, // Multiple items handled here
      tourGuide: formData.tourGuide,
      totalamount,
      bookingId: bookingDetails.bookingId, // Include booking ID for update
    };

    // Call your API or perform action to update booking
    try {
      await axios.put(
        `http://localhost:5000/api/reservations/update/${bookingDetails.bookingId}`,
        updatedData
      );

      // Display success message
      await Swal.fire({
        icon: "success",
        title: "Update Successful",
        text: "Your booking has been updated successfully!",
        confirmButtonText: "OK",
      });

      navigate("/profile", { state: { data: updatedData } });
    } catch (error) {
      console.error("Error updating booking", error);

      await Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "There was an error updating your booking. Please try again.",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div>
      <style>{`
  .form-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f0f8ff;
  }

  .form-box {
    background-color: #fff;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    width: 100%;
  }

  .form-box h2 {
    text-align: center;
    margin-bottom: 20px;
    color: #333;
  }

  .form-box label {
    font-weight: bold;
    display: block;
    margin-bottom: 5px;
    color: #333;
  }

  .form-box select, .form-box input[type="number"], .form-box input[type="date"] {
    margin-bottom: 15px;
    width: 100%;
    padding: 8px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }

  .radio-group-inline {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
  }

  .radio-group-inline label {
    display: flex;
    align-items: center;
  }

  .form-box button.submit-button {
    width: 100%;
    background-color: #4c5f38;
    color: #fff;
    padding: 10px;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .form-box button.submit-button:hover {
    background-color: #218838;
  }

  .form-box button.add-item-button {
    width: 50%; /* Adjust width to make it smaller */
    background-color: #6c757d;
    color: #fff;
    padding: 8px; /* Smaller padding */
    border: none;
    border-radius: 5px;
    font-size: 14px; /* Smaller font size */
    cursor: pointer;
    margin-top: 10px;
    transition: background-color 0.3s ease;
  }

  .form-box button.add-item-button:hover {
    background-color: #5a6268;
  }
`}</style>

      <div className="form-container">
        <div className="form-box">
          <h2>Update Booking Form</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Camp Location: </label>
              <select
                name="camplocation"
                value={formData.camplocation}
                onChange={handleChange}
                required
              >
                <option value="">Select a Camp Location</option>
                <option value="forest_camp">Forest Camp</option>
                <option value="desert_camp">Desert Camp</option>
                <option value="mountain_camp">Mountain Camp</option>
              </select>
            </div>

            <div>
              <label>From Date: </label>
              <input
                type="date"
                name="fromDate"
                value={formData.fromDate}
                onChange={handleChange}
                required
              />
              {errors.fromDate && (
                <div style={{ color: "red" }}>{errors.fromDate}</div>
              )}{" "}
            </div>

            <div>
              <label>To Date: </label>
              <input
                type="date"
                name="toDate"
                value={formData.toDate}
                onChange={handleChange}
                required
              />
              {errors.toDate && (
                <div style={{ color: "red" }}>{errors.toDate}</div>
              )}{" "}
            </div>

            <div>
              <label>Event: </label>
              <select
                name="event"
                value={formData.event}
                onChange={handleChange}
                required
              >
                <option value="">Select an Event</option>
                <option value="stargazing">Stargazing</option>
                <option value="campfire">Campfire</option>
                <option value="bbq">BBQ</option>
              </select>
            </div>

            <div>
              <label>Package: </label>
              <select
                name="package"
                value={formData.package}
                onChange={handleChange}
                required
              >
                <option value="">Select a Package</option>
                <option value="family">Family Package</option>
                <option value="friends">Friends Package</option>
                <option value="couple">Couple Package</option>
              </select>
            </div>

            {formData.items.map((item, index) => (
              <div key={index}>
                <label>Item: </label>
                <select
                  name="items"
                  data-field="name"
                  value={item.name}
                  onChange={(e) => handleChange(e, index)}
                  required
                >
                  <option value="">Select an Item</option>
                  <option value="tent">Tent</option>
                  <option value="bag">Bag</option>
                  <option value="bbq_machine">BBQ Machine</option>
                </select>
                <label>Count: </label>
                <input
                  type="number"
                  data-field="count"
                  name="items"
                  value={item.count}
                  min="1"
                  onChange={(e) => handleChange(e, index)}
                  required
                />
                {index > 0 && (
                  <button
                    type="button"
                    className="add-item-button"
                    onClick={() => removeItemField(index)}
                  >
                    Remove Item
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              className="add-item-button"
              onClick={addItemField}
            >
              Add Another Item
            </button>

            <div>
              <label>Tour Guide: </label>
              <div className="radio-group-inline">
                <label>
                  <input
                    type="radio"
                    name="tourGuide"
                    value="yes"
                    checked={formData.tourGuide === "yes"}
                    onChange={handleChange}
                  />{" "}
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="tourGuide"
                    value="no"
                    checked={formData.tourGuide === "no"}
                    onChange={handleChange}
                  />{" "}
                  No
                </label>
              </div>
            </div>

            <button type="submit" className="submit-button">
              Update Booking
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateBookingScreen;
