import React, { useEffect, useState } from 'react';
import { getPlants } from '../services/api';
import './HomePage.css';

const HomePage = () => {
    const [plants, setPlants] = useState([]);

    useEffect(() => {
        getPlants().then(response => {
            setPlants(response.data);
        }).catch(error => {
            console.error("Error fetching plants:", error);
        });
    }, []);

    return (
        <div className="container text-center mt-4">
            <h1 className="mb-4">Welcome to PlantApp</h1>
            <div className="row">
                {plants.map((plant) => (
                    <div className="col-md-4 mb-4" key={plant.id}>
                        <div className="card shadow-sm">
                            <img src={plant.image_location} className="card-img-top" alt={plant.name} />
                            <div className="card-body">
                                <h5 className="card-title">{plant.name}</h5>
                                <p className="card-text">{plant.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;
