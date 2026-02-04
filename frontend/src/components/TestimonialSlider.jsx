import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { motion } from 'framer-motion';

import 'swiper/css';
import 'swiper/css/pagination';

const TestimonialSlider = () => {
    const testimonials = [
        {
            id: 1,
            name: "Sarah Jenkins",
            role: "Top Rated Buyer",
            image: "https://randomuser.me/api/portraits/women/44.jpg",
            quote: "I found amazing developers for my project within minutes. The quality of work is outstanding!"
        },
        {
            id: 2,
            name: "Michael Chen",
            role: "Elite Worker",
            image: "https://randomuser.me/api/portraits/men/32.jpg",
            quote: "This platform gives me the freedom to work whenever I want. The instant payments are a game changer."
        },
        {
            id: 3,
            name: "Emily Davis",
            role: "Small Business Owner",
            image: "https://randomuser.me/api/portraits/women/68.jpg",
            quote: "Affordable and reliable micro-tasking. It helped me scale my business operations effortlessly."
        },
        {
            id: 4,
            name: "James Wilson",
            role: "Freelancer",
            image: "https://randomuser.me/api/portraits/men/85.jpg",
            quote: "Secure payments and a supportive community. Best platform I've used in years."
        }
    ];

    return (
        <div style={{ padding: '40px 0' }}>
            <Swiper
                spaceBetween={30}
                slidesPerView={1}
                breakpoints={{
                    640: { slidesPerView: 1 },
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                }}
                autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                modules={[Autoplay, Pagination]}
                className="testimonialSwiper"
                style={{ paddingBottom: '50px', paddingTop: '20px' }}
            >
                {testimonials.map((testimonial) => (
                    <SwiperSlide key={testimonial.id}>
                        <motion.div
                            className="card"
                            whileHover={{ y: -10 }}
                            style={{
                                height: '100%',
                                background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.4), rgba(15, 23, 42, 0.6))',
                                padding: '30px',
                                border: '1px solid rgba(255,255,255,0.05)',
                                display: 'flex',
                                flexDirection: 'column',
                                height: '300px'
                            }}
                        >
                            <div style={{ color: '#fbbf24', fontSize: '20px', marginBottom: '20px' }}>
                                ★★★★★
                            </div>
                            <p style={{
                                color: '#cbd5e1',
                                lineHeight: '1.6',
                                marginBottom: '24px',
                                fontStyle: 'italic',
                                flex: 1
                            }}>
                                "{testimonial.quote}"
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    style={{ width: '50px', height: '50px', borderRadius: '50%', border: '2px solid var(--primary-color)' }}
                                />
                                <div>
                                    <div style={{ fontWeight: '700', color: 'white' }}>{testimonial.name}</div>
                                    <div style={{ fontSize: '13px', color: '#94a3b8' }}>{testimonial.role}</div>
                                </div>
                            </div>
                        </motion.div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default TestimonialSlider;
