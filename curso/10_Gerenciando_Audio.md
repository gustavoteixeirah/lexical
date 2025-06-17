# Aula 10 - Inserindo Áudio

Além de imagens, podemos enriquecer o documento com clipes de áudio. Vamos ver como criar um plugin simples para reproduzir arquivos enviados pelo usuário.

## Passos
1. Caso exista um plugin de áudio na comunidade, instale-o. Se não, crie um `AudioNode` estendendo `DecoratorNode` para renderizar um `<audio controls>`.
2. Na `Toolbar`, adicione um botão "Adicionar Áudio" que abra um `<input type="file" accept="audio/mp3" />`.
3. Após selecionar o arquivo, gere uma URL temporária com `URL.createObjectURL` e insira um novo `AudioNode` no editor.
4. Permita que o usuário defina uma legenda opcional e mantenha essa informação no estado do nó.
5. Mostre como remover ou substituir o arquivo, selecionando o node e pressionando Delete.

## Acessibilidade e boas práticas
- Inclua sempre um texto alternativo descrevendo o conteúdo do áudio para usuários que não podem ouvi-lo.
- Considere hospedar os arquivos em um servidor e salvar apenas a URL no documento para diminuir o tamanho do payload.

Com esse recurso implementado, os documentos produzidos em nosso editor se tornam muito mais dinâmicos.
