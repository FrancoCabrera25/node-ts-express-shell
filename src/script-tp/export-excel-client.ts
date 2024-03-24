import * as xlsx from 'xlsx';

// Lista de nombres comunes en español
const nombres = [
    "María", "José", "Ana", "Manuel", "Francisco",
    "Laura", "Antonio", "Isabel", "David", "Marta",
    "Carlos", "Elena", "Juan", "Sara", "Pedro",
    "Carmen", "Luis", "Raquel", "Javier", "Mónica"
    // Añade más nombres si lo deseas
];

// Lista de apellidos comunes en español
const apellidos = [
    "García", "Fernández", "González", "Rodríguez", "López",
    "Martínez", "Sánchez", "Pérez", "Gómez", "Martín",
    "Jiménez", "Ruiz", "Hernández", "Díaz", "Moreno"
    // Añade más apellidos si lo deseas
];

// Función para generar un nombre completo aleatorio
function generateRandomName(): string {
    const randomNombreIndex = Math.floor(Math.random() * nombres.length);
    const randomApellidoIndex = Math.floor(Math.random() * apellidos.length);
    const nombre = nombres[randomNombreIndex];
    const apellido = apellidos[randomApellidoIndex];
    return `${nombre} ${apellido}`;
}

// Función para generar registros aleatorios de clientes
export function generateRandomClientes(numClientes: number): any[] {
    const clientes = [];

    for (let i = 1; i <= numClientes; i++) {
        const id_cliente = i;
        const nombre_completo = generateRandomName(); // Nombre completo aleatorio del cliente
        const otro_dato_cliente = `Otro dato para cliente ${i}`; // Otro dato aleatorio para el cliente

        clientes.push({
            id_cliente,
            nombre_completo,
            otro_dato_cliente,
        });
    }

    return clientes;
}

// Función para guardar los registros de clientes en un archivo Excel
function saveClientesToExcel(clientes: any[], filename: string): void {
    const ws = xlsx.utils.json_to_sheet(clientes);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Clientes');
    xlsx.writeFile(wb, filename);
}

// Generar registros de clientes
const numClientes = 50; // Puedes ajustar este valor según la cantidad deseada de clientes
const clientes = generateRandomClientes(numClientes);

// Guardar registros de clientes en un archivo Excel
const filename = 'clientes.xlsx';
saveClientesToExcel(clientes, filename);

console.log(`Se generaron ${numClientes} registros de clientes y se guardaron en ${filename}`);