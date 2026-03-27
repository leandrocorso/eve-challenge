# 🚀 Lançamentos SpaceX - EVE Challenge

Este projeto é uma aplicação React desenvolvida para o desafio técnico da **Eve**, com o objetivo de visualizar e filtrar lançamentos da SpaceX utilizando a API oficial.

## ⚙️ Como Rodar o Projeto

Após clonar o repositório, abra a pasta do projeto num terminal e digite:

```
npm i
```

Em seguida, para executar:

```
npm run dev
```

Por fim, o sistema estará disponível em `http://localhost:5173`

## ✨ Outros scripts

### Testes

Direto no terminal: `npm run test`

Com tabela de cobertura: `npm run test:coverage`

Com interface gráfica em HTML: `npm run test:ui`

Execução em tempo real: `npm run test:watch`

### Build e preview

Compilar o código do projeto: `npm run build`

Em seguida execute `npm run preview`.

O navegador abrirá a interface no endereço `http://localhost:4173`

### Lint

Para conferir se há erros de lint (ESlint): `npm run lint`

## 🛠️ Tecnologias Utilizadas

- **React 18** + **TypeScript**
- **Vite** (Build Tool)
- **MUI (Material UI)** - Optei por este DS por ter mais familiaridade. Também pela implementação fácil em React, maturidade do projeto e pela acessibilidade pré-configurada (aria attributes).
- **TanStack Query (React Query)** - Gerenciamento de estado assíncrono e cache
- **React Router Dom** - Roteamento SPA
- **Vitest** + **React Testing Library** - Testes unitários e de integração
- **MSW (Mock Service Worker)** - Mocking de API para testes
- **Dayjs** + **MUI X Date Pickers** - Manipulação e seleção de datas

## ✨ Diferenciais Implementados (Bônus)

- 🌓 **Dark Mode:** Suporte a tema claro e escuro com persistência de estado.
- 🛡️ **Error Boundary:** Tratamento de erros de renderização com UI de fallback amigável.
- 🔍 **Debounce Search:** Otimização de performance na busca por texto para evitar requisições excessivas.
- 🤚 **Cancelamento de requests:** Usei o recurso `signal` do `TanStack Query` que permite cancelar automaticamente requests quando uma query se torna obsoleta ou é desmontada.
- 🚦 **Path Aliases:** Configuração de caminhos absolutos com `@/` para melhor organização de imports.
- 🔄 **Persistência de Filtros:** É possível recarregar a página ou compartilhar o link direto com todos os filtros aplicados, pois os parâmetros de busca são sincronizados em tempo real com a URL da aplicação.
- 📈 **Cobertura de Testes:** Testes de componentes e integração garantindo a confiabilidade das regras de negócio.
- 🏷️ **SEO & Metadados:** Uso de `react-helmet-async` para títulos dinâmicos por rota.

## 🏗️ Arquitetura e Decisões Técnicas

### Organização de Pastas

Conforme solicitado, usei uma estrutura baseada em **Features** dentro de `src/features`, o que facilita a escalabilidade do projeto. Componentes globais e hooks compartilhados residem em `src/common`.

### Gerenciamento de Dados

Utilizei o **TanStack Query** para lidar com as requisições à API da SpaceX. Isso permitiu:

- Cache automático dos lançamentos.
- Gerenciamento simplificado de estados de `loading` e `error`.
- Sincronização automática quando os filtros (busca, data, status) são alterados.

### Qualidade de Código

- **ESLint + Prettier:** Configurados para garantir um padrão de código limpo e ordenação automática de imports.
- **Type Safety:** Uso rigoroso de TypeScript, evitando `any` para garantir que erros sejam capturados em tempo de compilação.

## 🔍 Como usar os Filtros

A página principal oferece um sistema de busca avançada para encontrar lançamentos específicos. Você pode combinar múltiplos filtros para refinar sua pesquisa:

- **Busca por Nome:**
  - Digite o nome da missão (ex: "Falcon", "Starlink", "SES") no campo **"Buscar por nome"**.
  - A busca é realizada em tempo real com técnica de _debounce_, otimizando a performance e reduzindo requisições desnecessárias à API.

- **Filtro de Status:**
  - No seletor **"Status"**, você pode filtrar por:
    - **Todos:** Mostra o histórico completo.
    - **Sucesso:** Apenas missões que atingiram seus objetivos.
    - **Falha:** Missões que tiveram problemas durante o lançamento.

- **Filtro de Lançamentos (Próximos):**
  - No seletor **"Lançamentos"**, alterne entre:
    - **Todos:** Lista todos os registros.
    - **Upcoming:** Mostra apenas as missões que ainda estão agendadas para o futuro.

- **Intervalo de Datas:**
  - Utilize os campos **"Data início"** e **"Data fim"** para visualizar lançamentos ocorridos em um período específico.
  - O componente utiliza o **MUI Date Picker**, permitindo uma seleção visual e intuitiva através do calendário.

- **Modo Escuro (Dark Mode):**
  - No canto superior direito, utilize o botão **"MODO ESCURO"** para alternar a interface entre os temas claro e escuro, garantindo melhor conforto visual.

> **Dica de Uso:** Os filtros são cumulativos. É possível, por exemplo, buscar por missões "Falcon" que ocorreram com "Sucesso" dentro de um intervalo de datas específico.
