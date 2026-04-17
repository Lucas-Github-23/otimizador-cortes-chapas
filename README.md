# Otimizador de Cortes

Uma aplicação web moderna e multiplataforma desenvolvida para otimizar o aproveitamento de materiais em processos de corte de chapas (MDF, vidro, metal, etc). O sistema calcula o melhor layout de encaixe para peças retangulares, minimizando o desperdício de matéria-prima e gerando relatórios precisos.

## Principais Funcionalidades

* **Múltiplos Algoritmos de Otimização:**
  * **Bottom-left Decreasing (Padrão):** Rápido e eficiente para a maioria dos casos.
  * **MaxRects Smallest-Side-Fit:** Focado no máximo aproveitamento matemático do espaço.
  * **Skyline Bottom-left:** Mantém um alinhamento mais uniforme, excelente para padrões de veios de madeira.
* **Visualização Gráfica em Tempo Real:** Renderização vetorial e escalável do plano de corte diretamente no navegador.
* **Exportação Profissional:**
  * **PDF:** Geração de Mapa de Corte paginado com escala inteligente.
  * **DXF:** Arquivo pronto para importação em softwares CAD (como AutoCAD) e máquinas CNC.
  * **SVG:** Exportação em vetor puro para visualização e edição web.
* **Persistência de Dados (Auto-Save):** As configurações da chapa e a lista de peças são salvas automaticamente no navegador para evitar perdas acidentais.
* **Prevenção de Erros:** Validação em tempo real que impede o cálculo de peças fisicamente maiores que a dimensão da chapa.

## Tecnologias Utilizadas

* **Frontend:** React + Vite
* **Linguagem:** TypeScript
* **Ícones:** Lucide React
* **Geração de PDF:** jsPDF
* **Identificadores Únicos:** UUID
* **Hospedagem Recomendada:** Vercel

## Como Rodar o Projeto Localmente

### Pré-requisitos
Certifique-se de ter o [Node.js](https://nodejs.org/) instalado em sua máquina.

### Instalação

1. Clone o repositório:
```bash
git clone [https://github.com/lucas-github-23/otimizador-cortes-chapas.git](https://github.com/lucas-github-23/otimizador-cortes-chapas.git)
```

2. Entre no diretório do projeto:
```bash
cd otimizador-cortes-chapas
```

3. Instale as dependências:
```bash
npm install
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

5. Abra o navegador e acesse: `http://localhost:5173`

## Estrutura do Projeto

O código foi desenhado seguindo princípios de Clean Code e separação de responsabilidades (SOLID):

* `/src/components`: Componentes visuais do React (Interface, Listas, Visualizador SVG).
* `/src/hooks`: Lógica de gerenciamento de estado da interface (`useOptimizer`).
* `/src/services`: Núcleo de regras de negócio (Motores matemáticos de otimização e lógicas de exportação).
* `/src/types`: Interfaces TypeScript rigorosas para as entidades do sistema.

## Licença

Este projeto foi desenvolvido como uma solução de código aberto para facilitar o dia a dia de marceneiros, projetistas e engenheiros. Sinta-se livre para clonar, modificar e utilizar.
