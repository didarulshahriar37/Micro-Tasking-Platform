import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

const HeroSlider = () => {
    const { user } = useAuth();

    const dashboardLink = user?.role === 'worker' ? '/worker' :
        user?.role === 'buyer' ? '/buyer' :
            user?.role === 'admin' ? '/admin' : '/';

    const slides = [
        {
            id: 1,
            title: "Turn Your Time Into Real Money",
            subtitle: "Join the #1 micro-tasking platform. Complete simple tasks and get paid instantly.",
            image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
            color: "from-indigo-600 to-purple-600"
        },
        {
            id: 2,
            title: "Hire Expert Workers Instantly",
            subtitle: "Need something done fast? Post a task and get hundreds of submissions in minutes.",
            image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
            color: "from-blue-600 to-cyan-600"
        },
        {
            id: 3,
            title: "Secure & Transparent Payments",
            subtitle: "Our coin-based system ensures you get paid for every valid task you complete.",
            image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1932&q=80",
            color: "from-emerald-600 to-teal-600"
        }
    ];

    return (
        <div className="hero-slider-container" style={{ height: 'calc(100vh - 72px)', width: '100%', position: 'relative' }}>
            <Swiper
                spaceBetween={0}
                centeredSlides={true}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                effect={'fade'}
                modules={[Autoplay, Pagination, EffectFade]}
                className="mySwiper"
                style={{ height: '100%', width: '100%' }}
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div style={{
                            position: 'relative',
                            height: '100%',
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden'
                        }}>
                            {/* Background Image */}
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundImage: `url(${slide.image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                zIndex: -2
                            }}></div>

                            {/* Dark Overlay */}
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.95))',
                                zIndex: -1
                            }}></div>

                            {/* Content */}
                            <div className="container" style={{ textAlign: 'center', zIndex: 1, padding: '0 20px' }}>
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8 }}
                                >
                                    <h1 style={{
                                        fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                                        fontWeight: '800',
                                        color: 'white',
                                        marginBottom: '20px',
                                        lineHeight: 1.2
                                    }}>
                                        {slide.title}
                                    </h1>
                                    <p style={{
                                        fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                                        color: '#cbd5e1',
                                        maxWidth: '700px',
                                        margin: '0 auto 40px',
                                        lineHeight: 1.6
                                    }}>
                                        {slide.subtitle}
                                    </p>
                                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                                        <Link to={user ? dashboardLink : "/register"} className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '18px' }}>
                                            Get Started
                                        </Link>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default HeroSlider;
