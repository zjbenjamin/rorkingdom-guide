var app = getApp()
var notify = require('../../utils/notify')
var templateConfig = require('../../config/notifyTemplates')
var levelUtil = require('../../utils/level')
var i18n = require('../../utils/i18n')
var db = null
var _cachedOpenId = wx.getStorageSync('openid') || null
var _openIdCallbacks = []

function getOpenId(cb) {
  if (_cachedOpenId) { cb(_cachedOpenId); return }
  _openIdCallbacks.push(cb)
  if (_openIdCallbacks.length > 1) return
  wx.cloud.callFunction({ name: 'login' }).then(function(res) {
    var id = res.result.openid
    _cachedOpenId = id
    wx.setStorageSync('openid', id)
    var cbs = _openIdCallbacks
    _openIdCallbacks = []
    for (var i = 0; i < cbs.length; i++) cbs[i](id)
  }).catch(function() {
    var cbs = _openIdCallbacks
    _openIdCallbacks = []
    for (var i = 0; i < cbs.length; i++) cbs[i](null)
  })
}

function getLoginLabels(lang) {
  var L = {}
  if (lang === 'en') {
    L = {
      appName: 'Roco Helper',
      appDesc: 'Comprehensive Guide · Pet Handbook · Item Handbook',
      tapChangeAvatar: 'Tap to change avatar',
      tapSelectAvatar: 'Tap to select avatar',
      nickname: 'Nickname',
      nicknamePlaceholder: 'Enter nickname or use WeChat quick fill',
      nicknameHint: '💡 Use WeChat nickname from keyboard bar',
      loginBtn: 'Login',
      agreeText: 'I have read and agree to the',
      agreeAnd: 'and',
      agreement: 'Terms of Service',
      privacy: 'Privacy Policy',
      rocoUID: 'Roco Kingdom UID',
      tapSetUID: 'Tap to set UID',
      level: 'Level',
      loginDays: 'Login Days',
      checkIn: 'Check-in',
      loginExpire: 'Login expires in: ',
      daysUnit: 'd',
      expireHoursUnit: 'h',
      needMoreDays: ', {n} more days to level up',
      needMoreCatches: 'Catches to next: {n}',
      editor: 'Editor',
      developer: 'Developer',
      notifyTitle: 'Notification Settings',
      notifyTapHint: 'Tap + to increase pushes, max 99',
      notifyAnnounce: 'Announcements',
      notifyAnnounceDesc: 'Receive latest announcements and updates',
      notifyActivity: 'Activity Alerts',
      notifyActivityDesc: 'Reminders before events start',
      notifyMerchant: 'Merchant Alerts',
      notifyMerchantDesc: 'New merchant item notifications',
      reset: 'Reset',
      notifyNa: 'Unavailable',
      notifySettingTip: 'Tap to open system notification settings',
      adminPanel: 'Admin Panel',
      deleteAccount: 'Delete Account',
      logout: 'Logout',
      feat1Title: 'Pet Handbook',
      feat1Desc: 'Complete pet database',
      feat2Title: 'Catch Stats',
      feat2Desc: 'Track your catches',
      feat3Title: 'Event Calendar',
      feat3Desc: 'Never miss an event',
      noticeTitle: '📋 User Notice',
      notice1: '• Free core: Guide and query features are free, no login required.',
      notice2: '• Member perks: Unlock luck rating, achievements sync, exclusive watermarks after login.',
      notice3: '• Privacy first: Core data stored locally, cloud double-encrypted. Never leaked.',
      notice4: '• Auth period: Login valid up to 365 days. You can manually log out anytime.',
      notice5: '• Self control: You can delete your account and wipe all cloud backups at any time.',
      setUIDTitle: 'Set Roco Kingdom UID',
      uidPlaceholder: 'Enter your UID (numbers only)',
      uidHint: 'Your UID will show as watermark on shared images',
      cancel: 'Cancel',
      save: 'Save',
      privacyModalTitle: 'Privacy Protection Notice',
      privacyModalDesc1: 'Before using login and cloud sync, please read and agree to',
      privacyModalDesc2: '. We value your privacy and data security.',
      reject: 'Decline',
      agreeContinue: 'Agree & Continue',
      langLabel: 'Lang',
      dlgSyncTitle: 'Data Sync',
      dlgSyncBody: 'For a better experience, the following data will be synced to cloud after login:\n\n- Avatar & Nickname — Identity for comments\n- Total Login Days — Level calculation\n- User Preferences — Multi-device sync\n\nData is used solely for app functionality and will not be shared with third parties.',
      dlgSyncOk: 'Got it',
      dlgLogoutTitle: 'Logout',
      dlgLogoutBody: 'Are you sure you want to logout?',
      dlgDeleteTitle: 'Delete Account',
      dlgDeleteBody: 'This will permanently delete your cloud avatar, nickname, level, and all settings data. This operation cannot be undone. Confirm deletion?',
      dlgNotifyOffTitle: 'Notifications Disabled',
      dlgNotifyOffBody: 'You have disabled this type of notification. Please enable it manually in mini program settings.',
      dlgNotifyOffBtn: 'Settings',
      dlgResetTitle: 'Reset Subscription',
      dlgResetBodyPre: 'Confirm reset of "',
      dlgResetBodyPost: '" subscription? Re-authorization required after reset.',
      toastLoginExpired: 'Login expired, please login again',
      toastUidWrong: 'UID must be numbers only',
      toastUidSaved: 'UID saved',
      toastUidCleared: 'UID cleared',
      toastPrivacyReject: 'Rejecting the privacy policy will prevent login authorization',
      toastAgreeFirst: '"Please agree to the Terms of Service and Privacy Policy first',
      toastAvatarFirst: 'Please tap to select a WeChat avatar',
      toastNicknameFirst: 'Please enter a nickname',
      toastLoggedOut: 'Logged out',
      toastDeleting: 'Deleting...',
      toastLocalDeleted: 'Local data deleted',
      toastAccountDeleted: 'Account deleted',
      toastDeleteFailed: 'Delete failed, please try again',
      toastNetworkError: 'Network error, please try again',
      toastLoginFirst: 'Please login first',
      toastLoginFirstSetup: 'Please login first before configuring',
      toastSetupFailed: 'Setup failed, please try again',
      toastEnabled: 'Enabled',
      toastRejected: 'Rejected',
      toastResetDone: 'Reset',
      toastReauthorized: 'Re-authorized',
      toastResetFailed: 'Reset failed',
      toastLimit99: 'Maximum 99 reached',
      toastSubscribeSent: 'Subscription request sent',
      toastAdded: 'Added',
      toastError: 'Error',
      notifyNameAnnounce: 'Announcement',
      notifyNameActivity: 'Activity',
      notifyNameMerchant: 'Merchant'
    }
  } else if (lang === 'ja') {
    L = {
      appName: 'ロコヘルパー',
      appDesc: '総合攻略・ペット図鑑・アイテム図鑑',
      tapChangeAvatar: 'タップしてアバターを変更',
      tapSelectAvatar: 'タップしてアバターを選択',
      nickname: 'ニックネーム',
      nicknamePlaceholder: 'ニックネームを入力、またはWeChatのクイック入力を使用',
      nicknameHint: '💡 キーボードバーからWeChatニックネームを使用可能',
      loginBtn: 'ログイン',
      agreeText: '以下を読み、同意しました：',
      agreeAnd: 'および',
      agreement: '利用規約',
      privacy: 'プライバシーポリシー',
      rocoUID: 'ロコ王国UID',
      tapSetUID: 'タップしてUIDを設定',
      level: 'レベル',
      loginDays: 'ログイン日数',
      checkIn: 'チェックイン',
      loginExpire: 'ログイン有効期限：',
      daysUnit: '日',
      expireHoursUnit: '時間',
      needMoreDays: '、あと{n}日でレベルアップ',
      needMoreCatches: '次のレベルまであと{n}回',
      editor: '編集者',
      developer: '開発者',
      notifyTitle: '通知設定',
      notifyTapHint: '+ をタップして通知回数を増やす（最大99回）',
      notifyAnnounce: 'お知らせ通知',
      notifyAnnounceDesc: '最新のお知らせと更新を受け取る',
      notifyActivity: 'イベント通知',
      notifyActivityDesc: 'イベント開始前にリマインダー',
      notifyMerchant: '商人通知',
      notifyMerchantDesc: '新しい商人アイテムのお知らせ',
      reset: 'リセット',
      notifyNa: '利用不可',
      notifySettingTip: 'タップしてシステム通知設定を開く',
      adminPanel: '管理画面',
      deleteAccount: 'アカウント削除',
      logout: 'ログアウト',
      feat1Title: 'ペット図鑑',
      feat1Desc: '全ペットデータを収録',
      feat2Title: '捕獲統計',
      feat2Desc: '捕獲履歴を記録',
      feat3Title: 'イベントカレンダー',
      feat3Desc: 'イベントを見逃さない',
      noticeTitle: '📋 ユーザー注意事項',
      notice1: '• 基本無料：攻略・検索機能は完全無料、ログイン不要。',
      notice2: '• 会員特典：ログイン後、幸運評価・実績同期・専用ウォーターマークを解除。',
      notice3: '• プライバシー保護：主要データはローカル保存、クラウド二重暗号化。外部流出なし。',
      notice4: '• 認証期間：ログイン有効期間は最大365日。いつでも手動でログアウト可能。',
      notice5: '• 自己管理：いつでもアカウントを削除し、クラウドバックアップを完全消去できます。',
      setUIDTitle: 'ロコ王国UIDを設定',
      uidPlaceholder: 'UIDを入力してください（数字のみ）',
      uidHint: 'UIDは共有画像にウォーターマークとして表示されます',
      cancel: 'キャンセル',
      save: '保存',
      privacyModalTitle: 'プライバシー保護について',
      privacyModalDesc1: 'ログインとクラウド同期を利用する前に、以下をお読みいただき同意してください',
      privacyModalDesc2: '。お客様のプライバシーとデータセキュリティを重視しています。',
      reject: '拒否',
      agreeContinue: '同意して続ける',
      langLabel: '言語',
      dlgSyncTitle: 'データ同期について',
      dlgSyncBody: 'より良い体験のため、ログイン後は以下のデータがクラウドに同期されます：\n\n- アバターとニックネーム — コメントの身分表示\n- 累計ログイン日数 — レベル計算\n- ユーザー設定 — マルチデバイス同期\n\nデータは本アプリの機能にのみ使用され、第三者と共有されることはありません。',
      dlgSyncOk: '了解',
      dlgLogoutTitle: 'ログアウト',
      dlgLogoutBody: 'ログアウトしてもよろしいですか？',
      dlgDeleteTitle: 'アカウント削除',
      dlgDeleteBody: 'クラウド上のアバター、ニックネーム、レベル、すべての設定データが完全に削除されます。この操作は元に戻せません。削除しますか？',
      dlgNotifyOffTitle: '通知がオフになっています',
      dlgNotifyOffBody: 'この種類の通知が無効になっています。ミニプログラムの設定で手動で有効にしてください。',
      dlgNotifyOffBtn: '設定へ',
      dlgResetTitle: 'サブスクリプションのリセット',
      dlgResetBodyPre: '「',
      dlgResetBodyPost: '」サブスクリプションをリセットしますか？リセット後に再認証が必要です。',
      toastLoginExpired: 'ログインの有効期限が切れました、再ログインしてください',
      toastUidWrong: 'UIDは数字のみ入力してください',
      toastUidSaved: 'UIDを保存しました',
      toastUidCleared: 'UIDをクリアしました',
      toastPrivacyReject: 'プライバシーポリシーを拒否するとログイン認証ができません',
      toastAgreeFirst: '利用規約とプライバシーポリシーに同意してください',
      toastAvatarFirst: 'WeChatアバターを選択してください',
      toastNicknameFirst: 'ニックネームを入力してください',
      toastLoggedOut: 'ログアウトしました',
      toastDeleting: '削除中...',
      toastLocalDeleted: 'ローカルデータを削除しました',
      toastAccountDeleted: 'アカウントを削除しました',
      toastDeleteFailed: '削除に失敗しました、再試行してください',
      toastNetworkError: 'ネットワークエラー、再試行してください',
      toastLoginFirst: '先にログインしてください',
      toastLoginFirstSetup: '設定する前にログインしてください',
      toastSetupFailed: '設定に失敗しました、再試行してください',
      toastEnabled: '有効',
      toastRejected: '拒否されました',
      toastResetDone: 'リセットしました',
      toastReauthorized: '再認証しました',
      toastResetFailed: 'リセットに失敗しました',
      toastLimit99: '上限99に達しました',
      toastSubscribeSent: 'サブスクリプションリクエストを送信しました',
      toastAdded: '追加済み',
      toastError: 'エラー',
      notifyNameAnnounce: 'お知らせ',
      notifyNameActivity: 'イベント',
      notifyNameMerchant: '商人'
    }
  } else if (lang === 'ko') {
    L = {
      appName: '로코 도우미',
      appDesc: '종합 공략 · 펫 도감 · 아이템 도감',
      tapChangeAvatar: '탭하여 아바타 변경',
      tapSelectAvatar: '탭하여 아바타 선택',
      nickname: '닉네임',
      nicknamePlaceholder: '닉네임 입력 또는 WeChat 빠른 입력 사용',
      nicknameHint: '💡 키보드 바에서 WeChat 닉네임 사용 가능',
      loginBtn: '로그인',
      agreeText: '다음을 읽고 동의했습니다:',
      agreeAnd: '및',
      agreement: '이용약관',
      privacy: '개인정보처리방침',
      rocoUID: '로코왕국 UID',
      tapSetUID: '탭하여 UID 설정',
      level: '레벨',
      loginDays: '로그인 일수',
      checkIn: '출석체크',
      loginExpire: '로그인 유효기간: ',
      daysUnit: '일',
      expireHoursUnit: '시간',
      needMoreDays: ', {n}일 후 레벨업',
      needMoreCatches: '다음 레벨까지 {n}회 남음',
      editor: '편집자',
      developer: '개발자',
      notifyTitle: '알림 설정',
      notifyTapHint: '+ 를 탭하여 알림 횟수 증가 (최대 99회)',
      notifyAnnounce: '공지 알림',
      notifyAnnounceDesc: '최신 공지 및 업데이트 수신',
      notifyActivity: '이벤트 알림',
      notifyActivityDesc: '이벤트 시작 전 알림',
      notifyMerchant: '상인 알림',
      notifyMerchantDesc: '새로운 상인 아이템 알림',
      reset: '초기화',
      notifyNa: '사용 불가',
      notifySettingTip: '탭하여 시스템 알림 설정 열기',
      adminPanel: '관리자 패널',
      deleteAccount: '계정 삭제',
      logout: '로그아웃',
      feat1Title: '펫 도감',
      feat1Desc: '모든 펫 데이터 수록',
      feat2Title: '포획 통계',
      feat2Desc: '포획 기록 추적',
      feat3Title: '이벤트 캘린더',
      feat3Desc: '이벤트를 놓치지 마세요',
      noticeTitle: '📋 사용자 안내',
      notice1: '• 핵심 무료: 공략 및 검색 기능은 완전 무료, 로그인 불필요.',
      notice2: '• 회원 특전: 로그인 후 행운 평가, 업적 동기화, 전용 워터마크 해제.',
      notice3: '• 개인정보 보호: 주요 데이터는 로컬 저장, 클라우드 이중 암호화. 외부 유출 없음.',
      notice4: '• 인증 기간: 로그인 유효기간 최대 365일. 언제든지 수동 로그아웃 가능.',
      notice5: '• 자기 통제: 언제든지 계정을 삭제하고 클라우드 백업을 완전히 삭제할 수 있습니다.',
      setUIDTitle: '로코왕국 UID 설정',
      uidPlaceholder: 'UID를 입력하세요 (숫자만)',
      uidHint: 'UID는 공유 이미지에 워터마크로 표시됩니다',
      cancel: '취소',
      save: '저장',
      privacyModalTitle: '개인정보 보호 안내',
      privacyModalDesc1: '로그인 및 클라우드 동기화를 사용하기 전에 다음을 읽고 동의해 주세요',
      privacyModalDesc2: '. 귀하의 개인정보와 데이터 보안을 소중히 여깁니다.',
      reject: '거부',
      agreeContinue: '동의하고 계속하기',
      langLabel: '언어',
      dlgSyncTitle: '데이터 동기화 안내',
      dlgSyncBody: '더 나은 경험을 위해 로그인 후 다음 데이터가 클라우드에 동기화됩니다:\n\n- 아바타 및 닉네임 — 댓글 신원 표시\n- 누적 로그인 일수 — 레벨 계산\n- 사용자 설정 — 멀티 디바이스 동기화\n\n데이터는 앱 기능에만 사용되며 제3자와 공유되지 않습니다.',
      dlgSyncOk: '확인',
      dlgLogoutTitle: '로그아웃',
      dlgLogoutBody: '로그아웃 하시겠습니까?',
      dlgDeleteTitle: '계정 삭제',
      dlgDeleteBody: '클라우드의 아바타, 닉네임, 레벨 및 모든 설정 데이터가 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다. 삭제하시겠습니까?',
      dlgNotifyOffTitle: '알림이 꺼져 있습니다',
      dlgNotifyOffBody: '이 유형의 알림이 비활성화되어 있습니다. 미니프로그램 설정에서 수동으로 활성화해 주세요.',
      dlgNotifyOffBtn: '설정으로',
      dlgResetTitle: '구독 재설정',
      dlgResetBodyPre: '"',
      dlgResetBodyPost: '" 구독을 재설정하시겠습니까? 재설정 후 다시 인증이 필요합니다.',
      toastLoginExpired: '로그인이 만료되었습니다. 다시 로그인해주세요',
      toastUidWrong: 'UID는 숫자만 입력 가능합니다',
      toastUidSaved: 'UID 저장됨',
      toastUidCleared: 'UID 삭제됨',
      toastPrivacyReject: '개인정보처리방침을 거부하면 로그인 인증이 불가능합니다',
      toastAgreeFirst: '이용약관과 개인정보처리방침에 동의해주세요',
      toastAvatarFirst: 'WeChat 아바타를 선택해주세요',
      toastNicknameFirst: '닉네임을 입력해주세요',
      toastLoggedOut: '로그아웃됨',
      toastDeleting: '삭제 중...',
      toastLocalDeleted: '로컬 데이터 삭제됨',
      toastAccountDeleted: '계정 삭제됨',
      toastDeleteFailed: '삭제 실패, 다시 시도해주세요',
      toastNetworkError: '네트워크 오류, 다시 시도해주세요',
      toastLoginFirst: '먼저 로그인해주세요',
      toastLoginFirstSetup: '설정 전에 로그인해주세요',
      toastSetupFailed: '설정 실패, 다시 시도해주세요',
      toastEnabled: '활성화됨',
      toastRejected: '거부됨',
      toastResetDone: '초기화됨',
      toastReauthorized: '재인증됨',
      toastResetFailed: '초기화 실패',
      toastLimit99: '최대 99개 도달',
      toastSubscribeSent: '구독 요청 전송됨',
      toastAdded: '추가됨',
      toastError: '오류',
      notifyNameAnnounce: '공지',
      notifyNameActivity: '이벤트',
      notifyNameMerchant: '상인'
    }
  } else {
    L = {
      appName: '洛手助手',
      appDesc: '全面攻略 · 精灵图鉴 · 道具图鉴',
      tapChangeAvatar: '点击更换头像',
      tapSelectAvatar: '点击选择头像',
      nickname: '昵称',
      nicknamePlaceholder: '输入昵称，或点击键盘上方快捷填入',
      nicknameHint: '💡 键盘上方可快速使用微信昵称',
      loginBtn: '登 录',
      agreeText: '我已阅读并同意',
      agreeAnd: '和',
      agreement: '《用户协议》',
      privacy: '《隐私政策》',
      rocoUID: '洛克王国UID',
      tapSetUID: '点击设置UID',
      level: '等级',
      loginDays: '登录天数',
      checkIn: '今日打卡',
      loginExpire: '登录有效期剩余：',
      daysUnit: '天',
      expireHoursUnit: '小时',
      needMoreDays: '，还需 {n} 天升级',
      needMoreCatches: '捕捉还需 {n} 次升级',
      editor: '小编',
      developer: '开发者',
      notifyTitle: '通知设置',
      notifyTapHint: '点击 + 增加推送次数，最多99条',
      notifyAnnounce: '公告通知',
      notifyAnnounceDesc: '接收最新公告和公告更新',
      notifyActivity: '活动提醒',
      notifyActivityDesc: '活动开始前推送提醒',
      notifyMerchant: '商人提醒',
      notifyMerchantDesc: '远行商人新商品上架推送',
      reset: '重置',
      notifyNa: '暂未开放',
      notifySettingTip: '如需修改通知权限，请点击前往系统设置',
      adminPanel: '管理后台',
      deleteAccount: '注销账号',
      logout: '退出登录',
      feat1Title: '精灵图鉴',
      feat1Desc: '收录全部精灵数据',
      feat2Title: '捕捉统计',
      feat2Desc: '记录你的捕捉历程',
      feat3Title: '活动日历',
      feat3Desc: '不错过每个活动',
      noticeTitle: '📋 用户须知',
      notice1: '• 核心免费：本工具攻略及查询功能均完全免费，无需登录即可畅享。',
      notice2: '• 专属特权：授权登录后即可解锁欧皇评级、成就同步及战报专属水印。',
      notice3: '• 隐私保障：核心记录数据均采用本地优先存储及云端双重加密，绝不外泄。',
      notice4: '• 授权周期：登录有效期最长为365天，您也可以随时手动注销。',
      notice5: '• 自主控制：您随时可以在个人中心选择注销，彻底清空云端备份记录。',
      setUIDTitle: '设置洛克王国UID',
      uidPlaceholder: '输入您的洛克王国UID（纯数字）',
      uidHint: '设置后将作为水印显示在分享图片中',
      cancel: '取消',
      save: '保存',
      privacyModalTitle: '用户隐私保护提示',
      privacyModalDesc1: '在使用登录及云端同步服务前，请阅读并同意',
      privacyModalDesc2: '。我们非常重视您的个人隐私与数据安全。',
      reject: '拒绝',
      agreeContinue: '同意并继续',
      langLabel: '语言',
      dlgSyncTitle: '数据同步说明',
      dlgSyncBody: '为提供更好体验，登录后将同步以下数据到云端：\n\n• 头像和昵称 — 评论身份标识\n• 累计登录天数 — 等级系统计算\n• 用户偏好设置 — 多设备同步\n\n数据仅用于本应用功能，不会向第三方共享。',
      dlgSyncOk: '我知道了',
      dlgLogoutTitle: '退出登录',
      dlgLogoutBody: '确定要退出登录吗？',
      dlgDeleteTitle: '注销账户',
      dlgDeleteBody: '注销后将永久删除您在云端的头像、昵称、积分等级及全部设置数据，注销操作无法恢复。确定要注销吗？',
      dlgNotifyOffTitle: '通知已关闭',
      dlgNotifyOffBody: '您已关闭该类通知，请在小程序设置中手动开启',
      dlgNotifyOffBtn: '去设置',
      dlgResetTitle: '重置订阅',
      dlgResetBodyPre: '确定重置「',
      dlgResetBodyPost: '」订阅？重置后需重新授权',
      toastLoginExpired: '登录已过期，请重新登录',
      toastUidWrong: 'UID应为纯数字',
      toastUidSaved: 'UID已保存',
      toastUidCleared: 'UID已清除',
      toastPrivacyReject: '拒绝隐私指引将无法进行登录授权',
      toastAgreeFirst: '请先勾选同意《用户协议》和《隐私政策》',
      toastAvatarFirst: '请点击头像获取微信头像',
      toastNicknameFirst: '请输入昵称',
      toastLoggedOut: '已退出',
      toastDeleting: '注销中...',
      toastLocalDeleted: '本地注销成功',
      toastAccountDeleted: '账户已注销',
      toastDeleteFailed: '注销失败，请重试',
      toastNetworkError: '网络错误，请重试',
      toastLoginFirst: '请先登录',
      toastLoginFirstSetup: '请先登录后再设置',
      toastSetupFailed: '设置失败，请重试',
      toastEnabled: '已开启',
      toastRejected: '已拒绝',
      toastResetDone: '已重置',
      toastReauthorized: '已重新授权',
      toastResetFailed: '重置失败',
      toastLimit99: '已达上限99条',
      toastSubscribeSent: '订阅请求已发送',
      toastAdded: '已添加',
      toastError: '异常',
      notifyNameAnnounce: '公告',
      notifyNameActivity: '活动',
      notifyNameMerchant: '商人'
    }
  }
  return L
}

function formatStr(template, obj) {
  return template.replace(/\{(\w+)\}/g, function(_, key) { return obj[key] != null ? obj[key] : '' })
}

Page({
  data: {
    userInfo: null,
    hasUserInfo: false,
    isLogging: false,
    isAgreed: false,
    showWechatPrivacyModal: false,
    loginExpire: '',
    tempAvatar: '',
    tempNickName: '',
    loginDays: 0,
    level: 1,
    levelName: '小洛克',
    levelColor: { bg: 'rgba(255,255,255,0.1)', text: 'rgba(255,255,255,0.5)', border: 'rgba(255,255,255,0.2)' },
    levelIcon: '🐣',
    nextLevelDays: 3,
    nextXP: 50,
    hasUid: false,
    isAdmin: false,
    gameUid: '',
    showUidModal: false,
    uidInput: '',
    userRole: '',
    notifyStatus: {
      announcement: false,
      activity: false,
      system: false,
      merchant: false,
      interaction: false
    },
    notifyCount: {
      announcement: 0,
      activity: 0,
      system: 0,
      merchant: 0,
      interaction: 0
    },
    notifyConfigured: {
      announcement: false,
      activity: false,
      system: false,
      merchant: false,
      interaction: false
    },
    notifyLoading: false,
    notifyAdding: false,
    currentLang: 'zh',
    loginLabels: getLoginLabels('zh')
  },
  onLoad: function() {
    var self = this
    var app = getApp()
    if (wx.cloud) db = wx.cloud.database()
    var lang = i18n.getLanguage()
    self.setData({ currentLang: lang, loginLabels: getLoginLabels(lang) })
    var saved = wx.getStorageSync('user_info')
    if (saved) app.globalData.userInfo = saved
    var subscribeConfig = wx.getStorageSync('subscribe_config') || { announcement: true, activity: true, system: true, merchant: true, interaction: true }
    self.setData({ subscribeConfig: subscribeConfig })
    self.checkLoginStatus()
    self.recordLoginDay()
    self.checkAdmin()
    if (saved) self.loadNotifyStatus()
    self.checkNotifyConfig()
    self.loadUserRole()

    if (wx.onNeedPrivacyAuthorization) {
      wx.onNeedPrivacyAuthorization(function(resolve) {
        self.resolvePrivacyAuthorization = resolve
        self.setData({ showWechatPrivacyModal: true })
      })
    }
  },
  onShow: function() {
    var lang = i18n.getLanguage()
    if (lang !== this.data.currentLang) {
      this.setData({ currentLang: lang, loginLabels: getLoginLabels(lang) })
      this.updateLoginDayText()
    }
    this.loadUserRole()
  },

  switchLang: function(e) {
    var lang = e.currentTarget.dataset.lang
    var app = getApp()
    app.setLang(lang)
    this.setData({ currentLang: lang, loginLabels: getLoginLabels(lang) })
    this.updateLoginDayText()
  },

  updateLoginDayText: function() {
    var self = this
    var days = self.data.loginDays
    var next = self.data.nextLevelDays
    var nextXP = self.data.nextXP
    var L = self.data.loginLabels
    var daysRemain = next - days > 0 ? formatStr(L.needMoreDays, { n: next - days }) : ''
    self.setData({
      loginDaysText: L.daysUnit ? days + L.daysUnit : days,
      nextLevelText: daysRemain,
      nextXPText: formatStr(L.needMoreCatches, { n: nextXP })
    })
  },

  loadUserRole: function() {
    var self = this
    if (!wx.cloud) return
    var db = wx.cloud.database()
    var userInfo = getApp().globalData.userInfo
    if (!userInfo) return
    getOpenId(function(openid) {
      if (!openid) return
      db.collection('users').where({ _openid: openid }).get()
        .then(function(r) {
          if (r.data.length > 0 && r.data[0].role) {
            self.setData({ userRole: r.data[0].role })
          }
        })
        .catch(function() {})
    })
  },
  recordLoginDay: function() {
    var self = this
    var today = new Date()
    var todayStr = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
    var loginDays = wx.getStorageSync('login_days') || []
    var todayLogin = false
    if (loginDays.length > 0 && loginDays[loginDays.length - 1] === todayStr) {
      todayLogin = true
    } else {
      loginDays.push(todayStr)
      wx.setStorageSync('login_days', loginDays)
      todayLogin = true
      self.syncLoginDays(loginDays)
    }
    var totalDays = loginDays.length
    var gameUid = wx.getStorageSync('game_uid') || ''
    var captureCount = wx.getStorageSync('total_catches') || 0
    var hasUid = !!gameUid
    var level = levelUtil.calcLevel(totalDays, hasUid, captureCount)
    var levelInfo = levelUtil.getLevelColor(level)
    var levelName = levelUtil.getLevelName(level)
    var levelIcon = levelUtil.getLevelIcon(level)
    var nextDays = levelUtil.calcNextLevelDays(level)
    var nextXP = levelUtil.getNextXP(captureCount)
    self.setData({
      loginDays: totalDays,
      level: level,
      levelName: levelName,
      levelColor: levelInfo,
      levelIcon: levelIcon,
      todayLogin: todayLogin,
      nextLevelDays: nextDays,
      nextXP: nextXP,
      hasUid: hasUid,
      gameUid: gameUid
    })
    var app = getApp()
    app.globalData.loginDays = totalDays
    app.globalData.level = level
    self.syncLevel(level)
    self.updateLoginDayText()
  },
  syncLoginDays: function(loginDays) {
    if (!wx.cloud) return
    var db = wx.cloud.database()
    getOpenId(function(openid) {
      if (!openid) return
      db.collection('users').where({ _openid: openid }).get()
        .then(function(r) {
          if (r.data.length > 0) {
            db.collection('users').doc(r.data[0]._id).update({
              data: { loginDays: loginDays, updateTime: db.serverDate() }
            })
          }
        })
        .catch(function() {})
    })
  },
  syncLevel: function(level) {
    if (!wx.cloud) return
    var db = wx.cloud.database()
    getOpenId(function(openid) {
      if (!openid) return
      db.collection('users').where({ _openid: openid }).get()
        .then(function(r) {
          if (r.data.length > 0) {
            db.collection('users').doc(r.data[0]._id).update({
              data: { level: level, updateTime: db.serverDate() }
            })
          }
        })
        .catch(function() {})
    })
  },
  checkLoginStatus: function() {
    var self = this
    var saved = wx.getStorageSync('user_info')
    var loginTime = wx.getStorageSync('login_time')
    var gameUid = wx.getStorageSync('game_uid') || ''
    if (saved && loginTime) {
      var now = Date.now()
      var expire = 365 * 24 * 60 * 60 * 1000
      if (now - loginTime > expire) {
        wx.removeStorageSync('user_info')
        wx.removeStorageSync('login_time')
        wx.removeStorageSync('is_admin_user')
        wx.removeStorageSync('admin_logged_in')
        self.setData({ userInfo: null, hasUserInfo: false, gameUid: '' })
        wx.showToast({ title: self.data.loginLabels.toastLoginExpired, icon: 'none' })
      } else {
        var remain = expire - (now - loginTime)
        var days = Math.floor(remain / (24 * 60 * 60 * 1000))
        var hours = Math.floor((remain % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
        var L = self.data.loginLabels
        self.setData({ userInfo: saved, hasUserInfo: true, loginExpire: days + L.daysUnit + hours + L.expireHoursUnit, gameUid: gameUid })
      }
    }
  },
  onChooseAvatar: function(e) {
    this.setData({ tempAvatar: e.detail.avatarUrl })
  },
  onNickNameInput: function(e) {
    this.setData({ tempNickName: e.detail.value })
  },
  onNickNameBlur: function(e) {
    var val = (e.detail.value || '').trim()
    if (val && val !== this.data.tempNickName) {
      this.setData({ tempNickName: val })
    }
  },
  onNickFormSubmit: function(e) {
    var val = (e.detail.value.nickname || '').trim()
    if (val) {
      this.setData({ tempNickName: val })
    }
  },
  toggleUidModal: function() {
    this.setData({ showUidModal: !this.data.showUidModal, uidInput: this.data.gameUid })
  },
  onUidInput: function(e) {
    this.setData({ uidInput: e.detail.value })
  },
  saveUid: function() {
    var self = this
    var uid = self.data.uidInput.trim()
    if (uid && !/^\d+$/.test(uid)) {
      wx.showToast({ title: self.data.loginLabels.toastUidWrong, icon: 'none' })
      return
    }
    wx.setStorageSync('game_uid', uid)
    self.setData({ gameUid: uid, showUidModal: false })
    wx.showToast({ title: uid ? self.data.loginLabels.toastUidSaved : self.data.loginLabels.toastUidCleared, icon: 'success' })
    if (uid && wx.cloud) {
      var db = wx.cloud.database()
      if (db) {
        wx.cloud.callFunction({ name: 'login' }).then(function(res) {
          var openid = res.result.openid
          db.collection('users').where({ _openid: openid }).get()
            .then(function(r) {
              if (r.data.length > 0) {
                db.collection('users').doc(r.data[0]._id).update({ data: { gameUid: uid } })
              }
            })
            .catch(function() {})
        }).catch(function() {})
      }
    }
  },
  preventClose: function() {},
  onAgreeChange: function(e) {
    this.setData({ isAgreed: e.detail.value.indexOf('agree') >= 0 })
  },
  handleAgreePrivacy: function(e) {
    this.setData({ showWechatPrivacyModal: false })
    if (this.resolvePrivacyAuthorization) {
      this.resolvePrivacyAuthorization({ event: 'agree', buttonId: 'agree-btn' })
      this.resolvePrivacyAuthorization = null
    }
  },
  handleDisagreePrivacy: function() {
    this.setData({ showWechatPrivacyModal: false })
    if (this.resolvePrivacyAuthorization) {
      this.resolvePrivacyAuthorization({ event: 'disagree' })
      this.resolvePrivacyAuthorization = null
    }
    wx.showToast({ title: self.data.loginLabels.toastPrivacyReject, icon: 'none' })
  },
  onLogin: function() {
    var self = this
    if (self.data.isLogging) return
    if (!self.data.isAgreed) {
      wx.showToast({ title: self.data.loginLabels.toastAgreeFirst, icon: 'none' })
      return
    }
    var avatar = self.data.tempAvatar
    var nickName = self.data.tempNickName.trim()
    if (!avatar) {
      wx.showToast({ title: self.data.loginLabels.toastAvatarFirst, icon: 'none' })
      return
    }
    if (!nickName) {
      wx.showToast({ title: self.data.loginLabels.toastNicknameFirst, icon: 'none' })
      return
    }
    self.setData({ isLogging: true })
    var userInfo = { avatarUrl: avatar, nickName: nickName }
    var loginTime = Date.now()
    wx.setStorageSync('user_info', userInfo)
    wx.setStorageSync('login_time', loginTime)
    var app = getApp()
    app.globalData.userInfo = userInfo
    var expire = 365 * 24 * 60 * 60 * 1000
    self.setData({ userInfo: userInfo, hasUserInfo: true, isLogging: false, loginExpire: '365' + L.daysUnit + '0' + L.expireHoursUnit })
    self.syncToCloud(userInfo)
    var L = self.data.loginLabels
    wx.showModal({
      title: L.dlgSyncTitle,
      content: L.dlgSyncBody,
      showCancel: false,
      confirmText: L.dlgSyncOk
    })
  },
  syncToCloud: function(userInfo) {
    var self = this
    if (!wx.cloud) return
    var db = wx.cloud.database()
    var loginDays = wx.getStorageSync('login_days') || []
    if (userInfo.avatarUrl && userInfo.avatarUrl.indexOf('cloud://') === -1) {
      var avatarPath = userInfo.avatarUrl
      if (avatarPath.indexOf('http') === 0) {
        wx.downloadFile({
          url: avatarPath,
          success: function(downloadRes) {
            if (downloadRes.statusCode === 200) {
              var tempPath = downloadRes.tempFilePath
              wx.cloud.uploadFile({
                cloudPath: 'avatars/' + userInfo.nickName + '_' + Date.now() + '.jpg',
                filePath: tempPath
              }).then(function(uploadRes) {
                userInfo.avatarUrl = uploadRes.fileID
                userInfo._cloudAvatar = uploadRes.fileID
                wx.setStorageSync('user_info', userInfo)
                getApp().globalData.userInfo = userInfo
                self.setData({ userInfo: userInfo })
                self.saveToCloud(db, userInfo, loginDays)
              }).catch(function() {
                self.saveToCloud(db, userInfo, loginDays)
              })
            } else {
              self.saveToCloud(db, userInfo, loginDays)
            }
          },
          fail: function() { self.saveToCloud(db, userInfo, loginDays) }
        })
      } else {
        wx.cloud.uploadFile({
          cloudPath: 'avatars/' + userInfo.nickName + '_' + Date.now() + '.jpg',
          filePath: avatarPath
        }).then(function(res) {
          userInfo.avatarUrl = res.fileID
          userInfo._cloudAvatar = res.fileID
          wx.setStorageSync('user_info', userInfo)
          getApp().globalData.userInfo = userInfo
          self.setData({ userInfo: userInfo })
          self.saveToCloud(db, userInfo, loginDays)
        }).catch(function() {
          self.saveToCloud(db, userInfo, loginDays)
        })
      }
    } else {
      if (userInfo.avatarUrl && userInfo.avatarUrl.indexOf('cloud://') === 0) {
        userInfo._cloudAvatar = userInfo.avatarUrl
      }
      self.saveToCloud(db, userInfo, loginDays)
    }
  },
  saveToCloud: function(db, userInfo, loginDays) {
    wx.cloud.callFunction({ name: 'login' }).then(function(res) {
      var openid = res.result.openid
      var cloudData = {
        nickName: userInfo.nickName,
        avatarUrl: userInfo.avatarUrl,
        loginDays: loginDays,
        lastLogin: db.serverDate(),
        updateTime: db.serverDate()
      }
      db.collection('users').where({ _openid: openid }).get()
        .then(function(r) {
          if (r.data.length > 0) {
            db.collection('users').doc(r.data[0]._id).update({ data: cloudData })
          } else {
            db.collection('users').add({ data: cloudData })
          }
        })
        .catch(function() {})
    }).catch(function() {})
  },
  onLogout: function() {
    var self = this
    var L = self.data.loginLabels
    wx.showModal({
      title: L.dlgLogoutTitle,
      content: L.dlgLogoutBody,
      success: function(res) {
        if (res.confirm) {
          self.clearLocalUserData()
          wx.showToast({ title: L.toastLoggedOut, icon: 'success' })
        }
      }
    })
  },
  onDeleteAccount: function() {
    var self = this
    var L = self.data.loginLabels
    wx.showModal({
      title: L.dlgDeleteTitle,
      content: L.dlgDeleteBody,
      confirmColor: '#ff4757',
      success: function(res) {
        if (res.confirm) {
          wx.showLoading({ title: L.toastDeleting })
          if (!wx.cloud) {
            wx.hideLoading()
            self.clearLocalUserData()
            wx.showToast({ title: L.toastLocalDeleted, icon: 'success' })
            return
          }
          var db = wx.cloud.database()
          wx.cloud.callFunction({ name: 'login' }).then(function(loginRes) {
            var openid = loginRes.result.openid
            db.collection('users').where({ _openid: openid }).remove()
              .then(function() {
                wx.hideLoading()
                self.clearLocalUserData()
                wx.showToast({ title: L.toastAccountDeleted, icon: 'success' })
              })
              .catch(function(e) {
                console.error('云端数据注销失败:', e)
                wx.hideLoading()
                wx.showToast({ title: L.toastDeleteFailed, icon: 'none' })
              })
          }).catch(function(e) {
            console.error('获取 openid 失败:', e)
            wx.hideLoading()
            wx.showToast({ title: L.toastNetworkError, icon: 'none' })
          })
        }
      }
    })
  },
  clearLocalUserData: function() {
    wx.removeStorageSync('user_info')
    wx.removeStorageSync('login_time')
    wx.removeStorageSync('is_admin_user')
    wx.removeStorageSync('admin_logged_in')
    getApp().globalData.userInfo = null
    this.setData({ userInfo: null, hasUserInfo: false, loginExpire: '' })
  },
  loadNotifyStatus: function() {
    var self = this
    notify.getSubscriptionStatus(function(err, status) {
      if (!err && status) {
        self.setData({
          'notifyStatus.announcement': !!status.announcement,
          'notifyStatus.activity': !!status.activity,
          'notifyStatus.system': !!status.system,
          'notifyStatus.merchant': !!status.merchant,
          'notifyStatus.interaction': !!status.interaction,
          'notifyCount.announcement': status.announcementCount || 0,
          'notifyCount.activity': status.activityCount || 0,
          'notifyCount.system': status.systemCount || 0,
          'notifyCount.merchant': status.merchantCount || 0,
          'notifyCount.interaction': status.interactionCount || 0
        })
      }
    })
  },
  checkNotifyConfig: function() {
    var self = this
    var configured = {}
    for (var key in templateConfig) {
      if (templateConfig.hasOwnProperty(key)) {
        configured[key] = templateConfig[key] && templateConfig[key].indexOf('TEMPLATE_ID') === -1 && templateConfig[key].length > 10
      }
    }
    self.setData({ notifyConfigured: configured })
  },
  onNotifyToggle: function(e) {
    var self = this
    var type = e.currentTarget.dataset.type
    var L = self.data.loginLabels
    if (self.data.notifyLoading) return
    if (!app.globalData.userInfo) {
      wx.showToast({ title: L.toastLoginFirst, icon: 'none' })
      return
    }
    self.setData({ notifyLoading: true })
    notify.requestAndSave([type], function(err, result) {
      self.setData({ notifyLoading: false })
      if (err) {
        if (!err.noConfig) {
          console.error('订阅失败详情:', err)
          if (err.errMsg && err.errMsg.indexOf('openid') >= 0) {
            wx.showToast({ title: L.toastLoginFirstSetup, icon: 'none' })
          } else {
            wx.showToast({ title: L.toastSetupFailed, icon: 'none' })
          }
        }
        return
      }
      if (result[type] === 'accept') {
        self.setData({ ['notifyStatus.' + type]: true })
        wx.showToast({ title: L.toastEnabled, icon: 'success' })
      } else if (result[type] === 'reject') {
        self.setData({ ['notifyStatus.' + type]: false })
        wx.showToast({ title: L.toastRejected, icon: 'none' })
      } else if (result[type] === 'ban') {
        self.setData({ ['notifyStatus.' + type]: false })
        wx.showModal({
          title: L.dlgNotifyOffTitle,
          content: L.dlgNotifyOffBody,
          confirmText: L.dlgNotifyOffBtn,
          success: function(modalRes) {
            if (modalRes.confirm) wx.openSetting({})
          }
        })
      }
    })
  },
  onNotifySetting: function() { wx.openSetting({}) },
  onResetSubscribe: function(e) {
    var self = this
    var type = e.currentTarget.dataset.type
    var L = self.data.loginLabels
    var names = { announcement: L.notifyNameAnnounce, activity: L.notifyNameActivity, merchant: L.notifyNameMerchant }
    wx.showModal({
      title: L.dlgResetTitle,
      content: L.dlgResetBodyPre + names[type] + L.dlgResetBodyPost,
      success: function(res) {
        if (res.confirm) {
          if (!db) return
          wx.cloud.callFunction({ name: 'login' }).then(function(loginRes) {
            var openid = loginRes.result.openid
            db.collection('subscribers').where({ openid: openid, type: type }).get()
              .then(function(subRes) {
                if (subRes.data.length > 0) {
                  return db.collection('subscribers').doc(subRes.data[0]._id).update({
                    data: { status: 'expired', count: 0, updateTime: db.serverDate() }
                  })
                }
              })
              .then(function() {
                self.setData({ ['notifyCount.' + type]: 0 })
                self.loadNotifyStatus()
                wx.showToast({ title: L.toastResetDone, icon: 'success' })
                notify.requestAndSave([type], function(err, result) {
                  if (!err && result && result[type] === 'accept') {
                    self.setData({ ['notifyCount.' + type]: 1 })
                    self.loadNotifyStatus()
                    wx.showToast({ title: L.toastReauthorized, icon: 'success' })
                  }
                })
              })
              .catch(function() { wx.showToast({ title: L.toastResetFailed, icon: 'none' }) })
          }).catch(function() {})
        }
      }
    })
  },
  _notifyAddingLock: false,
  onNotifyAdd: function(e) {
    var self = this
    var type = e.currentTarget.dataset.type
    var L = self.data.loginLabels
    if (self.data.notifyAdding || self._notifyAddingLock) return
    if (!app.globalData.userInfo) {
      wx.showToast({ title: L.toastLoginFirst, icon: 'none' })
      return
    }
    var currentCount = self.data.notifyCount[type] || 0
    if (currentCount >= 99) {
      wx.showToast({ title: L.toastLimit99, icon: 'none' })
      return
    }
    self._notifyAddingLock = true
    self.setData({ notifyAdding: true })
    var unlockTimer = setTimeout(function() {
      if (self.data.notifyAdding) {
        console.warn('[onNotifyAdd] Force unlock notifyAdding due to timeout')
        self._notifyAddingLock = false
        self.setData({ notifyAdding: false })
      }
    }, 4000)
    try {
      notify.requestAndSave([type], function(err, result) {
        clearTimeout(unlockTimer)
        self._notifyAddingLock = false
        self.setData({ notifyAdding: false })
        if (err) {
          if (!err.noConfig) {
            console.error('订阅失败详情:', err)
            if (err.errMsg && err.errMsg.indexOf('openid') >= 0) {
              wx.showToast({ title: L.toastLoginFirstSetup, icon: 'none' })
            } else {
              wx.showToast({ title: L.toastSetupFailed + (err.errMsg || ''), icon: 'none' })
            }
          }
          return
        }
        if (!result) { wx.showToast({ title: L.toastSubscribeSent, icon: 'none' }); return }
        if (result[type] === 'accept') {
          var newCount = currentCount + 1
          var notifyCount = self.data.notifyCount || {}
          notifyCount[type] = newCount
          var notifyStatus = self.data.notifyStatus || {}
          notifyStatus[type] = true
          self.setData({ notifyCount: notifyCount, notifyStatus: notifyStatus })
          wx.showToast({ title: L.toastAdded + '(' + newCount + '/99)', icon: 'success' })
          self.loadNotifyStatus()
        } else if (result[type] === 'reject') {
          wx.showToast({ title: L.toastRejected, icon: 'none' })
        } else if (result[type] === 'ban') {
          wx.showModal({
            title: L.dlgNotifyOffTitle,
            content: L.dlgNotifyOffBody,
            confirmText: L.dlgNotifyOffBtn,
            success: function(modalRes) { if (modalRes.confirm) wx.openSetting({}) }
          })
        }
      })
    } catch (ex) {
      clearTimeout(unlockTimer)
      self._notifyAddingLock = false
      self.setData({ notifyAdding: false })
      console.error('[onNotifyAdd] Exception caught:', ex)
      wx.showToast({ title: L.toastError + (ex.message || ''), icon: 'none' })
    }
  },
  go: function(e) { wx.navigateTo({ url: e.currentTarget.dataset.url }) },
  showAgreement: function() {
    wx.navigateTo({ url: '/pages/privacy/privacy?type=agreement' })
  },
  showPrivacy: function() {
    wx.navigateTo({ url: '/pages/privacy/privacy?type=privacy' })
  },
  checkAdmin: function() {
    var self = this
    if (!wx.cloud) return
    var db = wx.cloud.database()
    var userInfo = getApp().globalData.userInfo
    if (!userInfo) return
    db.collection('admin_config').doc('admin').get()
      .then(function(res) {
        var adminOpenid = res.data.openid
        db.collection('users').where({ _openid: adminOpenid }).get()
          .then(function(userRes) {
            if (userRes.data.length > 0) self.setData({ isAdmin: true })
          })
          .catch(function() {})
      })
      .catch(function(e) { console.log('检查管理员失败:', e) })
  },
  goAdmin: function() { wx.navigateTo({ url: '/pages/admin/admin' }) },
  onShareAppMessage: function() {
    return { title: '洛手助手BENJAMIN - 个人中心', path: '/pages/index/index', imageUrl: '/images/banner.webp' }
  },
  onShareTimeline: function() {
    return { title: '洛手助手BENJAMIN - 精灵图鉴·捕捉统计·活动日历', imageUrl: '/images/banner.webp' }
  }
})
