# Aula 18 - Boas Práticas de Componentização

Com o projeto crescendo, é fundamental organizar o código para facilitar manutenções futuras e colaboração entre desenvolvedores.

## Organização de arquivos
1. Crie pastas específicas: `src/components` para componentes visuais, `src/plugins` para plugins do Lexical e `src/utils` para funções auxiliares.
2. Cada plugin deve ser exportado por um único arquivo índice dentro de sua pasta. Isso simplifica os imports no restante do projeto.
3. Utilize TypeScript para definir interfaces claras de propriedades e callbacks, evitando erros de tipagem.

## Estratégias adicionais
1. Quando um plugin for muito pesado (por exemplo, o de vídeo ou equações), considere carregá-lo de forma assíncrona usando `React.lazy` e `Suspense`.
2. Documente cada componente com comentários JSDoc ou MDX no Storybook, se estiver usando essa ferramenta.
3. Mantenha testes unitários para os plugins mais complexos, garantindo estabilidade durante refatorações.

Aplicando essas boas práticas, o código do editor se manterá limpo e escalável à medida que novas funcionalidades forem adicionadas.
