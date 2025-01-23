import React, { useEffect, useState } from 'react';
import { getPlants } from '../services/api';
import { useNavigate } from 'react-router-dom';

const PlantListPage = () => {
    const [plants, setPlants] = useState([]);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPlants();
    }, [currentPage, search]);

    const fetchPlants = async () => {
        try {
            const response = await getPlants(currentPage, 6, search);
            setPlants(response.data.plants);
            setTotalPages(response.data.pages);
        } catch (error) {
            console.error('Error fetching plants:', error);
        }
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Plant List</h2>

            <input
                type="text"
                className="form-control mb-4"
                placeholder="Search for plants..."
                value={search}
                onChange={handleSearch}
            />

            <div className="row">
                {plants.map((plant) => (
                    <div className="col-md-4 mb-4" key={plant.id}>
                        <div className="card shadow-sm">
                            <img src={`http://127.0.0.1:5000${plant.main_image_url}`} className="card-img-top" alt={plant.name} />
                            <div className="card-body">
                                <h5 className="card-title">{plant.name}</h5>
                                <p className="card-text">{plant.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="d-flex justify-content-center mt-4">
                <button
                    className="btn btn-primary me-2"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span className="align-self-center">Page {currentPage} of {totalPages}</span>
                <button
                    className="btn btn-primary ms-2"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default PlantListPage;
