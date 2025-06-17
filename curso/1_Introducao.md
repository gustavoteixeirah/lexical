# Aula 1 - Introdução ao Curso

Bem-vindo ao curso **Construindo Editores de Texto com Lexical**. Nesta primeira aula vamos entender o que é o projeto Lexical, por que ele foi criado e como será a nossa jornada ao longo das próximas aulas.

## Por que precisamos de editores modernos
Comece explicando que, nos últimos anos, muitos aplicativos web passaram a demandar interfaces ricas de texto — desde blogs até ferramentas de chat e plataformas de colaboração. Apesar de existirem várias bibliotecas, é comum esbarrarmos em problemas de performance, acessibilidade ou dificuldade para estender recursos. O Lexical foi criado pelo time do Facebook para resolver essas dores.

## O que é o Lexical
Apresente rapidamente que o Lexical é um framework de editor de texto focado em confiabilidade e extensibilidade. Ele permite criar desde editores simples até experiências ricas, controladas via React ou outras bibliotecas. Mostre o [repositório oficial](https://github.com/facebook/lexical) e destaque que ele é open source.

## Estrutura do curso
Explique que ao longo de **20 aulas** construiremos passo a passo um editor em React. Cada aula servirá como roteiro de um vídeo e apresentará algo novo:
- Inicialização do projeto
- Funcionamento interno do Lexical
- Criação de plugins e customizações
- Suporte a multimídia e colaboração
- Exportação/importação do conteúdo
- Boas práticas e testes

Reforce que todo o código será versionado para que o aluno possa acompanhar.

## Tarefas para hoje
1. Conferir se o Node.js e o npm estão instalados (`node -v` e `npm -v`). Caso não estejam, orientar a instalação a partir do site oficial.
2. Clonar ou baixar o projeto base disponível no repositório do curso.
3. Executar `npm install` na raiz do projeto para baixar as dependências.
4. Explorar rapidamente o playground do Lexical para ter um gostinho do que o editor é capaz.

Na próxima aula iniciaremos a configuração do projeto React e veremos a estrutura de arquivos. Até lá!

## Cronograma das aulas
A seguir está uma visão geral das próximas aulas, para que você possa se preparar com antecedência. Leia cada resumo e anote dúvidas para trazermos durante o curso:
1. Configuração do projeto React e instalação do Lexical.
2. Entendendo a arquitetura interna de um editor de texto.
3. Primeiros passos com o editor do Lexical e composição em React.
4. Personalização de temas e estilo do conteúdo.
5. Criação e uso de plugins básicos.
6. Desenvolvimento do plugin de AutoFocus.
7. Como trabalhar com rich text e formatação básica.
8. Gerenciamento de imagens no editor.
9. Gerenciamento de áudio e vídeo.
10. Plugin de histórico de edição e atalhos de teclado.
11. Colaboração em tempo real com múltiplos usuários.
12. Exportação e importação do conteúdo em HTML.
13. Plugins para fórmulas matemáticas (KaTeX e MathJax).
14. Integração com Kekule.js para estruturas químicas.
15. Boas práticas de componentização no frontend.
16. Testes automáticos e documentação.
17. Encerramento e próximos passos.

## Primeiros passos no curso
Mesmo sendo uma aula de introdução, é interessante que você prepare o ambiente:
- Reserve um espaço de desenvolvimento com editores que conheça bem (VS Code é bastante usado).
- Garanta que seu terminal aceita comandos como `npm` ou `yarn` sem erros.
- Familiarize-se com o uso de Git para clonar e atualizar repositórios.

Ao término desta aula, você já terá uma noção clara do que iremos abordar. Não hesite em reler esta introdução sempre que precisar se situar no curso.

## Por que o Lexical se destaca
Listamos abaixo algumas vantagens que exploraremos em detalhes ao longo das aulas:
- **Performance**: o Lexical foi construído com foco em renderizar grandes quantidades de texto sem perda de desempenho.
- **Extensibilidade**: você poderá criar plugins personalizados sem modificar o núcleo do editor.
- **Acessibilidade**: segue padrões de ARIA e navegação via teclado, tornando o conteúdo mais inclusivo.
- **Flexibilidade**: não depende exclusivamente do React, permitindo adaptação em diferentes frameworks ou projetos vanilla.

Esses pontos serão reforçados à medida que explorarmos casos reais de uso.

## Preparação para o próximo encontro
Antes de avançar para a Aula 2, certifique-se de:
1. Ter uma conta no GitHub ou em outro serviço de hospedagem de código, para facilitar o acompanhamento.
2. Instalar extensões úteis em seu editor, como suporte a ESLint e Prettier.
3. Ler a documentação básica do Lexical disponível no repositório, principalmente a parte de instalação.

Lembre-se de que cada aula possuirá exemplos práticos para você implementar.

## Links úteis
- [Repositório oficial do Lexical](https://github.com/facebook/lexical)
- [Documentação inicial](https://lexical.dev/docs)
- [Código-fonte do curso](https://github.com/seu-usuario/lexical-curso) (exemplo)

Com isso finalizamos a apresentação. Na aula seguinte iniciaremos de fato a configuração do projeto!
