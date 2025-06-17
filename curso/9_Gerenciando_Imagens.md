# Aula 9 - Gerenciando Imagens

Imagens deixam o texto muito mais interessante. Vamos aprender como permitir que o usuário envie figuras para o editor e as manipule.

## Implementação
1. Instale o pacote opcional `@lexical/react/LexicalImage` ou utilize um exemplo de `ImageNode` customizado.
2. No componente `Toolbar`, adicione um botão "Inserir Imagem" que abre o seletor de arquivos (`<input type="file" />`).
3. No `onChange` desse input, leia o arquivo e converta para URL com `URL.createObjectURL` ou envie para um servidor.
4. Dentro do `Editor`, insira o nó de imagem usando `editor.insertNodes([new ImageNode({src})])`.
5. Permita que o usuário redimensione ou remova a imagem adicionando handlers de drag e um ícone de exclusão.
6. Fale sobre a importância de adicionar um campo para texto alternativo (atributo `alt`) garantindo a acessibilidade.

## Dicas de armazenamento
- Para testes locais, armazenar as imagens em memória usando `blob:` URLs é suficiente.
- Em produção, considere enviar para um serviço como Amazon S3 ou Cloudinary e salvar apenas a URL no estado do documento.

Com suporte a imagens, nosso editor fica mais completo e pronto para lidar com outros tipos de mídia.
