export function obtenerMesaDesdeUrl(queryString: string): number | null {
    const params = new URLSearchParams(queryString);
    const mesa = params.get('mesa');
    
    if (!mesa) return null;
    
    const numeroMesa = parseInt(mesa, 10);
    
    if (isNaN(numeroMesa) || numeroMesa <= 0) {
        return null;
    }
    
    return numeroMesa;
}