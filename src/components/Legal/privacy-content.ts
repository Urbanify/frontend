import type { LegalDocument } from '@/components/Legal/legal-page';

export const privacyPolicy: LegalDocument = {
  title: 'Política de Privacidade',
  lastUpdated: '15 de outubro de 2026',
  summary: [
    'Quem decide sobre os dados dos cidadãos é a prefeitura da sua cidade. A Urbanify trata esses dados para operar o serviço, seguindo as instruções do município.',
    'Coletamos só o necessário: nome, sobrenome, e-mail e cidade, além do que você informa em cada chamado (descrição, local e fotos).',
    'Não pedimos senha. Você entra com um código de uso único, enviado ao seu e-mail.',
    'Outros cidadãos veem o problema relatado, mas não veem quem o relatou.',
    'As fotos ficam em armazenamento privado fora do Brasil, sem os dados de localização do aparelho. Essa transferência está declarada na seção 5.',
    'Para acessar, corrigir ou excluir sua conta, escreva para dpo@urbanify.com.br.',
  ],
  sections: [
    {
      id: 'quem-somos',
      title: 'Quem somos e quem decide sobre os dados',
      blocks: [
        {
          type: 'p',
          text: 'A Urbanify é uma plataforma de zeladoria urbana. O cidadão reporta um problema da cidade com foto e local, a prefeitura verifica e resolve, e o cidadão acompanha até a confirmação. O serviço é contratado por prefeituras.',
        },
        {
          type: 'p',
          text: 'Responsável: Urbanify, inscrita no CNPJ [CNPJ em registro], com sede em [endereço da sede em registro].',
        },
        {
          type: 'p',
          text: '**A prefeitura da sua cidade é a controladora dos dados dos cidadãos** (art. 5º, VI, da Lei 13.709/2018, a LGPD). Ela decide para que os dados servem, como zeladoria, atendimento ao cidadão e gestão urbana.',
        },
        {
          type: 'p',
          text: 'A Urbanify é a **operadora** (art. 5º, VII, da LGPD). Tratamos os dados só para executar o serviço contratado pela prefeitura e seguindo as instruções dela. Esses papéis são formalizados no contrato com cada município, por meio de um Acordo de Tratamento de Dados.',
        },
        {
          type: 'p',
          text: 'Esta política explica como tratamos os seus dados ao usar a plataforma. Os termos de uso estão em [Termos de Uso](/termos).',
        },
      ],
    },
    {
      id: 'dados',
      title: 'Quais dados tratamos e por quê',
      blocks: [
        {
          type: 'p',
          text: 'Coletamos o mínimo necessário para o serviço funcionar. Não coletamos dados sensíveis (art. 5º, II, da LGPD).',
        },
        {
          type: 'table',
          head: ['Dado', 'Para que usamos', 'Base legal'],
          rows: [
            [
              'Nome, sobrenome e e-mail',
              'Identificar você na plataforma, enviar o código de acesso e avisar sobre o andamento dos seus chamados',
              'Políticas públicas (arts. 7º, III, e 23)',
            ],
            [
              'Cidade',
              'Mostrar os chamados e os serviços da sua cidade e encaminhar cada pedido à prefeitura certa',
              'Políticas públicas (arts. 7º, III, e 23)',
            ],
            [
              'CPF (opcional)',
              'Identificação única, para evitar contas falsas e duplicadas. Só existe em contas antigas que o informaram. Aparece mascarado e nunca é exibido para outros cidadãos',
              'Políticas públicas (arts. 7º, III, e 23)',
            ],
            [
              'Descrição, local e fotos do problema',
              'Registrar e resolver a demanda urbana. As fotos são enviadas sem os dados de localização do aparelho (EXIF)',
              'Políticas públicas (arts. 7º, III, e 23)',
            ],
            [
              'Comentários e histórico de ações',
              'Dar transparência e rastrear o atendimento. Cada ação em um chamado fica registrada com autor, data e hora',
              'Políticas públicas (arts. 7º, III, e 23)',
            ],
            [
              'Cookie de sessão e tema escolhido',
              'Manter você conectado e lembrar o tema claro ou escuro. Veja a seção 6',
              'Políticas públicas (arts. 7º, III, e 23)',
            ],
          ],
        },
        {
          type: 'p',
          text: 'O tratamento se apoia na execução de políticas públicas e no cumprimento das atribuições legais do município. Por isso, você não precisa dar consentimento para usar o serviço. Mesmo assim, informamos aqui, de forma clara, quais dados tratamos e para quê.',
        },
      ],
    },
    {
      id: 'quem-ve',
      title: 'Quem vê o quê',
      blocks: [
        {
          type: 'ul',
          items: [
            '**Outros cidadãos** veem o problema relatado: tipo, local, fotos e andamento. Eles **não** veem quem relatou, para proteger quem denuncia, por exemplo uma obra irregular, de retaliação.',
            '**Gestores da prefeitura** veem os dados necessários para atender a demanda. O CPF aparece mascarado, exceto para os perfis administrativos que precisam dele.',
            '**Cada prefeitura só acessa os dados da própria cidade.**',
            '**Pessoas da equipe da Urbanify** acessam dados só quando isso é necessário para operar ou dar suporte ao serviço.',
            'Toda ação em um chamado fica registrada, com autor, data e hora.',
          ],
        },
      ],
    },
    {
      id: 'fornecedores',
      title: 'Com quem compartilhamos',
      blocks: [
        {
          type: 'p',
          text: 'Não vendemos dados, não compartilhamos dados com terceiros para fins comerciais e não usamos os dados para publicidade. Usamos os fornecedores abaixo só para o serviço funcionar.',
        },
        {
          type: 'table',
          head: ['Fornecedor', 'Para que usamos', 'Onde fica'],
          rows: [
            ['Supabase', 'Banco de dados de contas, chamados e histórico', 'Brasil (região São Paulo)'],
            ['Fly.io', 'Servidor que roda a API da plataforma', 'Brasil (região São Paulo)'],
            ['Vercel', 'Hospedagem do site', 'Fora do Brasil (empresa nos EUA)'],
            ['Cloudflare R2', 'Armazenamento das fotos dos chamados, em área privada', 'Fora do Brasil'],
            ['Google', 'Mapas e busca de endereço ao registrar um chamado', 'Fora do Brasil'],
            ['Resend', 'Envio de e-mails, como o código de acesso e avisos sobre chamados', 'Fora do Brasil'],
            ['Expo', 'Notificações no aplicativo, quando estiverem ativas', 'Fora do Brasil'],
          ],
        },
        {
          type: 'p',
          text: 'Também podemos compartilhar dados quando a lei exigir, ou quando uma autoridade competente pedir por meio legal.',
        },
      ],
    },
    {
      id: 'transferencia',
      title: 'Dados fora do Brasil',
      blocks: [
        {
          type: 'p',
          text: 'Os dados principais, como contas, chamados e histórico, ficam em banco de dados no Brasil, na região de São Paulo.',
        },
        {
          type: 'p',
          text: 'Alguns fornecedores ficam fora do Brasil: o armazenamento das fotos (Cloudflare R2), a busca de endereço (Google), o envio de e-mails (Resend), a hospedagem do site (Vercel) e as notificações (Expo). Essas transferências internacionais seguem o art. 33 da LGPD e as cláusulas-padrão da ANPD.',
        },
        {
          type: 'p',
          text: 'Antes de contratar um fornecedor novo fora do país, atualizamos esta política.',
        },
      ],
    },
    {
      id: 'cookies',
      title: 'Cookies e armazenamento no navegador',
      blocks: [
        {
          type: 'p',
          text: 'Usamos só o que o site precisa para funcionar. **Não usamos cookies de análise nem de publicidade**, e a plataforma não tem anúncios.',
        },
        {
          type: 'ul',
          items: [
            '**Cookie de sessão** (urbanify_session): mantém você conectado. Ele não pode ser lido por scripts da página e expira em 8 horas.',
            '**Tema claro ou escuro:** a escolha fica guardada no próprio navegador (localStorage) e não é enviada para os nossos servidores.',
          ],
        },
        {
          type: 'p',
          text: 'Esses itens são estritamente necessários. Se você bloquear o cookie de sessão, não conseguirá entrar na sua conta.',
        },
      ],
    },
    {
      id: 'retencao',
      title: 'Por quanto tempo guardamos os dados',
      blocks: [
        {
          type: 'ul',
          items: [
            '**Enquanto o contrato com a prefeitura estiver vigente**, ou pelo prazo que o município definir.',
            '**Conta excluída:** a conta é anonimizada. Os chamados continuam registrados como "Morador", porque fazem parte do histórico do serviço público.',
            '**Fim do contrato com a prefeitura:** entregamos ao município uma exportação completa dos dados da cidade, em formato aberto (CSV ou JSON). Depois, apagamos os dados da cidade em até 90 dias, salvo quando a lei exigir a guarda.',
            '**Registros de acesso** (como data, hora e endereço IP) são guardados pelo prazo previsto no art. 15 do Marco Civil da Internet (Lei 12.965/2014).',
          ],
        },
      ],
    },
    {
      id: 'seguranca',
      title: 'Segurança',
      blocks: [
        {
          type: 'p',
          text: 'Adotamos medidas técnicas e organizacionais para proteger os dados. Entre elas:',
        },
        {
          type: 'ul',
          items: [
            'login sem senha, com código de uso único e de validade curta, enviado ao seu e-mail;',
            'conexão criptografada (HTTPS) e dados criptografados no armazenamento;',
            'acesso por perfil, e cada prefeitura vê só a própria cidade;',
            'sessões com prazo de expiração;',
            'fotos em área privada, acessadas apenas por links temporários, e sem os dados de localização do aparelho;',
            'backups diários e registro das ações em cada chamado.',
          ],
        },
        {
          type: 'p',
          text: 'Nenhum sistema está totalmente livre de falhas. Se houver um incidente com risco relevante para os seus direitos, avisamos a prefeitura de imediato. Como controladora, ela comunica a ANPD e os titulares no prazo da Resolução CD/ANPD nº 15/2024.',
        },
      ],
    },
    {
      id: 'direitos',
      title: 'Seus direitos e como exercê-los',
      blocks: [
        {
          type: 'p',
          text: 'A LGPD (art. 18) garante ao titular dos dados os direitos abaixo. Você pode pedir, a qualquer momento:',
        },
        {
          type: 'ul',
          items: [
            'a confirmação de que tratamos os seus dados;',
            'acesso aos seus dados;',
            'correção de dados incompletos, inexatos ou desatualizados;',
            'anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou tratados em desacordo com a lei;',
            'portabilidade dos dados a outro fornecedor de serviço, nos termos da regulamentação da ANPD;',
            'informação sobre as entidades com as quais compartilhamos os dados;',
            'exclusão da sua conta, nos termos da seção 7.',
          ],
        },
        {
          type: 'p',
          text: '**Como pedir:** escreva para [dpo@urbanify.com.br](mailto:dpo@urbanify.com.br), com o assunto "Solicitação LGPD". Podemos pedir informações para confirmar a sua identidade antes de atender ao pedido. Respondemos dentro do prazo previsto em lei.',
        },
        {
          type: 'p',
          text: 'Quando o pedido se referir a dados que a prefeitura controla, podemos encaminhá-lo ao município, que responde como controlador. Você também pode procurar a prefeitura diretamente.',
        },
      ],
    },
    {
      id: 'criancas',
      title: 'Crianças e adolescentes',
      blocks: [
        {
          type: 'p',
          text: 'A plataforma não é voltada a crianças. O tratamento de dados de crianças e adolescentes segue o art. 14 da LGPD, com atenção ao melhor interesse do menor. Se um pai, mãe ou responsável entender que uma conta foi criada sem a sua autorização, pode pedir a exclusão pelo canal do encarregado.',
        },
      ],
    },
    {
      id: 'alteracoes',
      title: 'Alterações desta política',
      blocks: [
        {
          type: 'p',
          text: 'Podemos atualizar esta política para refletir mudanças no serviço ou na lei. Quando a mudança for relevante, avisamos pelo site e, quando for possível, por e-mail. A data no início do documento mostra a última atualização.',
        },
      ],
    },
    {
      id: 'contato',
      title: 'Contato e ANPD',
      blocks: [
        {
          type: 'p',
          text: 'Encarregado pelo tratamento de dados pessoais (DPO) da Urbanify: [nome do encarregado em registro].',
        },
        {
          type: 'ul',
          items: [
            'Dados pessoais e direitos do titular: [dpo@urbanify.com.br](mailto:dpo@urbanify.com.br)',
            'Suporte e dúvidas sobre a conta: [suporte@urbanify.com.br](mailto:suporte@urbanify.com.br)',
            'Dúvidas gerais: [contato@urbanify.com.br](mailto:contato@urbanify.com.br)',
          ],
        },
        {
          type: 'p',
          text: 'Você também pode apresentar reclamação à Autoridade Nacional de Proteção de Dados (ANPD), pelo site gov.br/anpd.',
        },
      ],
    },
  ],
};
