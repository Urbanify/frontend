import type { LegalDocument } from '@/components/Legal/legal-page';

export const termsOfUse: LegalDocument = {
  title: 'Termos de Uso',
  lastUpdated: '15 de outubro de 2026',
  summary: [
    'A Urbanify fornece a plataforma. Cada prefeitura decide e resolve os problemas da própria cidade.',
    'Para registrar chamados, entre com o código enviado ao seu e-mail. Você responde pelo que faz na sua conta.',
    'Relate apenas problemas reais. Não exponha dados pessoais de terceiros, e evite rostos e placas nas fotos.',
    'O que você envia aparece no mapa e no histórico do chamado, para a cidade e para outros moradores, sem o seu nome.',
    'Não garantimos que a prefeitura vai resolver um problema, nem os prazos de atendimento.',
    'Podemos ocultar conteúdo que descumpra estes termos. Os direitos do consumidor continuam valendo.',
  ],
  sections: [
    {
      id: 'aceite',
      title: 'Aceite destes termos',
      blocks: [
        {
          type: 'p',
          text: 'Estes Termos de Uso regulam o acesso e o uso do site e da plataforma Urbanify. Ao acessar o site, criar uma conta ou usar qualquer recurso, você concorda com estes termos e com a [Política de Privacidade](/privacidade).',
        },
        {
          type: 'p',
          text: 'Se você não concordar com algum ponto, não use a plataforma.',
        },
      ],
    },
    {
      id: 'quem-pode-usar',
      title: 'Quem pode usar',
      blocks: [
        {
          type: 'ul',
          items: [
            'Qualquer pessoa pode ver o mapa público de lugares da cidade, sem criar conta.',
            'Para registrar, acompanhar ou comentar chamados, é preciso ter uma conta.',
            'Para criar conta, você precisa ter 18 anos ou mais, ou estar com a autorização de pai, mãe ou responsável legal.',
            'O serviço funciona nas cidades cuja prefeitura contratou a Urbanify.',
          ],
        },
      ],
    },
    {
      id: 'conta',
      title: 'Conta e código de acesso',
      blocks: [
        {
          type: 'ul',
          items: [
            'O acesso é feito com um código de uso único, enviado ao seu e-mail. Não há senha.',
            'Informe dados verdadeiros e atualizados ao criar a sua conta.',
            'Mantenha o seu e-mail seguro e não compartilhe o código com ninguém.',
            'Você responde pela atividade feita na sua conta. Se perceber um uso que não reconhece, avise pelo e-mail [suporte@urbanify.com.br](mailto:suporte@urbanify.com.br).',
            'Você pode pedir a exclusão da sua conta pelo canal do encarregado, conforme a [Política de Privacidade](/privacidade).',
          ],
        },
      ],
    },
    {
      id: 'uso-aceitavel',
      title: 'Uso aceitável',
      blocks: [
        {
          type: 'p',
          text: 'Ao usar a plataforma, você se compromete a:',
        },
        {
          type: 'ul',
          items: [
            'registrar apenas problemas reais, sem criar chamados falsos nem chamados que você sabe não serem verdadeiros;',
            'não publicar dados pessoais de terceiros, como nome completo, CPF, telefone ou endereço de outras pessoas;',
            'evitar fotos com rostos de pessoas e placas de veículos sempre que possível;',
            'não publicar conteúdo ofensivo, discriminatório, ameaçador, sexual ou ilegal;',
            'não tentar acessar contas, dados ou cidades que não são suas, nem interferir no funcionamento do serviço;',
            'não usar robôs ou outros meios automáticos para criar chamados ou coletar dados.',
          ],
        },
        {
          type: 'p',
          text: 'Chamados e comentários falsos ou abusivos podem ser removidos, e a conta pode ser suspensa. Em casos graves, a Urbanify pode informar as autoridades competentes.',
        },
      ],
    },
    {
      id: 'conteudo',
      title: 'Conteúdo que você envia',
      blocks: [
        {
          type: 'p',
          text: 'Conteúdo são os chamados, descrições, fotos, comentários e demais textos ou imagens que você envia à plataforma. Você é responsável pelo que envia e declara ter o direito de compartilhá-lo.',
        },
        {
          type: 'p',
          text: 'Ao enviar um conteúdo, você autoriza a Urbanify a armazená-lo, exibi-lo e tratá-lo para operar o serviço. Isso inclui mostrá-lo no mapa e no histórico da cidade, para outros moradores e para a prefeitura. Essa autorização vale no Brasil e pelo tempo necessário para o serviço. Ela não dá à Urbanify o direito de vender o conteúdo.',
        },
        {
          type: 'p',
          text: 'Outros moradores veem o problema, mas não veem quem o relatou. Por isso, o histórico do chamado continua registrado mesmo depois de resolvido.',
        },
        {
          type: 'p',
          text: 'Antes de enviar uma foto, retire o que não precisa aparecer, como rostos e placas. As fotos são enviadas sem os dados de localização do aparelho.',
        },
      ],
    },
    {
      id: 'moderacao',
      title: 'Moderação e remoção',
      blocks: [
        {
          type: 'p',
          text: 'A equipe da Urbanify ou da prefeitura pode ocultar ou remover comentários, fotos e chamados que descumpram estes termos ou a lei, e pode suspender contas. Quando for possível, informamos o motivo.',
        },
        {
          type: 'p',
          text: 'A remoção de conteúdo de terceiros também pode ocorrer por ordem judicial, nos casos previstos no Marco Civil da Internet (Lei 12.965/2014).',
        },
        {
          type: 'p',
          text: 'Se você encontrar conteúdo que viole estes termos, avise pelo e-mail [suporte@urbanify.com.br](mailto:suporte@urbanify.com.br).',
        },
      ],
    },
    {
      id: 'prefeitura',
      title: 'Relação com a prefeitura',
      blocks: [
        {
          type: 'p',
          text: 'A Urbanify oferece a plataforma às prefeituras. Cada prefeitura é responsável pelos chamados da própria cidade: ela verifica, decide, executa e resolve os problemas, e é a controladora dos dados dos cidadãos.',
        },
        {
          type: 'p',
          text: '**A Urbanify não garante que um problema será resolvido**, nem o prazo de atendimento, nem o resultado de cada verificação. Essas decisões cabem à prefeitura.',
        },
      ],
    },
    {
      id: 'disponibilidade',
      title: 'Disponibilidade do serviço',
      blocks: [
        {
          type: 'p',
          text: 'Trabalhamos para manter a plataforma disponível e segura, mas ela pode ficar indisponível por manutenção, atualizações, falhas técnicas ou causas fora do nosso controle.',
        },
        {
          type: 'p',
          text: 'Podemos alterar, suspender ou encerrar funções da plataforma. Quando a mudança afetar você de forma relevante, avisamos com antecedência sempre que possível.',
        },
      ],
    },
    {
      id: 'responsabilidade',
      title: 'Limitação de responsabilidade',
      blocks: [
        {
          type: 'p',
          text: 'Na medida permitida pela lei, a Urbanify não responde por danos indiretos, como perda de lucros ou de dados decorrente do uso ou da impossibilidade de uso da plataforma, nem por atos de outros usuários ou da prefeitura.',
        },
        {
          type: 'p',
          text: 'Nada nestes termos afasta os direitos que o Código de Defesa do Consumidor (Lei 8.078/1990) ou outra lei garante a você. Onde a lei não permitir uma limitação, ela não se aplica.',
        },
        {
          type: 'p',
          text: 'Você responde pelos danos que causar a terceiros ou à plataforma com uso indevido dela, nos termos da lei.',
        },
      ],
    },
    {
      id: 'propriedade',
      title: 'Propriedade intelectual e dados de mapa',
      blocks: [
        {
          type: 'p',
          text: 'A plataforma, a marca, os logotipos, os textos e o código pertencem à Urbanify. Você não pode copiá-los, alterá-los ou usá-los sem autorização, exceto para usar o serviço como previsto nestes termos.',
        },
        {
          type: 'p',
          text: 'Parte dos dados de lugares do mapa vem do OpenStreetMap, sob a licença Open Database License (ODbL). Essa licença se aplica a esses dados.',
        },
        {
          type: 'p',
          text: 'Serviços de terceiros, como a busca de endereço do Google, têm termos próprios, que também se aplicam ao seu uso.',
        },
      ],
    },
    {
      id: 'encerramento',
      title: 'Encerramento',
      blocks: [
        {
          type: 'p',
          text: 'Você pode deixar de usar a plataforma a qualquer momento e pedir a exclusão da sua conta, conforme a [Política de Privacidade](/privacidade).',
        },
        {
          type: 'p',
          text: 'Podemos suspender ou encerrar a sua conta se você descumprir estes termos. Quando for possível, avisamos antes e informamos o motivo.',
        },
        {
          type: 'p',
          text: 'Se o contrato com a prefeitura da sua cidade terminar, o serviço naquela cidade pode ser encerrado. Nesse caso, os dados seguem o que diz a Política de Privacidade.',
        },
      ],
    },
    {
      id: 'alteracoes',
      title: 'Alterações destes termos',
      blocks: [
        {
          type: 'p',
          text: 'Podemos atualizar estes termos. Quando a mudança for relevante, avisamos pelo site e, quando for possível, por e-mail, com antecedência razoável. A data no início do documento mostra a última atualização.',
        },
        {
          type: 'p',
          text: 'Se você não concordar com as mudanças, pode deixar de usar a plataforma e pedir a exclusão da sua conta.',
        },
      ],
    },
    {
      id: 'lei-e-foro',
      title: 'Lei aplicável e foro',
      blocks: [
        {
          type: 'p',
          text: 'Estes termos são regidos pelas leis da República Federativa do Brasil.',
        },
        {
          type: 'p',
          text: 'Nas questões que envolvam consumidor, fica eleito o foro do domicílio dele, conforme o Código de Defesa do Consumidor. Nos demais casos, fica eleito o foro da comarca de [cidade e estado do foro em registro].',
        },
        {
          type: 'p',
          text: 'Se alguma cláusula destes termos não puder ser aplicada, as demais continuam valendo.',
        },
      ],
    },
    {
      id: 'contato',
      title: 'Contato',
      blocks: [
        {
          type: 'ul',
          items: [
            'Dúvidas sobre estes termos e suporte: [suporte@urbanify.com.br](mailto:suporte@urbanify.com.br)',
            'Dados pessoais: [dpo@urbanify.com.br](mailto:dpo@urbanify.com.br)',
            'Empresa: Urbanify, inscrita no CNPJ [CNPJ em registro], com sede em [endereço da sede em registro].',
          ],
        },
      ],
    },
  ],
};
