import React, {useEffect, useState} from 'react';
import {Form, useActionData, useLoaderData, useParams} from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {QRCodeSVG} from 'qrcode.react';
import {API_URL, likePlant, savePlant} from "../services/api";
import './PlantDetailsPage.css';

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
    if (!token) return {error: 'User not authenticated'};

    const formData = await request.formData();

    try {
        const response = await axios.post(
            `${API_URL}/plants/${params.id}/comments`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
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
    const [currentCommentPage, setCurrentCommentPage] = useState(1);
    const [totalCommentPages, setTotalCommentPages] = useState(1);
    const [totalComments, setTotalComments] = useState(0);
    const [commentsPerPage] = useState(5);
    const [showQR, setShowQR] = useState(false);
    const [isLiked, setIsLiked] = useState(plant.is_liked || false);
    const [isSaved, setIsSaved] = useState(plant.is_saved || false);
    const [likeCount, setLikeCount] = useState(plant.likes_count || 0);
    const [saveCount, setSaveCount] = useState(plant.saves_count || 0);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileError, setFileError] = useState('');

    const QR_CODE_URL = process.env.REACT_APP_QR_CODE_URL || 'http://127.0.0.1:5000';

    const plantUrl = `${QR_CODE_URL}/plants/${id}`;

    const fetchComments = async (page = 1) => {
        try {
            const response = await axios.get(`${API_URL}/plants/${id}/comments`, {
                params: {
                    page: page,
                    per_page: commentsPerPage
                }
            });
            setComments(response.data.comments);
            setTotalCommentPages(response.data.total_pages);
            setTotalComments(response.data.total_comments);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };
    useEffect(() => {
        fetchComments(currentCommentPage);
    }, [currentCommentPage]);

    useEffect(() => {
        if (actionData?.newComment) {
            // Optimistically add comment and refetch to maintain pagination
            setComments(prev => [actionData.newComment, ...prev]);
            setTotalComments(prev => prev + 1);
            fetchComments(currentCommentPage);
            setError('');
            setCommentInput('');
        }
        if (actionData?.error) {
            setError(actionData.error);
        }
    }, [actionData]);

    useEffect(() => {
        const fetchPlantDetails = async () => {
            try {
                const response = await axios.get(`${API_URL}/plants/${id}`);
                setPlant(response.data);
                // Keep these updates
                setIsLiked(response.data.is_liked);
                setIsSaved(response.data.is_saved);
                setLikeCount(response.data.likes_count);
                setSaveCount(response.data.saves_count);
                // Don't update comments here anymore
            } catch (error) {
                console.error('Error fetching plant details:', error);
            }
        };

        const intervalId = setInterval(() => {
            fetchPlantDetails();
            fetchComments(currentCommentPage);
        }, 10000);
        return () => clearInterval(intervalId);
    }, [id, currentCommentPage]);
    const handleLike = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Please log in to like this plant.');
            return;
        }

        const originalIsLiked = isLiked;
        const originalLikeCount = likeCount;

        setIsLiked(!isLiked);
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);

        try {
            await likePlant(id, token);
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

        setIsSaved(!isSaved);
        setSaveCount(prev => isSaved ? prev - 1 : prev + 1);

        try {
            await savePlant(id, token);
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

    const sliderSettings = {
        dots: true,
        infinite: plant.images.length > 1,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: plant.images.length > 1,
        autoplay: plant.images.length > 1,
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
                                        maxHeight: '400px',
                                        maxWidth: '100%',
                                        objectFit: 'contain',
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

            <div>
                <p className="lead">{plant.description}</p>
            </div>
            <div className="d-flex justify-content-center gap-2 mb-3">
                <button className="btn btn-primary" onClick={() => setShowQR(!showQR)}>
                    {showQR ? 'Hide QR Code' : 'Share'}
                </button>
                <button
                    className={`btn ${isLiked ? 'btn-danger' : 'btn-outline-danger'}`}
                    onClick={handleLike}>
                    {isLiked ? '❤️' : '♡'} {likeCount}
                </button>
                <button
                    className={`btn ${isSaved ? 'btn-warning' : 'btn-outline-warning'}`}
                    onClick={handleSave}>
                    {isSaved ? '⭐' : '☆'}
                </button>
            </div>

            {showQR && (
                <div className="mt-4">
                    <QRCodeSVG value={plantUrl} size={200}/>
                    <p>Save the QR code to share</p>
                </div>
            )}
            {error && <p className="text-danger">{error}</p>}

            <div className="mt-5">
                <h4>Discussion</h4>
                <Form method="post" encType="multipart/form-data" className="mb-4">
                  <div className="mb-3">
                    <textarea
                      className="form-control mb-3"
                      name="content"
                      placeholder="Write your comment..."
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      required
                      rows="4"
                    ></textarea>

                    <div className="file-upload-wrapper">
                        <input
                            type="file"
                            name="image"
                            id="commentImage"
                            accept="image/*"
                            className="d-none"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    if (file.size > 5 * 1024 * 1024) { // 5MB in bytes
                                        setFileError('File size exceeds 5MB limit');
                                        e.target.value = ''; // Clear input
                                        setSelectedFile(null);
                                    } else {
                                        setFileError('');
                                        setSelectedFile(file);
                                    }
                                }
                            }}
                        />
                        <label
                            htmlFor="commentImage"
                            className="btn btn-outline-secondary d-flex align-items-center gap-2"
                        >
                            <i className="bi bi-image"></i>
                            {selectedFile ? (
                                <span>{selectedFile.name}</span>
                            ) : (
                                <span>Upload Image (JPEG, PNG, GIF)</span>
                        )}
                      </label>
                      {selectedFile && (
                        <button
                          type="button"
                          className="btn btn-link text-danger ms-2"
                          onClick={() => setSelectedFile(null)}
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="form-text text-muted mt-1">
                      Maximum size: 5MB • Supported formats: JPG, PNG, GIF
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary">
                    Post Comment
                  </button>
                </Form>
                {fileError && (
                  <div className="text-danger small mt-1">{fileError}</div>
                )}

                <div className="mt-4">
                    <h5>Comments ({totalComments})</h5>
                    {comments.length === 0 ? (
                        <p>No comments yet.</p>
                    ) : (
                        <>
                            {comments.map((c) => (
                                <div key={c.id} className="border p-3 mb-3 rounded bg-white shadow-sm">
                                    <div className="d-flex flex-column h-100">
                                        <div className="mb-2">
                                            <div className="d-flex align-items-center mb-2">
                                                <span className="fw-bold text-primary">@{c.username}</span>
                                                <span className="ms-2 text-muted" style={{fontSize: '0.8rem'}}>
                                                    {new Date(c.created_at).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>

                                            <p className="mb-2 text-dark" style={{lineHeight: '1.4'}}>{c.content}</p>

                                            {c.image_url && (
                                                <div className="mt-2 mb-3">
                                                    <img
                                                        src={c.image_url}
                                                        alt="Comment attachment"
                                                        className="img-thumbnail rounded"
                                                        style={{
                                                            maxWidth: '300px',
                                                            maxHeight: '300px',
                                                            objectFit: 'cover',
                                                            cursor: 'pointer'
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="d-flex justify-content-center mt-4">
                                <nav>
                                    <ul className="pagination">
                                        <li className={`page-item ${currentCommentPage === 1 ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => setCurrentCommentPage(prev => Math.max(1, prev - 1))}
                                            >
                                                Previous
                                            </button>
                                        </li>

                                        {Array.from({length: totalCommentPages}, (_, i) => i + 1).map(page => (
                                            <li key={page}
                                                className={`page-item ${currentCommentPage === page ? 'active' : ''}`}>
                                                <button
                                                    className="page-link"
                                                    onClick={() => setCurrentCommentPage(page)}
                                                >
                                                    {page}
                                                </button>
                                            </li>
                                        ))}

                                        <li className={`page-item ${currentCommentPage === totalCommentPages ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => setCurrentCommentPage(prev => Math.min(totalCommentPages, prev + 1))}
                                            >
                                                Next
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlantDetailsPage;
