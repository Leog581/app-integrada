import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { slides } from '../data/slides';
import { products } from '../data/products';

const LandingPage = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="space-y-20 pb-16">
            
            {/* 1. CARRUSEL PRINCIPAL (Hero) */}
            <div 
                className="relative h-[450px] md:h-[550px] rounded-3xl overflow-hidden shadow-2xl transition-all duration-700 bg-cover bg-center"
                style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
            >
                {/* Capa oscura para legibilidad */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-black/40 to-transparent flex flex-col items-center justify-center text-white text-center p-6">
                    <span className="bg-blue-600/90 text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4 backdrop-blur-sm shadow-lg">
                        Sistema Integral de Gestión
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg leading-tight">
                        {slides[currentSlide].title}
                    </h1>
                    <p className="text-lg md:text-xl font-medium mb-8 max-w-2xl drop-shadow-md text-gray-200">
                        {slides[currentSlide].description}
                    </p>
                    <div className="flex gap-4">
                        <Link to="/register" className="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-blue-500 transition-all shadow-lg hover:-translate-y-0.5">
                            Empezar ahora
                        </Link>
                        <Link to="/products" className="bg-white/10 text-white backdrop-blur-md border border-white/20 px-8 py-3.5 rounded-xl font-bold hover:bg-white/20 transition-all">
                            Ver servicios
                        </Link>
                    </div>
                </div>
                
                {/* Indicadores del carrusel */}
                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-blue-500 w-8' : 'bg-white/50 w-2 hover:bg-white'}`}
                        />
                    ))}
                </div>
            </div>

            {/* 2. PRESENTACIÓN DEL SISTEMA (Los 3 Módulos) */}
            <div className="text-center max-w-5xl mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-800">Todo lo que necesitás en un solo lugar</h2>
                <p className="text-gray-500 mb-12 max-w-2xl mx-auto text-lg">
                    App Integrada unifica tus herramientas diarias para que dejes de saltar entre sistemas. Gestioná tu equipo y recursos desde un panel central.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Módulo 1 */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-6 mx-auto group-hover:scale-110 transition-transform">
                            🎟️
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-gray-800">Soporte y Tickets</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">Reportá problemas, seguí su estado en tiempo real y asegurate de que nada quede sin resolver.</p>
                    </div>
                    
                    {/* Módulo 2 */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl mb-6 mx-auto group-hover:scale-110 transition-transform">
                            📦
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-gray-800">Control de Inventario</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">Mantené el stock actualizado, controlá los precios y visualizá el valor total de tus activos.</p>
                    </div>

                    {/* Módulo 3 */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                        <div className="w-16 h-16 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center text-3xl mb-6 mx-auto group-hover:scale-110 transition-transform">
                            📒
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-gray-800">Agenda de Contactos</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">Organizá clientes y proveedores con categorías, filtros avanzados y búsqueda inteligente.</p>
                    </div>
                </div>
            </div>

            {/* 3. SECCIÓN DE SERVICIOS (La que te gustaba) */}
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Nuestros Servicios</h2>
                    <p className="text-gray-500 text-lg">Soluciones tecnológicas diseñadas para potenciar tu trabajo.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div key={product.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
                            <div>
                                <div className="mb-4 overflow-hidden rounded-xl h-36">
                                    <img 
                                        src={product.image} 
                                        alt={product.name} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                    />
                                </div>
                                <h3 className="text-lg font-bold mb-2 text-gray-800">{product.name}</h3>
                                <p className="text-gray-500 mb-4 text-sm leading-relaxed">{product.description}</p>
                            </div>
                            <div className="mt-2 pt-4 border-t border-gray-100 flex justify-between items-center">
                                <span className="text-xl font-extrabold text-blue-600">{product.price}</span>
                                <button className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-bold text-sm hover:bg-blue-600 hover:text-white transition-colors">
                                    Consultar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 4. ¿POR QUÉ ELEGIRNOS? (Mantenemos tus tarjetas originales) */}
            <div className="text-center max-w-4xl mx-auto px-4 pt-10">
                <h2 className="text-3xl font-bold mb-4 text-gray-800">¿Por qué elegir App Integrada?</h2>
                <p className="text-gray-600 mb-10">Brindamos un entorno rápido, seguro y adaptado a tus necesidades operativas.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="text-4xl mb-3">🚀</div>
                        <h3 className="text-lg font-bold mb-2">Rápido y Eficiente</h3>
                        <p className="text-gray-500 text-sm">Todo centralizado para que no pierdas tiempo cambiando de pestaña o sistema.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="text-4xl mb-3">🔧</div>
                        <h3 className="text-lg font-bold mb-2">Soporte Especializado</h3>
                        <p className="text-gray-500 text-sm">Contamos con un equipo listo para resolver cualquier incidencia técnica.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="text-4xl mb-3">🔒</div>
                        <h3 className="text-lg font-bold mb-2">Seguro y Confiable</h3>
                        <p className="text-gray-500 text-sm">Tus datos están protegidos con autenticación por roles y encriptación.</p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default LandingPage;