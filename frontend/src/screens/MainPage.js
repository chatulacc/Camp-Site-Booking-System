import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReservationDetails from "./ReservationDetails"; // Ensure this import is correct

function MainPage() {
  const [formData, setFormData] = useState({
    camplocation: "",
    fromDate: "",
    toDate: "",
    event: "",
    package: "",
    items: [{ name: "", count: 1 }],
    tourGuide: "",
  });

  const [submittedData, setSubmittedData] = useState(null);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleChange = (e, index = null) => {
    const { name, value } = e.target;

    if (name === "items") {
      const updatedItems = [...formData.items];
      updatedItems[index][e.target.dataset.field] = value;
      setFormData({ ...formData, items: updatedItems });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Remove error when field changes
    setErrors({ ...errors, [name]: "" });
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

    

    if (!formData.event) {
      formErrors.event = "Event selection is required.";
    }

    if (!formData.package) {
      formErrors.package = "Package selection is required.";
    }

    formData.items.forEach((item, index) => {
      if (!item.name) {
        formErrors[`itemName${index}`] = `Item name is required for item ${index + 1}.`;
      }
      if (item.count < 1) {
        formErrors[`itemCount${index}`] = `Item count should be at least 1 for item ${index + 1}.`;
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

    if (!validateForm()) {
      return;
    }

    const totalamount = calculateTotalAmount();

    const dataToSend = {
      camplocation: formData.camplocation,
      fromDate: formData.fromDate,
      toDate: formData.toDate,
      event: formData.event,
      package: formData.package,
      items: formData.items, // Multiple items handled here
      tourGuide: formData.tourGuide,
      totalamount,
      numberOfItems: formData.items.length,
    };

    navigate("/reservation-details", { state: { data: dataToSend } });
  };

  if (submittedData) {
    return <ReservationDetails data={submittedData} />;
  }

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
          <h2>Booking Form</h2>
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
                <option value="forest_camp">Moonlit Meadows</option>
                <option value="desert_camp">Fern Forest Campsite</option>
                <option value="mountain_camp">Pine Valley Campground</option>
              </select>
              {errors.camplocation && <p style={{ color: "red" }}>{errors.camplocation}</p>}
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
              {errors.fromDate && <p style={{ color: "red" }}>{errors.fromDate}</p>}
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
              {errors.toDate && <p style={{ color: "red" }}>{errors.toDate}</p>}
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
                <option value="stargazing">Star Gazing</option>
                <option value="campfire">Camp Fire</option>
                <option value="bbq">BBQ Night</option>
              </select>
              {errors.event && <p style={{ color: "red" }}>{errors.event}</p>}
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
                <option value="friends">Friends Zone</option>
                <option value="couple">Couple Package</option>
              </select>
              {errors.package && <p style={{ color: "red" }}>{errors.package}</p>}
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
                {errors[`itemName${index}`] && <p style={{ color: "red" }}>{errors[`itemName${index}`]}</p>}
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
                {errors[`itemCount${index}`] && <p style={{ color: "red" }}>{errors[`itemCount${index}`]}</p>}
                {index > 0 && (
                  <button type="button" className="add-item-button" onClick={() => removeItemField(index)}>
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
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="tourGuide"
                    value="no"
                    checked={formData.tourGuide === "no"}
                    onChange={handleChange}
                  />
                  No
                </label>
              </div>
              {errors.tourGuide && <p style={{ color: "red" }}>{errors.tourGuide}</p>} {/* Error message for Tour Guide */}
            </div>

            <button type="submit" className="submit-button">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default MainPage;