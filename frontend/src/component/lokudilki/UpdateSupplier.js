import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from "react-router-dom";

function UpdateSupplier() {
    const [supplier, setSupplier] = useState({
        supplierName: "",
        uniqueSupplierID: "",
        email: "",
        phoneNumber: "",
        address: "",
        typeOfGoods: "",
        supplyCapacity: "",
        bankAccountDetails: "",
        paymentTerms: "",
    });

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get(`http://localhost:5000/api/supplier/${id}`)
            .then((res) => {
                setSupplier({
                    supplierName: res.data.supplierName,
                    uniqueSupplierID: res.data.uniqueSupplierID,
                    email: res.data.email,
                    phoneNumber: res.data.phoneNumber,
                    address: res.data.address,
                    typeOfGoods: res.data.typeOfGoods,
                    supplyCapacity: res.data.supplyCapacity,
                    bankAccountDetails: res.data.bankAccountDetails,
                    paymentTerms: res.data.paymentTerms,
                });
            })
            .catch((err) => {
                console.log("Error from update Supplier", err);
            });
    }, [id]);

    const onChange = (e) => {
        setSupplier({ ...supplier, [e.target.name]: e.target.value });
    };

    const validateInputs = () => {
        const {
            supplierName,
            uniqueSupplierID,
            email,
            phoneNumber,
            address,
            typeOfGoods,
            supplyCapacity,
            bankAccountDetails,
            paymentTerms,
        } = supplier;

        const regexName = /^[A-Za-z\s]+$/;
        const regexUniqueID = /^SUP\d+$/;
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const regexPhone = /^07\d{8}$/;
        const regexAddress = /^[A-Za-z\s]+$/;
        const regexTypeOfGoods = /^[A-Za-z\s]+$/;
        const regexSupplyCapacity = /^\d+$/;
        const regexBankDetails = /^[A-Za-z0-9\s]+$/;
        const regexPaymentTerms = /^[A-Za-z\s]+$/;

        if (!regexName.test(supplierName)) {
            alert("Supplier Name should only contain letters.");
            return false;
        }
        if (!regexUniqueID.test(uniqueSupplierID)) {
            alert("Unique Supplier ID should start with 'SUP' followed by numbers.");
            return false;
        }
        if (!regexEmail.test(email)) {
            alert("Please enter a valid email address.");
            return false;
        }
        if (!regexPhone.test(phoneNumber)) {
            alert("Phone Number must be exactly 10 digits and start with'07'");
            return false;
        }
        if (!regexAddress.test(address)) {
            alert("Address should only contain letters.");
            return false;
        }
        if (!regexTypeOfGoods.test(typeOfGoods)) {
            alert("Type of Goods should only contain letters.");
            return false;
        }
        if (!regexSupplyCapacity.test(supplyCapacity)) {
            alert("Supply Capacity should only contain numbers.");
            return false;
        }
        if (!regexBankDetails.test(bankAccountDetails)) {
            alert("Bank Account Details should contain only letters and numbers.");
            return false;
        }
        if (!regexPaymentTerms.test(paymentTerms)) {
            alert("Payment Terms should only contain letters.");
            return false;
        }
        return true;
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (!validateInputs()) return; // Validate inputs before submitting

        const data = {
            supplierName: supplier.supplierName,
            uniqueSupplierID: supplier.uniqueSupplierID,
            email: supplier.email,
            phoneNumber: supplier.phoneNumber,
            address: supplier.address,
            typeOfGoods: supplier.typeOfGoods,
            supplyCapacity: supplier.supplyCapacity,
            bankAccountDetails: supplier.bankAccountDetails,
            paymentTerms: supplier.paymentTerms,
        };

        axios
            .put(`http://localhost:5000/api/supplier/${id}`, data)
            .then((res) => {
                navigate(`/showdetails/${id}`);
            })
            .catch((err) => {
                console.log("Error in update", err);
            });
    };

    return (
        <div className="UpdateSupplier">
            <div className="container">
                <div className="row">
                    <div className="col-md-8 m-auto">
                        <br />
                        <Link to="/" className="btn btn-outline-warning float-left">
                            Show Supplier list
                        </Link>
                    </div>
                </div>
                <div className="col-md-8 m-auto">
                    <form noValidate onSubmit={onSubmit}>
                        <div className='form-group'>
                            <label htmlFor='supplierName'>Supplier Name</label>
                            <input
                                type="text"
                                placeholder="Name of Supplier"
                                name="supplierName"
                                className="form-control"
                                value={supplier.supplierName}
                                onChange={onChange}
                            />
                        </div>
                        <br />
                        <div className='form-group'>
                            <label htmlFor='uniqueSupplierID'>Supplier ID</label>
                            <input
                                type="text"
                                placeholder="Unique Supplier ID"
                                name="uniqueSupplierID"
                                className="form-control"
                                value={supplier.uniqueSupplierID}
                                onChange={onChange}
                            />
                        </div>
                        <br />
                        <div className='form-group'>
                            <label htmlFor='email'>Email</label>
                            <input
                                type="email"
                                placeholder="Email of Supplier"
                                name="email"
                                className="form-control"
                                value={supplier.email}
                                onChange={onChange}
                            />
                        </div>
                        <br />
                        <div className='form-group'>
                            <label htmlFor='phoneNumber'>Phone Number</label>
                            <input
                                type="text"
                                placeholder="Phone Number"
                                name="phoneNumber"
                                className="form-control"
                                value={supplier.phoneNumber}
                                onChange={onChange}
                            />
                        </div>
                        <br />
                        <div className='form-group'>
                            <label htmlFor='address'>Address</label>
                            <input
                                type="text"
                                placeholder="Address"
                                name="address"
                                className="form-control"
                                value={supplier.address}
                                onChange={onChange}
                            />
                        </div>
                        <br />
                        <div className='form-group'>
                            <label htmlFor='typeOfGoods'>Type of Goods</label>
                            <input
                                type="text"
                                placeholder="Type of Goods"
                                name="typeOfGoods"
                                className="form-control"
                                value={supplier.typeOfGoods}
                                onChange={onChange}
                            />
                        </div>
                        <br />
                        <div className='form-group'>
                            <label htmlFor='supplyCapacity'>Supply Capacity</label>
                            <input
                                type="text"
                                placeholder="Supply Capacity"
                                name="supplyCapacity"
                                className="form-control"
                                value={supplier.supplyCapacity}
                                onChange={onChange}
                            />
                        </div>
                        <br />
                        <div className='form-group'>
                            <label htmlFor='bankAccountDetails'>Bank Account Details</label>
                            <input
                                type="text"
                                placeholder="Bank Account Details"
                                name="bankAccountDetails"
                                className="form-control"
                                value={supplier.bankAccountDetails}
                                onChange={onChange}
                            />
                        </div>
                        <br />
                        <div className='form-group'>
                            <label htmlFor='paymentTerms'>Payment Terms</label>
                            <input
                                type="text"
                                placeholder="Payment Terms"
                                name="paymentTerms"
                                className="form-control"
                                value={supplier.paymentTerms}
                                onChange={onChange}
                            />
                        </div>
                        <br />
                        <button
                            type="submit"
                            className='btn btn-outline-info btn-lg btn-block'>
                            Update Supplier
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
export default UpdateSupplier;
