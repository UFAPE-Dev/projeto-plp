import * as FileSystem from 'expo-file-system'
import * as Sharing from "expo-sharing"

/**
 * Função para exportar o banco de dados do SQLite para algum lugar.
 */
export default async function exportarBancoDeDados() {
  await Sharing.shareAsync(
    `${FileSystem.documentDirectory}/SQLite/db.db`,
    { dialogTitle: "Compartilhar arquivo do banco de dados." }
  );
}
