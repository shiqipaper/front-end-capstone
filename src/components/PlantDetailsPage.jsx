import React, {useEffect, useState} from 'react';
import {Form, useActionData, useLoaderData, useParams} from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {QRCodeSVG} from 'qrcode.react';
import {API_URL, likePlant, savePlant} from "../services/api";

export async function loader({params}) {
    const token = localStorage.getItem('token');
    const headers = {}
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
    try {
        const response = await axios.get(`${API_URL}/plants/${params.id}`, {headers});
        return response.data;
    } catch (error) {
        throw new Response('Error fetching plant details', {status: 500});
    }
}

export async function action({params, request}) {
    const token = localStorage.getItem('token');
    if (!token) {
        return {error: 'User not authenticated'};
    }

    const formData = await request.formData();
    const content = formData.get('comment');

    try {
        const response = await axios.post(
            `${API_URL}/plants/${params.id}/comments`,
            {content},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return {newComment: response.data};
    } catch (err) {
        return {error: 'Failed to post comment. Please log in.'};
    }
}

const PlantDetailsPage = () => {
    const loaderData = useLoaderData();
    const actionData = useActionData();
    const {id} = useParams();

    const [plant, setPlant] = useState(loaderData);
    const [comments, setComments] = useState(loaderData.comments || []);
    const [error, setError] = useState('');
    const [commentInput, setCommentInput] = useState('');
    const [showQR, setShowQR] = useState(false);
    const [isLiked, setIsLiked] = useState(plant.is_liked || false);
    const [isSaved, setIsSaved] = useState(plant.is_saved || false);
    const [likeCount, setLikeCount] = useState(plant.likes_count || 0);
    const [saveCount, setSaveCount] = useState(plant.saves_count || 0);
    const QR_CODE_URL = process.env.REACT_APP_QR_CODE_URL || 'http://127.0.0.1:5000';

    const plantUrl = `${QR_CODE_URL}/plants/${id}`;
    // Handle new comment from action
    useEffect(() => {
        if (actionData?.newComment) {
            setComments((prev) => [...prev, actionData.newComment]);
            setError('');
            setCommentInput('');
        }
        if (actionData?.error) {
            setError(actionData.error);
        }
    }, [actionData]);
    // Polling effect for updated comments
    useEffect(() => {
        const fetchPlantDetails = async () => {
            try {
                const response = await axios.get(`${API_URL}/plants/${id}`);
                setPlant(response.data);
                setComments(response.data.comments || []);
                // Update local state with fresh data
                setIsLiked(response.data.is_liked);
                setIsSaved(response.data.is_saved);
                setLikeCount(response.data.likes_count);
                setSaveCount(response.data.saves_count);
            } catch (error) {
                console.error('Error fetching plant details:', error);
            }
        };

        const intervalId = setInterval(fetchPlantDetails, 10000);
        return () => clearInterval(intervalId);
    }, [id]);
    const handleLike = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Please log in to like this plant.');
            return;
        }

        const originalIsLiked = isLiked;
        const originalLikeCount = likeCount;

        // Optimistic update
        setIsLiked(!isLiked);
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);

        try {
            await likePlant(id, token);
            // Sync with server data after successful like
            const response = await axios.get(`${API_URL}/plants/${id}`);
            setPlant(response.data);
        } catch (error) {
            // Rollback on error
            setIsLiked(originalIsLiked);
            setLikeCount(originalLikeCount);
            setError('Failed to like plant');
        }
    };

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Please log in to save this plant.');
            return;
        }

        const originalIsSaved = isSaved;
        const originalSaveCount = saveCount;

        // Optimistic update
        setIsSaved(!isSaved);
        setSaveCount(prev => isSaved ? prev - 1 : prev + 1);

        try {
            await savePlant(id, token);
            // Sync with server data after successful save
            const response = await axios.get(`${API_URL}/plants/${id}`);
            setPlant(response.data);
        } catch (error) {
            // Rollback on error
            setIsSaved(originalIsSaved);
            setSaveCount(originalSaveCount);
            setError('Failed to save plant');
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
                                    src={img.image_url}
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
                        src={plant.images[0].image_url}
                        alt="Plant"
                        className="img-fluid rounded shadow"
                        style={{maxHeight: '300px', maxWidth: '100%', objectFit: 'cover'}}
                    />
                )}
            </div>

            <div className="text-center">
                <p className="lead">{plant.description}</p>
            </div>
            <div className="d-flex justify-content-center gap-2 mb-3">
                <button className="btn btn-primary" onClick={() => setShowQR(!showQR)}>
                    {showQR ? 'Hide QR Code' : 'Share'}
                </button>
                <button
                    className={`btn ${isLiked ? 'btn-danger' : 'btn-outline-danger'}`}
                    onClick={handleLike}
                >
                    {isLiked ? '❤️' : '♡'} {likeCount}
                </button>
                <button
                    className={`btn ${isSaved ? 'btn-warning' : 'btn-outline-warning'}`}
                    onClick={handleSave}
                >
                    {isSaved ? '⭐' : '☆'} {saveCount}
                </button>
            </div>

            {showQR && (
                <div className="mt-4">
                    <QRCodeSVG value={plantUrl} size={200}/>
                    <p>Save the QR code to share</p>
                </div>
            )}
            {error && <p className="text-danger">{error}</p>}

            {/* Discussion Section */}
            <div className="mt-5">
                <h4>Discussion</h4>
                <Form method="post" className="mb-3">
                  <textarea
                      className="form-control mb-3"
                      name="comment"
                      placeholder="Write your comment..."
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      required
                  ></textarea>
                    <button type="submit" className="btn btn-primary">
                        Post Comment
                    </button>
                </Form>

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
