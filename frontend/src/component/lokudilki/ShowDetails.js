import React, { useState, useEffect } from 'react';
import { Link, useParams} from 'react-router-dom';
import axios from "axios";

function ShowDetails() {
    const [supplier, setSupplier] = useState();
    const { id } = useParams();
    console.log(id);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/supplier/${id}`)  // Use backticks here
            .then((res) => {
                console.log(res.data);
                setSupplier(res.data);
            })
            .catch(() => {
                console.log("Error from ShowDetails");
            });

    }, [id]);
    if (!supplier) {
        return <div>Loading...</div>; // Loading state
    }

    const TableItem = (
        <div>
            <table className="table table-hover table-dark">
                <tbody>
                    <tr>
                        <th scope="row">1</th>
                        <td>Supplier Name</td>
                        <td>{supplier.supplierName || 'N/A'}</td>
                    </tr>
                    <tr>
                        <th scope="row">2</th>
                        <td>ID</td>
                        <td>{supplier.uniqueSupplierID || 'N/A'}</td>
                    </tr>
                    <tr>
                        <th scope="row">3</th>
                        <td>Email</td>
                        <td>{supplier.email || 'N/A'}</td>
                    </tr>
                    <tr>
                        <th scope="row">4</th>
                        <td>Phone Number</td>
                        <td>{supplier.phoneNumber || 'N/A'}</td>
                    </tr>
                    <tr>
                        <th scope="row">5</th>
                        <td>Address</td>
                        <td>{supplier.address || 'N/A'}</td>
                    </tr>
                    <tr>
                        <th scope="row">6</th>
                        <td>Type of Goods</td>
                        <td>{supplier.typeOfGoods || 'N/A'}</td>
                    </tr>
                    <tr>
                        <th scope="row">7</th>
                        <td>Supply Capacity</td>
                        <td>{supplier.supplyCapacity || 'N/A'}</td>
                    </tr>
                    <tr>
                        <th scope="row">8</th>
                        <td>Bank Account Details</td>
                        <td>{supplier.bankAccountDetails || 'N/A'}</td>
                    </tr>
                    <tr>
                        <th scope="row">9</th>
                        <td>Payment Terms</td>
                        <td>{supplier.paymentTerms || 'N/A'}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="showDetails">
            <div className="col-md-10 m-auto">
                <br />
                <Link to={"/"} className='btn btn-outline-danger float-right'>Back to main</Link>
            </div>
            <br />
            <div className='col-md-8 m-auto'>
                <h1 className='display-6-bold text-center'>Supplier Detail</h1>
                <p className='text-center'>This is the full detail of the supplier</p>
                <hr />
                <br />
            </div>
            
            {/* Correctly render TableItem here */}
            <div className="col-md-10 m-auto">{TableItem}</div>
            
            <div className="col-md-6 m-auto">
                <Link to={`/updatedetails/${supplier._id||supplier.uniqueSupplierID}`} 
                    className="btn btn-outline-info btn-lg btn-block d-flex justify-content-center">Edit Supplier</Link>
            </div>

           
            <br />
        </div>
    )
}

export default ShowDetails;
