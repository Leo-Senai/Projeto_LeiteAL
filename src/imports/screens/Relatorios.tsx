import { useEffect, useState } from 'react'
import Card from '../components/Card'

type ReportData = {
  producaoTotal: number
  quantidadeVacas: number

  alimentacao: number
  maoObra: number
  sanidadeReproducao: number
  energiaCombustivel: number
  manutencaoDepreciacao: number

  despesasTotais: number
  receita: number
  lucro: number
}

export default function Relatorios() {
  const [data, setData] = useState<ReportData>({
    producaoTotal: 0,
    quantidadeVacas: 0,

    alimentacao: 0,
    maoObra: 0,
    sanidadeReproducao: 0,
    energiaCombustivel: 0,
    manutencaoDepreciacao: 0,

    despesasTotais: 0,
    receita: 0,
    lucro: 0,
  })

  const [loading, setLoading] = useState(true)
  const [summary, setSummary] =
    useState<Record<string, string> | null>(null)

  // ===============================
  // FORMATAR DINHEIRO
  // ===============================

  function formatCurrency(value: number) {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  // ===============================
  // BUSCAR DADOS DO SISTEMA
  // ===============================

  async function carregarDados() {
    try {
      setLoading(true)

      // ===========================
      // PRODUÇÃO DE LEITE
      // ===========================

      const { data: producaoData, error: producaoError } =
        await supabase
          .from('producao')
          .select('quantidade')

      if (producaoError) {
        console.error(
          'Erro ao buscar produção:',
          producaoError
        )
      }

      const producaoTotal =
        producaoData?.reduce(
          (total, item) =>
            total + Number(item.quantidade || 0),
          0
        ) || 0


      // ===========================
      // VACAS
      // ===========================

      const { count: quantidadeVacas, error: vacasError } =
        await supabase
          .from('animais')
          .select('*', {
            count: 'exact',
            head: true,
          })

      if (vacasError) {
        console.error(
          'Erro ao buscar animais:',
          vacasError
        )
      }


      // ===========================
      // ALIMENTAÇÃO
      // ===========================

      const { data: alimentacaoData, error: alimentacaoError } =
        await supabase
          .from('alimentacao')
          .select('valor')

      if (alimentacaoError) {
        console.error(
          'Erro ao buscar alimentação:',
          alimentacaoError
        )
      }

      const alimentacao =
        alimentacaoData?.reduce(
          (total, item) =>
            total + Number(item.valor || 0),
          0
        ) || 0


      // ===========================
      // CUSTOS
      // ===========================

      const { data: custosData, error: custosError } =
        await supabase
          .from('custos')
          .select(`
            categoria,
            valor
          `)

      if (custosError) {
        console.error(
          'Erro ao buscar custos:',
          custosError
        )
      }


      // Valores das categorias

      const maoObra =
        custosData
          ?.filter(
            item =>
              item.categoria === 'Mão de obra'
          )
          .reduce(
            (total, item) =>
              total + Number(item.valor || 0),
            0
          ) || 0


      const sanidadeReproducao =
        custosData
          ?.filter(
            item =>
              item.categoria ===
              'Sanidade e reprodução'
          )
          .reduce(
            (total, item) =>
              total + Number(item.valor || 0),
            0
          ) || 0


      const energiaCombustivel =
        custosData
          ?.filter(
            item =>
              item.categoria ===
              'Energia e combustível'
          )
          .reduce(
            (total, item) =>
              total + Number(item.valor || 0),
            0
          ) || 0


      const manutencaoDepreciacao =
        custosData
          ?.filter(
            item =>
              item.categoria ===
              'Manutenção e depreciação'
          )
          .reduce(
            (total, item) =>
              total + Number(item.valor || 0),
            0
          ) || 0


      // ===========================
      // RECEITA
      // ===========================

      const { data: receitaData, error: receitaError } =
        await supabase
          .from('receitas')
          .select('valor')

      if (receitaError) {
        console.error(
          'Erro ao buscar receitas:',
          receitaError
        )
      }

      const receita =
        receitaData?.reduce(
          (total, item) =>
            total + Number(item.valor || 0),
          0
        ) || 0


      // ===========================
      // DESPESAS TOTAIS
      // ===========================

      const despesasTotais =
        alimentacao +
        maoObra +
        sanidadeReproducao +
        energiaCombustivel +
        manutencaoDepreciacao


      // ===========================
      // LUCRO
      // ===========================

      const lucro =
        receita - despesasTotais


      // ===========================
      // ATUALIZAR ESTADO
      // ===========================

      setData({
        producaoTotal,

        quantidadeVacas:
          quantidadeVacas || 0,

        alimentacao,
        maoObra,
        sanidadeReproducao,
        energiaCombustivel,
        manutencaoDepreciacao,

        despesasTotais,
        receita,
        lucro,
      })

    } catch (error) {

      console.error(
        'Erro ao carregar relatório:',
        error
      )

    } finally {

      setLoading(false)

    }
  }


  // ===============================
  // CARREGAR AUTOMATICAMENTE
  // ===============================

  useEffect(() => {

    carregarDados()

  }, [])


  // ===============================
  // GERAR RESUMO
  // ===============================

  function gerarResumo() {

    setSummary({

      'Produção total':
        `${data.producaoTotal.toLocaleString(
          'pt-BR'
        )} L`,

      'Quantidade de vacas':
        String(data.quantidadeVacas),

      'Custo com alimentação':
        formatCurrency(data.alimentacao),

      'Mão de obra':
        formatCurrency(data.maoObra),

      'Sanidade e reprodução':
        formatCurrency(
          data.sanidadeReproducao
        ),

      'Energia e combustível':
        formatCurrency(
          data.energiaCombustivel
        ),

      'Manutenção e depreciação':
        formatCurrency(
          data.manutencaoDepreciacao
        ),

      'Despesas totais':
        formatCurrency(
          data.despesasTotais
        ),

      'Receita':
        formatCurrency(
          data.receita
        ),

      'Lucro estimado':
        formatCurrency(
          data.lucro
        ),

    })
  }


  // ===============================
  // EXPORTAR CSV
  // ===============================

  function downloadCSV() {

    const rows = [

      ['Indicador', 'Valor'],

      [
        'Produção total',
        `${data.producaoTotal} L`,
      ],

      [
        'Quantidade de vacas',
        data.quantidadeVacas,
      ],

      [
        'Alimentação',
        data.alimentacao,
      ],

      [
        'Mão de obra',
        data.maoObra,
      ],

      [
        'Sanidade e reprodução',
        data.sanidadeReproducao,
      ],

      [
        'Energia e combustível',
        data.energiaCombustivel,
      ],

      [
        'Manutenção e depreciação',
        data.manutencaoDepreciacao,
      ],

      [
        'Despesas totais',
        data.despesasTotais,
      ],

      [
        'Receita',
        data.receita,
      ],

      [
        'Lucro',
        data.lucro,
      ],

    ]

    const csv = rows
      .map(row =>
        row
          .map(value =>
            `"${value}"`
          )
          .join(',')
      )
      .join('\n')


    const blob = new Blob(
      [
        '\ufeff' + csv,
      ],
      {
        type:
          'text/csv;charset=utf-8;',
      }
    )


    const url =
      URL.createObjectURL(blob)

    const a =
      document.createElement('a')

    a.href = url

    a.download =
      `relatorio-leite-al-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`

    a.click()

    URL.revokeObjectURL(url)
  }


  // ===============================
  // INTERFACE
  // ===============================

  return (

    <Card>

      {/* CABEÇALHO */}

      <div className="section-header">

        <div>

          <div className="eyebrow">
            Relatórios
          </div>

          <h2>
            Indicadores da propriedade
          </h2>

        </div>


        <button
          className="btn btn-ghost"
          onClick={carregarDados}
        >
          Atualizar
        </button>

      </div>


      <p className="muted">

        Acompanhe automaticamente os dados registrados
        nas outras áreas do sistema.

      </p>


      {/* LOADING */}

      {loading && (

        <p className="muted">

          Carregando informações...

        </p>

      )}


      {!loading && (

        <>

          {/* MÉTRICAS PRINCIPAIS */}

          <div className="metric-grid">

            <div className="metric-card">

              <span className="label">
                Produção
              </span>

              <strong>
                {data.producaoTotal.toLocaleString(
                  'pt-BR'
                )} L
              </strong>

              <small>
                produção registrada
              </small>

            </div>


            <div className="metric-card">

              <span className="label">
                Vacas
              </span>

              <strong>
                {data.quantidadeVacas}
              </strong>

              <small>
                animais cadastrados
              </small>

            </div>


            <div className="metric-card">

              <span className="label">
                Despesas
              </span>

              <strong>
                {formatCurrency(
                  data.despesasTotais
                )}
              </strong>

              <small>
                custos registrados
              </small>

            </div>

          </div>


          {/* INDICADORES FINANCEIROS */}

          <div
            className="metric-grid"
            style={{
              marginTop: 18,
            }}
          >

            <div className="metric-card">

              <span className="label">
                Receita
              </span>

              <strong>
                {formatCurrency(
                  data.receita
                )}
              </strong>

              <small>
                receitas registradas
              </small>

            </div>


            <div className="metric-card">

              <span className="label">
                Lucro estimado
              </span>

              <strong>
                {formatCurrency(
                  data.lucro
                )}
              </strong>

              <small>
                receita - despesas
              </small>

            </div>


            <div className="metric-card">

              <span className="label">
                Custo por litro
              </span>

              <strong>

                {data.producaoTotal > 0

                  ? formatCurrency(
                      data.despesasTotais /
                        data.producaoTotal
                    )

                  : 'R$ 0,00'}

              </strong>

              <small>
                custo médio de produção
              </small>

            </div>

          </div>


          {/* CUSTOS */}

          <div
            className="sub-panel"
            style={{
              marginTop: 18,
            }}
          >

            <h3>
              Custos por categoria
            </h3>


            <ul className="list">

              <li>

                <span>
                  🍽️ Alimentação
                </span>

                <strong>

                  {formatCurrency(
                    data.alimentacao
                  )}

                </strong>

              </li>


              <li>

                <span>
                  👷 Mão de obra
                </span>

                <strong>

                  {formatCurrency(
                    data.maoObra
                  )}

                </strong>

              </li>


              <li>

                <span>
                  💉 Sanidade e reprodução
                </span>

                <strong>

                  {formatCurrency(
                    data.sanidadeReproducao
                  )}

                </strong>

              </li>


              <li>

                <span>
                  ⚡ Energia e combustível
                </span>

                <strong>

                  {formatCurrency(
                    data.energiaCombustivel
                  )}

                </strong>

              </li>


              <li>

                <span>
                  🔧 Manutenção e depreciação
                </span>

                <strong>

                  {formatCurrency(
                    data.manutencaoDepreciacao
                  )}

                </strong>

              </li>

            </ul>

          </div>


          {/* BOTÕES */}

          <div
            className="controls"
            style={{
              marginTop: 18,
            }}
          >

            <button
              className="btn btn-primary"
              onClick={
                gerarResumo
              }
            >

              Gerar resumo

            </button>


            <button
              className="btn btn-ghost"
              onClick={
                downloadCSV
              }
            >

              Exportar CSV

            </button>

          </div>


          {/* RESUMO */}

          {summary && (

            <div
              className="sub-panel"
              style={{
                marginTop: 18,
              }}
            >

              <h3>
                Resumo do relatório
              </h3>


              <ul className="list">

                {Object.entries(
                  summary
                ).map(
                  ([key, value]) => (

                    <li key={key}>

                      <span>
                        {key}
                      </span>

                      <strong>
                        {value}
                      </strong>

                    </li>

                  )
                )}

              </ul>

            </div>

          )}

        </>

      )}

    </Card>

  )
}