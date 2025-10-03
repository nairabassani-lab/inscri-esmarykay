// O ID da planilha deve ser este:
const SPREADSHEET_ID = '1pixrjTQ-fOCVxuk4zW37PVV1tOXuRgv96siK4MyjxEc'; 
const SHEET_NAME = 'Inscricoes'; // Altere para o nome da aba (Sheet) onde os dados serão salvos, se for diferente.

/**
 * Função principal para lidar com requisições POST (envio do formulário).
 */
function doPost(e) {
  try {
    // 1. Abre a planilha e seleciona a aba de destino
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      throw new Error(`A aba com o nome "${SHEET_NAME}" não foi encontrada.`);
    }

    // 2. Extrai os dados enviados pelo formulário
    const data = e.parameter;
    const timestamp = new Date();
    const nome = data.nome || '';
    const email = data.email || '';
    const telefone = data.telefone || '';

    // 3. Validação básica
    if (!nome || !email || !telefone) {
        return ContentService.createTextOutput(JSON.stringify({ 
            result: 'error', 
            message: 'Dados incompletos. Por favor, preencha todos os campos.' 
        })).setMimeType(ContentService.MimeType.JSON);
    }

    // 4. Adiciona a nova linha com os dados
    // Certifique-se de que a ordem aqui corresponde aos cabeçalhos da sua planilha!
    sheet.appendRow([timestamp, nome, email, telefone]);

    // 5. Retorna sucesso (resposta JSON)
    const successResponse = {
      result: 'success',
      message: 'Inscrição de ' + nome + ' realizada com sucesso! Você pode fechar esta página.',
      timestamp: timestamp.toISOString()
    };
    
    return ContentService.createTextOutput(JSON.stringify(successResponse))
        .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // 6. Retorna erro (resposta JSON)
    Logger.log(error.toString());
    const errorResponse = {
      result: 'error',
      message: 'Erro interno do servidor: ' + error.message
    };
    return ContentService.createTextOutput(JSON.stringify(errorResponse))
        .setMimeType(ContentService.MimeType.JSON);
  }
}

// A função doGet é necessária para lidar com requisições GET/OPTIONS e evitar erros CORS
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ 
      result: 'error', 
      message: 'Método GET não permitido para esta API de submissão.' 
  })).setMimeType(ContentService.MimeType.JSON);
}
