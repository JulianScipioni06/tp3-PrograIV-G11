import { obtenerMesaDesdeUrl } from '../utils/mesa';

export const Header = () => {
    // leemos la URL actual del navegador
    const searchString = window.location.search;
    const mesa = obtenerMesaDesdeUrl(searchString);

    return (
        <header className="bg-primary text-white p-3 text-center sticky-top">
            <h1 className="h4 mb-1">Cafetería Origen</h1>
            <p className="mb-0 fw-bold fs-5">
                {mesa !== null ? `Mesa ${mesa}` : 'Retiro en barra'}
            </p>
        </header>
    );
};