# Aula 14 - Exportando e Importando HTML

Até agora editamos o conteúdo apenas na memória. Vamos aprender a salvar o estado para persistência e a carregar novamente quando necessário.

## Exportando para HTML
1. No `Editor`, crie um botão "Exportar" que chama `editor.getEditorState()` e, com `generateHtmlFromNodes`, converte os nós em uma string HTML.
2. Mostre a string gerada em um `textarea` ou salve em um arquivo temporário para download.
3. Explique que é possível salvar também o JSON do `EditorState` para ter uma representação mais fiel do documento.

## Importando conteúdo
1. Crie um botão "Importar" que recebe um HTML previamente salvo e utilize `editor.parseEditorState` para convertê-lo de volta em nós.
2. Chame `editor.setEditorState` com o estado gerado para que o conteúdo apareça novamente.
3. Reforce a importância de sanitizar o HTML vindo de fontes externas para evitar execução de scripts maliciosos.

Com esses métodos conseguimos persistir rascunhos e compartilhar documentos de forma segura entre diferentes sessões do usuário.
