import * as SQLite from "expo-sqlite";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

  try {
    const firstTimeSetup = await AsyncStorage.getItem("DB_INITIALIZED");

    if (firstTimeSetup) {
      // Si ya está inicializada, solo abre la base de datos
      db = await SQLite.openDatabaseAsync("testmeasurement.db");
      return false; // Indica que no es la primera vez
    }

    db = await SQLite.openDatabaseAsync("testmeasurement.db");
    const { user_version: currentDbVersion } = (await db.getFirstAsync<{
      user_version: number;
    }>("PRAGMA user_version")) || { user_version: 0 };

    if (currentDbVersion >= DATABASE_VERSION) {
      console.log("Database is up to date");
    }

    if (currentDbVersion < 1) {
      console.log("Creating new table measurement");

      await db.execAsync(
        `CREATE TABLE IF NOT EXISTS measurement (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          code INTEGER NOT NULL,
          direction TEXT NOT NULL,
          valAnt INTEGER NOT NULL CHECK (valAnt >= 0),
          valNew INTEGER CHECK (valNew IS NULL OR (valNew >= 0 AND valNew >= valAnt))
        );`
      );

      await db.execAsync(
        `INSERT INTO measurement (code, direction, valAnt, valNew) VALUES 
        (123456789012, 'Bv. Colon 611 bis', 25, NULL),
        (987654321098, 'Corrientes 1250', 45, NULL);`
      );
      console.log("Table created and initial data inserted");
    }

    

    // Actualizar la versión de la base de datos
    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
    console.log("Database version updated to", DATABASE_VERSION);
    await AsyncStorage.setItem("DB_INITIALIZED", "true");
    return true;
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
};

export const addMeasurement = async (measurement: Measurement) => {
  try {
    await db.runAsync(
      `INSERT INTO measurement (code, direction, valAnt, valNew) VALUES (?, ?, ?, ?)`,
      [measurement.code, measurement.direction, measurement.valAnt, null]
    );
    console.log("Measurement added");
  } catch (error) {
    console.error("Error adding measurement:", error);
    throw error;
  }
};

export const getAll = async () => {
  try {
    const info = await db.getAllAsync(`SELECT * FROM measurement;`);
    return info;
  } catch (error) {
    console.error("Error fetching all measurement:", error);
    throw error;
  }
};

export const getInfoCode = async (code: number) => {
  try {
    const result = await db.getFirstAsync(
      `SELECT * FROM measurement WHERE code = ?;`,
      [code]
    );

    return result;
  } catch (error) {
    console.error("Error fetching measurement by code:", error);
    throw error;
  }
};

export const updateMeasurement = async (code: number, newValue: number) => {
  try {
    await db.runAsync(`UPDATE measurement SET valNew = ? WHERE code = ?;`, [
      newValue,
      code,
    ]);
    console.log(
      `Measurement with code ${code} updated to valNew = ${newValue}`
    );
  } catch (error) {
    console.error("Error updating measurement:", error);
    throw error;
  }
};

export const resetTable = async () => {
  try {
    const tableExists = await db.getFirstAsync(
      `SELECT name 
      FROM sqlite_master 
      WHERE type='table' AND name='measurement';`
    );

    if (tableExists) {
      await db.execAsync("DELETE FROM measurement;");
      console.log("Table reset");

      await db.execAsync(
        `INSERT INTO measurement (code, direction, valAnt, valNew) VALUES 
        (123456789012, 'Bv. Colon 611 bis', 25, NULL),
        (987654321098, 'Corrientes 1250', 45, NULL);`
      );
      console.log("Initial data reinserted");
    } else {
      console.log("Table measurement does not exist");
    }
  } catch (error) {
    console.error("Error resetting table:", error);
    throw error;
  }
};

const MeasurementDB = {
  initDB,
  addMeasurement,
  getInfoCode,
  updateMeasurement,
  getAll,
  resetTable,
};

export default MeasurementDB;
