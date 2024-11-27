import * as SQLite from "expo-sqlite";

// Definición de la interfaz para una medición
interface Measurement {
  id?: number; // id es opcional porque no se proporciona al insertar
  code: number;
  direction: string;
  valAnt: number;
  valNew?: number | null; // valNew puede ser un número o null
}

let db: SQLite.SQLiteDatabase; // Declarar la variable de la base de datos

export const initDB = async () => {
  const DATABASE_VERSION = 1;

  // Abre la base de datos de manera asincrónica
  db = await SQLite.openDatabaseAsync("testMeasurements.db");

  try {
    const { user_version: currentDbVersion } = 
      (await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version')) || { user_version: 0 };

    if (currentDbVersion >= DATABASE_VERSION) {
      return;
    }

    if (currentDbVersion < 1) {
      // Verificar si la tabla ya existe antes de crearla
      const tableExists = await db.getFirstAsync(
        `SELECT name 
        FROM sqlite_master 
        WHERE type='table' AND name='measurements';`
      );

      // Si la tabla no existe, crearla
      if (!tableExists) {
        await db.execAsync(
          `CREATE TABLE measurements IF NOT EXISTS(
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            code INTEGER NOT NULL,
            direction TEXT NOT NULL,
            valAnt INTEGER NOT NULL CHECK (valAnt >= 0),
            valNew INTEGER CHECK (valNew IS NULL OR (valNew >= 0 AND valNew >= valAnt))
          );`
        );
        await db.execAsync(
          `INSERT INTO measurements (code, direction, valAnt, valNew) VALUES (123456789012, 'Bv. Colon 611 bis', 25, NULL);`
        );
        await db.execAsync(
          `INSERT INTO measurements (code, direction, valAnt, valNew) VALUES (987654321098, 'Corrientes 1250', 45, NULL);`
        );
        console.log("DataBase Created");
      }
      console.log("DataBase Already Exists");
    }

    // Actualizar la versión de la base de datos
    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
};

export const addMeasurement = async (measurement: number)=> {
  try {
    await db.runAsync(
      `INSERT INTO measurements (valNew) VALUES (?)`,
      [measurement]
    );
  } catch (error) {
    console.error("Error adding measurement:", error);
    throw error;
  }
};

export const getAll = async () => {
    try {
        const info = await db.getAllAsync(`SELECT * FROM measurements;`);
        return info;
    } catch (error) {
        console.error("Error al obtener todas las mediciones:", error);
        throw error;
    }
};


export const getInfoCode = async (code: number) => {
    try {
        const result = await db.getFirstAsync(
          `SELECT * FROM measurements WHERE code = ?;`,
          [code]
        );

        return result;
      } catch (error) {
        console.error("Error al obtener la medición:", error);
        throw error;
      }
}

export const updateMeasurement = async (code: number, newValue: number) => {
    try {
      await db.runAsync(
        `UPDATE measurements SET valNew = ? WHERE code = ?;`,
        [newValue, code]
      );
      console.log(`Medición con código ${code} actualizada a valNew = ${newValue}`);
    } catch (error) {
      console.error("Error al actualizar la medición:", error);
      throw error;
    }
};

const MeasurementDB = {
    initDB,
    addMeasurement,
    getInfoCode,
    updateMeasurement,
    getAll,
};
  
export default MeasurementDB;
