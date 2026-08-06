var i18n = require('../../utils/i18n')

var privacyContent = {
  zh: {
    title: '《洛手助手》隐私保护指引',
    updateDate: '更新日期：2026年8月5日',
    effectiveDate: '生效日期：2026年8月5日',
    sections: [
      {
        title: '一、 我们收集的信息',
        items: [
          { highlight: '账户信息', suffix: '：经您主动授权后，获取微信昵称、头像，用于战报水印及社区身份展示。未授权不影响工具核心功能。' },
          { highlight: '游戏辅助数据', suffix: '：捕宠记录（精灵名称、使用的咕噜球种类及数量、成功/失败状态）、洛克贝资产变动、咕噜球库存、保底进度等，均属于您主动输入的非个人敏感操作数据。' },
          { highlight: '设备存储', suffix: '：上述数据优先存储于您设备的本地缓存中，确保离线可用与极速响应。仅在您使用云端同步功能时，数据经加密后上传至微信云开发（CloudBase）。' }
        ]
      },
      {
        title: '二、 信息的存储与保护',
        items: [
          { highlight: '本地优先', suffix: '：偏好设置、捕宠日志、库存记录等核心数据默认仅保留在您的设备上。您随时可通过"清除数据"彻底销毁本地信息。' },
          { highlight: '云端加密', suffix: '：当您启用跨设备同步时，数据经由微信官方云开发安全链路加密传输并存储，与您微信账户绑定，他人无法访问。' },
          { highlight: '安全机制', suffix: '：依托微信平台的高级别安全防护体系，所有云端数据传输均经过加密处理，防止未授权访问、篡改或泄露。' }
        ]
      },
      {
        title: '三、 信息共享与披露',
        items: [
          { highlight: '绝不向任何第三方（包括广告平台、数据分析公司等）共享、出售或转让您的个人信息与游戏数据', suffix: '。' },
          { text: '2. 本小程序不集成任何第三方商业SDK、行为追踪脚本或广告投放插件。' },
          { text: '3. 仅在如下法定情形下，我们可能依法提供相关信息：司法机关依法查询；您自行公开分享；法律法规规定的其他情形。' }
        ]
      },
      {
        title: '四、 您的权利与控制',
        items: [
          { highlight: '随时注销', suffix: '：在"我的"页面点击"注销账号"，系统将立即且不可逆地清除您的所有云端档案与授权绑定。' },
          { highlight: '撤回授权', suffix: '：通过微信客户端「我 → 设置 → 个人信息与权限 → 授权管理」中随时关闭对本程序的任何授权。' },
          { highlight: '数据删除', suffix: '：使用捕宠页面中的"重置数据"、"清空记录"功能，可立即删除对应模块的本地及云端记录。' }
        ]
      },
      {
        title: '五、 未成年人保护',
        items: [
          { text: '1. 本工具不包含任何付费项目或诱导消费内容，适合全年龄段玩家使用。' },
          { text: '2. 如您是未成年人，请在监护人指导下使用本工具。若监护人发现我们无意间收集了未成年人的个人信息，请联系开发者进行删除处理。' }
        ]
      },
      {
        title: '六、 隐私政策更新',
        items: [
          { text: '我们可能适时修订本隐私政策。当政策内容发生重大变更时，我们将在小程序启动时通过弹窗提示您。若您在更新后继续使用本服务，即视为您同意更新后的政策。' }
        ]
      },
      {
        title: '七、 联系我们',
        items: [
          { text: '如您对本隐私政策有任何疑问、意见或建议，可通过以下方式联系开发者：' },
          { text: '• 在小程序"关于"页面提交反馈' },
          { text: '• 邮箱：rookiehelper@outlook.com' }
        ]
      }
    ]
  },
  en: {
    title: '「Ben\'s Roco Helper」Privacy Policy',
    updateDate: 'Last updated: August 5, 2026',
    effectiveDate: 'Effective date: August 5, 2026',
    sections: [
      {
        title: '1. Information We Collect',
        items: [
          { highlight: 'Account Information', suffix: ': With your active authorization, we collect your WeChat nickname and avatar for watermarking battle reports and community identity display. Core features remain available without authorization.' },
          { highlight: 'Game-Related Data', suffix: ': Catch records (pet name, ball type/quantity, success/failure status), Rococo Coin balance changes, ball inventory, pity tracker progress, etc. All are non-personal, non-sensitive operational data you actively input.' },
          { highlight: 'Device Storage', suffix: ': The above data is stored locally on your device by default for offline access and fast response. Only when you enable cloud sync is data encrypted and uploaded to WeChat CloudBase.' }
        ]
      },
      {
        title: '2. Data Storage & Protection',
        items: [
          { highlight: 'Local-First', suffix: ': Preferences, catch logs, inventory records, and other core data are kept exclusively on your device by default. You can permanently destroy all local data via the "Clear Data" option at any time.' },
          { highlight: 'Cloud Encryption', suffix: ': When cross-device sync is enabled, data is transmitted and stored via WeChat CloudBase encrypted channels, bound to your WeChat account and inaccessible to others.' },
          { highlight: 'Security Framework', suffix: ': Leveraging the WeChat platform enterprise-grade security infrastructure, all cloud data transmission is encrypted to prevent unauthorized access, tampering, or leaks.' }
        ]
      },
      {
        title: '3. Information Sharing & Disclosure',
        items: [
          { highlight: 'We will never share, sell, or transfer your personal information or game data to any third party', suffix: ' (including ad platforms, analytics companies, etc.).' },
          { text: '2. This mini program does not integrate any third-party commercial SDKs, behavioral tracking scripts, or ad plugins.' },
          { text: '3. We may only lawfully provide relevant information in the following statutory circumstances: judicial inquiry; you publicly share it yourself; other circumstances provided by laws and regulations.' }
        ]
      },
      {
        title: '4. Your Rights & Controls',
        items: [
          { highlight: 'Account Deletion', suffix: ': Use the "Delete Account" option on the "Mine" page to immediately and irreversibly erase all your cloud archives and authorization bindings.' },
          { highlight: 'Withdraw Authorization', suffix: ': You can revoke any authorization to this program at any time via WeChat: Me → Settings → Personal Info & Permissions → Authorization Management.' },
          { highlight: 'Data Erasure', suffix: ': Use "Reset Data" or "Clear Records" in the Catch page to immediately delete the corresponding module records both locally and in the cloud.' }
        ]
      },
      {
        title: '5. Protection of Minors',
        items: [
          { text: '1. This tool contains no paid features or induced spending content, suitable for players of all ages.' },
          { text: '2. If you are a minor, please use this tool under guardian supervision. If a guardian discovers we have inadvertently collected a minor personal information, please contact the developer for deletion.' }
        ]
      },
      {
        title: '6. Policy Updates',
        items: [
          { text: 'We may revise this privacy policy from time to time. When significant changes occur, we will notify you via an in-app popup. Continued use after an update constitutes acceptance of the revised policy.' }
        ]
      },
      {
        title: '7. Contact Us',
        items: [
          { text: 'If you have any questions, comments, or suggestions regarding this privacy policy, please contact the developer through:' },
          { text: '• Submit feedback on the "About" page in the app' },
          { text: '• Email: rookiehelper@outlook.com' }
        ]
      }
    ]
  },
  ja: {
    title: '「Ben\'s Roco Helper」プライバシーポリシー',
    updateDate: '更新日：2026年8月5日',
    effectiveDate: '発効日：2026年8月5日',
    sections: [
      {
        title: '1. 収集する情報',
        items: [
          { highlight: 'アカウント情報', suffix: '：お客様の明示的な許可に基づき、WeChatのニックネームとアバターを取得し、戦績レポートの透かしやコミュニティでの本人確認に使用します。許可がなくてもコア機能はご利用いただけます。' },
          { highlight: 'ゲーム関連データ', suffix: '：捕獲記録（ペット名、使用したボールの種類と数、成功/失敗の状態）、ロコココイン残高の変動、ボール在庫、天井進行状況など。これらはすべてお客様が自発的に入力する、個人を特定しない非機密の操作データです。' },
          { highlight: '端末ストレージ', suffix: '：上記のデータは、デフォルトでオフラインアクセスと高速応答のために端末のローカルストレージに保存されます。クラウド同期を有効にした場合のみ、データは暗号化されてWeChat CloudBaseにアップロードされます。' }
        ]
      },
      {
        title: '2. データの保存と保護',
        items: [
          { highlight: 'ローカル優先', suffix: '：設定、捕獲ログ、在庫記録などの中核データは、デフォルトでお客様の端末にのみ保持されます。「データ消去」オプションでいつでもローカルデータを完全に破棄できます。' },
          { highlight: 'クラウド暗号化', suffix: '：デバイス間同期を有効にすると、データはWeChat CloudBaseの暗号化チャネルを通じて送信・保存され、お客様のWeChatアカウントに紐付けられ、他者からアクセスされることはありません。' },
          { highlight: 'セキュリティフレームワーク', suffix: '：WeChatプラットフォームのエンタープライズグレードのセキュリティインフラを活用し、すべてのクラウドデータ送信は暗号化され、不正アクセス、改ざん、漏洩を防止します。' }
        ]
      },
      {
        title: '3. 情報の共有と開示',
        items: [
          { highlight: '当方は、お客様の個人情報やゲームデータをいかなる第三者とも共有、販売、譲渡することは一切ありません', suffix: '（広告プラットフォームや分析会社などを含む）。' },
          { text: '2. 本ミニプログラムは、いかなる第三者製の商用SDK、行動追跡スクリプト、広告プラグインも統合していません。' },
          { text: '3. 以下の法定状況においてのみ、関連情報を合法的に提供する場合があります：司法機関からの照会、お客様ご自身による公開共有、法令で定められたその他の状況。' }
        ]
      },
      {
        title: '4. お客様の権利と管理',
        items: [
          { highlight: 'アカウント削除', suffix: '：「マイページ」の「アカウント削除」オプションを使用すると、すべてのクラウドアーカイブと認証情報が即時かつ不可逆的に消去されます。' },
          { highlight: '認証の撤回', suffix: '：WeChat「設定 → 個人情報と権限 → 認証管理」から、本プログラムへの認証をいつでも取り消すことができます。' },
          { highlight: 'データ消去', suffix: '：捕獲ページの「データリセット」または「記録クリア」を使用すると、対応するモジュールの記録をローカルおよびクラウドから即時に削除できます。' }
        ]
      },
      {
        title: '5. 未成年者の保護',
        items: [
          { text: '1. 本ツールには有料機能や誘導課金コンテンツは一切含まれておらず、全年齢のプレイヤーに適しています。' },
          { text: '2. 未成年の方は、保護者の監督のもとで本ツールをご利用ください。保護者が未成年の個人情報が意図せず収集されたことを発見した場合は、開発者まで削除をご依頼ください。' }
        ]
      },
      {
        title: '6. ポリシーの更新',
        items: [
          { text: '当方は、本プライバシーポリシーを随時改訂する場合があります。重大な変更がある場合、アプリ内のポップアップでお知らせします。更新後も本サービスを継続して利用されることで、改訂後のポリシーに同意したものとみなされます。' }
        ]
      },
      {
        title: '7. お問い合わせ',
        items: [
          { text: '本プライバシーポリシーに関するご質問やご意見がございましたら、以下の方法で開発者までご連絡ください：' },
          { text: '• アプリ内の「について」ページからフィードバックを送信' },
          { text: '• メール：rookiehelper@outlook.com' }
        ]
      }
    ]
  },
  ko: {
    title: '「Ben\'s Roco Helper」개인정보처리방침',
    updateDate: '최종 업데이트: 2026년 8월 5일',
    effectiveDate: '시행일: 2026년 8월 5일',
    sections: [
      {
        title: '1. 수집하는 정보',
        items: [
          { highlight: '계정 정보', suffix: ': 귀하의 명시적 동의 하에 WeChat 닉네임과 아바타를 수집하여 전투 보고서 워터마크 및 커뮤니티 신원 표시에 사용합니다. 미동의 시에도 핵심 기능은 이용 가능합니다.' },
          { highlight: '게임 관련 데이터', suffix: ': 포획 기록(펫 이름, 사용한 볼 종류 및 수량, 성공/실패 상태), 로코코 코인 잔액 변동, 볼 인벤토리, 천장 진행 상황 등. 이는 모두 귀하가 직접 입력하는 비개인적, 비민감 운영 데이터입니다.' },
          { highlight: '기기 저장소', suffix: ': 위 데이터는 기본적으로 오프라인 접근과 빠른 응답을 위해 기기의 로컬 저장소에 저장됩니다. 클라우드 동기화를 활성화한 경우에만 데이터가 암호화되어 WeChat CloudBase에 업로드됩니다.' }
        ]
      },
      {
        title: '2. 데이터 저장 및 보호',
        items: [
          { highlight: '로컬 우선', suffix: ': 환경설정, 포획 로그, 인벤토리 기록 등 핵심 데이터는 기본적으로 귀하의 기기에만 보관됩니다. "데이터 삭제" 옵션을 통해 언제든지 로컬 데이터를 완전히 폐기할 수 있습니다.' },
          { highlight: '클라우드 암호화', suffix: ': 기기 간 동기화를 활성화하면 데이터는 WeChat CloudBase 암호화 채널을 통해 전송 및 저장되며, 귀하의 WeChat 계정에 연결되어 타인이 접근할 수 없습니다.' },
          { highlight: '보안 프레임워크', suffix: ': WeChat 플랫폼의 엔터프라이즈급 보안 인프라를 활용하여 모든 클라우드 데이터 전송이 암호화되어 무단 접근, 변조, 유출을 방지합니다.' }
        ]
      },
      {
        title: '3. 정보 공유 및 공개',
        items: [
          { highlight: '당사는 귀하의 개인정보나 게임 데이터를 어떠한 제3자와도 공유, 판매, 양도하지 않습니다', suffix: ' (광고 플랫폼, 분석 회사 등 포함).' },
          { text: '2. 본 미니프로그램은 어떠한 제3자 상용 SDK, 행동 추적 스크립트, 광고 플러그인도 통합하지 않았습니다.' },
          { text: '3. 다음 법정 상황에서만 관련 정보를 합법적으로 제공할 수 있습니다: 사법 기관의 조회, 귀하의 직접적인 공개 공유, 법령에서 정한 기타 상황.' }
        ]
      },
      {
        title: '4. 귀하의 권리 및 통제',
        items: [
          { highlight: '계정 삭제', suffix: ': "마이" 페이지의 "계정 삭제" 옵션을 사용하면 모든 클라우드 아카이브와 인증 바인딩이 즉시 되돌릴 수 없게 삭제됩니다.' },
          { highlight: '인증 철회', suffix: ': WeChat "설정 → 개인정보 및 권한 → 인증 관리"에서 언제든지 본 프로그램에 대한 모든 인증을 철회할 수 있습니다.' },
          { highlight: '데이터 삭제', suffix: ': 포획 페이지의 "데이터 재설정" 또는 "기록 삭제"를 사용하면 해당 모듈의 기록을 로컬 및 클라우드에서 즉시 삭제할 수 있습니다.' }
        ]
      },
      {
        title: '5. 미성년자 보호',
        items: [
          { text: '1. 본 도구에는 유료 기능이나 유도 과금 콘텐츠가 포함되어 있지 않으며, 모든 연령대의 플레이어에게 적합합니다.' },
          { text: '2. 미성년자의 경우 보호자의 감독 하에 본 도구를 이용해 주십시오. 보호자가 미성년자의 개인정보가 의도치 않게 수집된 것을 발견한 경우, 개발자에게 연락하여 삭제를 요청해 주십시오.' }
        ]
      },
      {
        title: '6. 정책 업데이트',
        items: [
          { text: '당사는 본 개인정보처리방침을 수시로 개정할 수 있습니다. 중대한 변경 사항이 있을 경우, 앱 내 팝업을 통해 알려드립니다. 업데이트 후에도 본 서비스를 계속 이용하면 개정된 정책에 동의한 것으로 간주됩니다.' }
        ]
      },
      {
        title: '7. 문의하기',
        items: [
          { text: '본 개인정보처리방침에 관한 질문이나 의견이 있으시면 다음 방법으로 개발자에게 연락해 주십시오:' },
          { text: '• 앱 내 "정보" 페이지에서 피드백 제출' },
          { text: '• 이메일: rookiehelper@outlook.com' }
        ]
      }
    ]
  }
}

var agreementContent = {
  zh: {
    title: '《洛手助手》用户服务协议',
    updateDate: '更新日期：2026年8月5日',
    sections: [
      {
        title: '一、 服务条款与性质',
        items: [
          { highlight: '非官方辅助工具', suffix: '。与《洛克王国》官方运营方无任何商业关联。' },
          { text: '2. 我们为您提供游戏资料查询、图鉴阅览、捕宠记录、资产统计等辅助功能，致力于提升您的游戏体验。' }
        ]
      },
      {
        title: '二、 用户行为规范',
        items: [
          { text: '1. 您应当保证在使用本服务时遵守国家法律法规及微信平台规范，不得利用本工具的自定义功能（如备注、命名）传播违规内容。' },
          { text: '2. 您不得利用任何技术手段（如抓包、反编译）对小程序的云端接口进行恶意攻击或高频刷量，违者将永久封禁服务。' }
        ]
      },
      {
        title: '三、 免责声明（重要）',
        items: [
          { highlight: '数据仅供参考', suffix: '：工具内所有的精灵属性、技能数据、评级算法均源于社区整理，并非官方绝对标准。如遇版本更新存在滞后，敬请谅解。' },
          { highlight: '玄学与概率', suffix: '：本工具提供的"欧皇评级"、"保底进度"仅作为游戏过程中的娱乐与统计参考，无法直接影响或干预游戏内的真实捕宠概率，对此我们不承担任何"未捕捉成功"的责任。' }
        ]
      },
      {
        title: '四、 知识产权声明',
        items: [
          { text: '1. 小程序内所使用的《洛克王国》相关素材（精灵图、道具图等）的著作权及知识产权，均归腾讯公司及原版权方所有。' },
          { text: '2. 小程序特有的界面UI设计、交互排版、代码架构以及原创评级文案等，均属于开发者原创知识产权，未经授权严禁像素级抄袭及商用。' }
        ]
      }
    ]
  },
  en: {
    title: '「Ben\'s Roco Helper」Terms of Service',
    updateDate: 'Last updated: August 5, 2026',
    sections: [
      {
        title: '1. Service Nature & Terms',
        items: [
          { prefix: '1. This mini program is a completely free, player-built ', highlight: 'unofficial auxiliary tool', suffix: '. It has no commercial affiliation with the official Roco Kingdom operators.' },
          { text: '2. We provide game data lookup, handbook browsing, catch logging, asset tracking, and other auxiliary features to enhance your gameplay experience.' }
        ]
      },
      {
        title: '2. User Conduct',
        items: [
          { text: '1. You shall comply with national laws and regulations and WeChat platform guidelines when using this service. Do not use custom features (e.g., notes, naming) to disseminate prohibited content.' },
          { text: '2. You shall not use any technical means (e.g., packet capture, decompilation) to maliciously attack or spam the mini program cloud interfaces. Violators will be permanently banned.' }
        ]
      },
      {
        title: '3. Disclaimer (Important)',
        items: [
          { highlight: 'Data is for reference only', suffix: ': All pet attributes, skill data, and rating algorithms in this tool are community-curated and do not represent official absolute standards. Please understand if updates lag behind game patches.' },
          { highlight: 'Probability & Luck', suffix: ': The "Luck Rating" and "Pity Tracker" features are provided solely as entertainment and statistical reference during gameplay. They cannot directly influence or interfere with actual in-game catch probabilities, and we assume no liability for failed captures.' }
        ]
      },
      {
        title: '4. Intellectual Property',
        items: [
          { text: '1. Roco Kingdom-related materials (pet illustrations, item images, etc.) used in this mini program remain the copyright and intellectual property of Tencent and the original rights holders.' },
          { text: '2. The unique UI design, interaction layout, code architecture, and original rating copy of this mini program are the developer original intellectual property. Unauthorized pixel-level copying and commercial use are strictly prohibited.' }
        ]
      }
    ]
  },
  ja: {
    title: '「Ben\'s Roco Helper」利用規約',
    updateDate: '更新日：2026年8月5日',
    sections: [
      {
        title: '1. サービスの性質と利用条件',
        items: [
          { prefix: '1. 本ミニプログラムは完全無料の、プレイヤーが開発した', highlight: '非公式の補助ツール', suffix: 'です。ロコ王国の公式運営とは一切の商業的関係がありません。' },
          { text: '2. 当方は、ゲームデータ検索、図鑑閲覧、捕獲記録、資産管理などの補助機能を提供し、お客様のゲーム体験の向上を目指します。' }
        ]
      },
      {
        title: '2. ユーザー行動規範',
        items: [
          { text: '1. 本サービスをご利用の際は、国の法令およびWeChatプラットフォームのガイドラインを遵守してください。カスタム機能（メモ、命名など）を使用して禁止コンテンツを拡散しないでください。' },
          { text: '2. 技術的手段（パケットキャプチャ、逆コンパイルなど）を用いてミニプログラムのクラウドインターフェースを悪意を持って攻撃したり、高頻度でアクセスしたりする行為は禁止されており、違反者は永久にサービスを停止されます。' }
        ]
      },
      {
        title: '3. 免責事項（重要）',
        items: [
          { highlight: 'データは参考情報です', suffix: '：本ツール内のすべてのペット属性、スキルデータ、レーティングアルゴリズムはコミュニティで整理されたものであり、公式の絶対的な基準ではありません。ゲームのアップデートにより情報が遅れる場合がありますので、ご了承ください。' },
          { highlight: '確率と運', suffix: '：本ツールが提供する「ラックレーティング」「天井トラッカー」機能は、ゲームプレイ中の娯楽および統計的な参考としてのみ提供されます。これらはゲーム内の実際の捕獲確率に直接影響を与えたり干渉したりすることはできず、捕獲の失敗について当方は一切の責任を負いません。' }
        ]
      },
      {
        title: '4. 知的財産権',
        items: [
          { text: '1. 本ミニプログラムで使用されているロコ王国関連の素材（ペットイラスト、アイテム画像など）の著作権および知的財産権は、Tencent社および原著作者に帰属します。' },
          { text: '2. 本ミニプログラム独自のUIデザイン、インタラクション構成、コードアーキテクチャ、およびオリジナルのレーティング文案は、開発者のオリジナル知的財産です。無断でのピクセル単位のコピーや商用利用は固く禁じられています。' }
        ]
      }
    ]
  },
  ko: {
    title: '「Ben\'s Roco Helper」이용약관',
    updateDate: '최종 업데이트: 2026년 8월 5일',
    sections: [
      {
        title: '1. 서비스 성격 및 약관',
        items: [
          { prefix: '1. 본 미니프로그램은 완전 무료의 플레이어가 개발한', highlight: '비공식 보조 도구', suffix: '입니다. 로코왕국 공식 운영사와는 어떠한 상업적 관계도 없습니다.' },
          { text: '2. 당사는 게임 데이터 조회, 도감 열람, 포획 기록, 자산 추적 등의 보조 기능을 제공하여 귀하의 게임 경험을 향상시키고자 합니다.' }
        ]
      },
      {
        title: '2. 이용자 행동 규정',
        items: [
          { text: '1. 본 서비스 이용 시 국가 법규 및 WeChat 플랫폼 가이드라인을 준수해야 합니다. 커스텀 기능(메모, 이름 지정 등)을 사용하여 금지된 콘텐츠를 유포하지 마십시오.' },
          { text: '2. 패킷 캡처, 역컴파일 등 기술적 수단을 이용하여 미니프로그램의 클라우드 인터페이스를 악의적으로 공격하거나 고빈도로 접근하는 행위는 금지되며, 위반 시 영구적으로 서비스가 차단됩니다.' }
        ]
      },
      {
        title: '3. 면책 조항 (중요)',
        items: [
          { highlight: '데이터는 참고용입니다', suffix: ': 본 도구 내의 모든 펫 속성, 스킬 데이터, 등급 알고리즘은 커뮤니티에서 정리된 것으로, 공식적인 절대 기준이 아닙니다. 게임 업데이트로 인해 정보가 지연될 수 있음을 양해 부탁드립니다.' },
          { highlight: '확률과 운', suffix: ': 본 도구가 제공하는 "행운 등급", "천장 추적기" 기능은 게임플레이 중 오락 및 통계적 참고용으로만 제공됩니다. 이는 게임 내 실제 포획 확률에 직접적인 영향을 미치거나 간섭할 수 없으며, 포획 실패에 대해 당사는 어떠한 책임도 지지 않습니다.' }
        ]
      },
      {
        title: '4. 지식 재산권',
        items: [
          { text: '1. 본 미니프로그램에서 사용되는 로코왕국 관련 자료(펫 일러스트, 아이템 이미지 등)의 저작권 및 지식재산권은 Tencent 및 원저작권자에게 귀속됩니다.' },
          { text: '2. 본 미니프로그램 고유의 UI 디자인, 인터랙션 구성, 코드 아키텍처 및 오리지널 평가 문구는 개발자의 독창적 지식재산입니다. 무단 픽셀 단위 복제 및 상업적 이용을 엄격히 금지합니다.' }
        ]
      }
    ]
  }
}

function buildContent(contentObj, lang) {
  var data = contentObj[lang] || contentObj.zh
  return {
    title: data.title,
    updateDate: data.updateDate,
    effectiveDate: data.effectiveDate,
    sections: data.sections
  }
}

Page({
  data: {
    type: 'privacy',
    pageTitle: '隐私保护指引',
    headerTitle: '',
    updateDate: '',
    effectiveDate: '',
    sections: [],
    icp: '浙ICP备2026043884号'
  },
  onLoad: function(options) {
    this.type = options.type || 'privacy'
    this._langVersion = -1
    this.rebuildContent()
  },
  onShow: function() {
    var app = getApp()
    var lang = i18n.getLanguage()
    if (lang !== this._lastLang || app.globalData.langVersion !== this._langVersion) {
      this.rebuildContent()
    }
  },
  rebuildContent: function() {
    var lang = i18n.getLanguage()
    var app = getApp()
    this._langVersion = app.globalData.langVersion
    this._lastLang = lang
    var content = this.type === 'agreement' ? agreementContent : privacyContent
    var built = buildContent(content, lang)
    var pageTitles = {
      agreement: { zh: '用户协议', en: 'Terms of Service', ja: '利用規約', ko: '이용약관' },
      privacy: { zh: '隐私保护指引', en: 'Privacy Policy', ja: 'プライバシーポリシー', ko: '개인정보처리방침' }
    }
    var pageTitle = (pageTitles[this.type] || pageTitles.privacy)[lang] || (pageTitles[this.type] || pageTitles.privacy).zh
    this.setData({
      type: this.type,
      pageTitle: pageTitle,
      headerTitle: built.title,
      updateDate: built.updateDate,
      effectiveDate: built.effectiveDate,
      sections: built.sections
    })
    wx.setNavigationBarTitle({ title: pageTitle })
  },
  onShareAppMessage: function() {
    return { 
      title: '洛手助手 - ' + this.data.pageTitle, 
      path: '/pages/privacy/privacy?type=' + this.data.type 
    }
  },
  onShareTimeline: function() {
    return { title: '洛手助手：' + this.data.pageTitle }
  }
})
