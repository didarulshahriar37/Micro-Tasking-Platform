import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { motion } from 'framer-motion';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const WorkerSlider = ({ workers }) => {
    return (
        <div style={{ padding: '20px 0 50px' }}>
            <Swiper
                spaceBetween={40}
                slidesPerView={1}
                breakpoints={{
                    640: { slidesPerView: 1 },
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                }}
                autoplay={{
                    delay: 3500,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                modules={[Autoplay, Pagination]}
                className="workerSwiper"
                style={{ padding: '20px 10px 60px' }}
            >
                {workers.map((worker, index) => (
                    <SwiperSlide key={index}>
                        <motion.div
                            className="card"
                            style={{
                                textAlign: 'center',
                                background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.6), rgba(15, 23, 42, 0.8))',
                                position: 'relative',
                                overflow: 'hidden',
                                padding: '40px 24px',
                                height: '100%',
                                border: '1px solid rgba(255,255,255,0.05)'
                            }}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                        >
                            {/* Rank Badge */}
                            <div style={{
                                position: 'absolute',
                                top: '12px',
                                right: '12px',
                                background: index === 0 ? 'linear-gradient(135deg, #fbbf24, #d97706)' :
                                    index === 1 ? 'linear-gradient(135deg, #94a3b8, #64748b)' :
                                        index === 2 ? 'linear-gradient(135deg, #b45309, #78350f)' :
                                            'rgba(255,255,255,0.1)',
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                color: 'white',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
                                zIndex: 2,
                                border: index > 2 ? '1px solid rgba(255,255,255,0.2)' : 'none'
                            }}>
                                {index + 1}
                            </div>

                            {/* Avatar */}
                            <div style={{
                                width: '110px',
                                height: '110px',
                                borderRadius: '50%',
                                margin: '0 auto 24px',
                                padding: '4px',
                                background: 'linear-gradient(to right, #6366f1, #ec4899)',
                                boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)'
                            }}>
                                <div style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: '50%',
                                    backgroundColor: '#1e293b',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '36px',
                                    fontWeight: 'bold'
                                }}>
                                    {worker.profileImage ? (
                                        <img src={worker.profileImage} alt={worker.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        worker.name.charAt(0).toUpperCase()
                                    )}
                                </div>
                            </div>

                            <h3 style={{ marginBottom: '8px', fontSize: '22px', fontWeight: '700' }}>{worker.name}</h3>
                            <div style={{ color: '#94a3b8', marginBottom: '24px', fontSize: '14px' }}>Elite Tasker</div>

                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 20px',
                                background: 'rgba(16, 185, 129, 0.1)',
                                border: '1px solid rgba(16, 185, 129, 0.2)',
                                borderRadius: '30px',
                                color: '#34d399',
                                fontWeight: '700',
                                fontSize: '16px'
                            }}>
                                <span>💰</span> {worker.coins} Coins
                            </div>
                        </motion.div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default WorkerSlider;
