import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {QRCodeCanvas, QRCodeSVG} from 'qrcode.react';

const PlantDetailsPage = () => {
    const {id} = useParams();
    const [plant, setPlant] = useState(null);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [error, setError] = useState('');
    const [showQR, setShowQR] = useState(false);
    const plantUrl = `${window.location.origin}/plant/${id}`;

    useEffect(() => {
        const fetchPlantDetails = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/plant/${id}`);
                setPlant(response.data);
                setComments(response.data.comments || []);
            } catch (error) {
                console.error('Error fetching plant details:', error);
            }
        };
        fetchPlantDetails();

        // Poll for new comments every 10 seconds
        const interval = setInterval(fetchPlantDetails, 10000);
        return () => clearInterval(interval);
    }, [id]);


    useEffect(() => {
        const fetchPlantDetails = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/plant/${id}`);
                setPlant(response.data);
                setComments(response.data.comments || []);
            } catch (error) {
                console.error('Error fetching plant details:', error);
            }
        };
        fetchPlantDetails();
    }, [id]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('User not authenticated');
            }

            const response = await axios.post(
                `http://127.0.0.1:5000/plant/${id}/comments`,
                {content: comment},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            setComments([...comments, response.data]);  // Update comments dynamically
            setComment('');
            setError('');
        } catch (error) {
            setError('Failed to post comment. Please log in.');
            console.error('Error posting comment:', error);
        }
    };


    if (!plant) {
        return <div className="container mt-5 text-center">Loading...</div>;
    }

    // Slider settings for horizontal sliding effect
    const sliderSettings = {
        dots: true,
        infinite: plant.images.length > 1,  // Disable infinite scroll if only one image
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: plant.images.length > 1,  // Hide arrows if only one image
        autoplay: plant.images.length > 1,  // Disable autoplay if single image
        autoplaySpeed: 3000,
        centerMode: false,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (
        <div className="container mt-4 text-center">
            <h2 className="text-center mb-4">{plant.name}</h2>

            <div className="gallery-container mb-4" style={{maxWidth: '900px', margin: '0 auto'}}>
                {plant.images.length > 1 ? (
                    <Slider {...sliderSettings}>
                        {plant.images.map((img, index) => (
                            <div key={img.id} style={{padding: '0 10px', textAlign: 'center'}}>
                                <img
                                    src={`http://127.0.0.1:5000${img.image_url}`}
                                    alt={`Plant ${index}`}
                                    className="gallery-image"
                                    style={{
                                        maxHeight: '400px',  // Set a maximum height
                                        maxWidth: '100%',    // Ensure it fits the container width
                                        objectFit: 'contain', // Maintain aspect ratio
                                        borderRadius: '10px',
                                        display: 'block',
                                        margin: '0 auto'
                                    }}
                                />
                            </div>
                        ))}
                    </Slider>
                ) : (
                    <img
                        src={`http://127.0.0.1:5000${plant.images[0].image_url}`}
                        alt="Plant"
                        className="img-fluid rounded shadow"
                        style={{maxHeight: '300px', maxWidth: '100%', objectFit: 'cover'}}
                    />
                )}
            </div>

            <div className="text-center">
                <p className="lead">{plant.description}</p>
            </div>
            <button className="btn btn-primary mb-3" onClick={() => setShowQR(!showQR)}>
                {showQR ? 'Hide QR Code' : 'Share Plant'}
            </button>

            {showQR && (
                <div className="mt-4">
                    <QRCodeSVG value={plantUrl} size={200}/>
                    <p>Save the QR code to share</p>
                </div>
            )}
            {/* Discussion Section */}
            <div className="mt-5">
                <h4>Discussion</h4>
                {error && <p className="text-danger">{error}</p>}
                <form onSubmit={handleCommentSubmit} className="mb-3">
                    <textarea
                        className="form-control mb-3"
                        placeholder="Write your comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                    ></textarea>
                    <button type="submit" className="btn btn-primary">Post Comment</button>
                </form>

                <div className="mt-4">
                    <h5>Comments</h5>
                    {comments.length === 0 ? (
                        <p>No comments yet.</p>
                    ) : (
                        comments.map((c) => (
                            <div key={c.id} className="border p-3 mb-2 rounded">
                                <strong>User {c.username}:</strong>
                                <p>{c.content}</p>
                                <small className="text-muted">{c.created_at}</small>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlantDetailsPage;
