
import * as fs from 'fs';
import * as xlsx from 'xlsx';

// Función para generar un ID aleatorio dentro de un rango
function generateRandomId(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Función para generar registros aleatorios
export function generateRandomRecords(numRecords: number): any[] {
    const records = [];

    // Rango de fechas desde enero de 2022 hasta diciembre de 2023
    const startDate = new Date('2022-01-01');
    const endDate = new Date('2023-12-31');

    for (let i = 0; i < numRecords; i++) {
        const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
        const id_tiempo = `${randomDate.getFullYear()}${(randomDate.getMonth() + 1).toString().padStart(2, '0')}`;
        const id_producto = generateRandomId(1, 50);
        const id_sucursal = generateRandomId(1, 5);
        const id_cliente = generateRandomId(1, 50); // ID de cliente incremental
        const total_ventas = Math.random() * 1000; // Total de ventas aleatorio
        let unidades_vendidas = Math.floor(Math.random() * 91) + 10; // Unidades vendidas aleatorias

        records.push({
            id_tiempo,
            id_producto,
            id_sucursal,
            id_cliente,
            total_ventas,
            unidades_vendidas,
        });
    }

    return records;
}

// Función para guardar los registros en un archivo Excel
function saveToExcel(records: any[], filename: string): void {
    const ws = xlsx.utils.json_to_sheet(records);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Registros');
    xlsx.writeFile(wb, filename);
}

// Generar registros
const numRecords = 100000;
const records = generateRandomRecords(numRecords);

// Guardar registros en un archivo Excel
const filename = 'registros.xlsx';
saveToExcel(records, filename);

console.log(`Se generaron ${numRecords} registros y se guardaron en ${filename}`);