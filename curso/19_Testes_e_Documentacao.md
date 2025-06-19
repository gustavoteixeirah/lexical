# Aula 19 - Testes e Documentação

Na penúltima aula vamos abordar a importância de garantir que tudo o que construímos funcione corretamente e seja bem documentado.

## Testes Automatizados
1. Configure o `jest` no projeto, utilizando `ts-jest` para lidar com TypeScript.
2. Crie um teste simples em `Editor.test.tsx` que renderize o componente e verifique se o placeholder aparece na tela.
3. Mostre como testar um plugin isolado simulando o disparo de comandos com a `react-testing-library`.
4. Adicione um script `npm test` no `package.json` para facilitar a execução durante o desenvolvimento.

## Documentação
1. Utilize comentários JSDoc em todos os plugins exportados, explicando suas propriedades e exemplos de uso.
2. Se desejar, configure o Storybook para demonstrar visualmente cada componente. Explique como rodar `npm run storybook`.
3. Mantenha um `README.md` dentro da pasta `curso` ou no repositório principal descrevendo as principais etapas de instalação e execução.

Com testes e documentação em dia, o projeto se torna mais profissional e convidativo para contribuições externas.
