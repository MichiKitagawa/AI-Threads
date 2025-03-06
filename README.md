# AI会話共有プラットフォーム

AIとの会話を共有するためのプラットフォームです。ChatGPT、Gemini、Claudeなどとの会話内容を投稿し、他のユーザーと知識を共有できます。

## 機能

- Google認証によるログイン
- AIとの会話を投稿
- 投稿の時系列表示
- 誰でも閲覧可能なタイムライン

## 技術スタック

- **フロントエンド**: Next.js / React / TypeScript
- **バックエンド**: Firebase (Firestore)
- **認証**: Firebase Auth (Googleログイン)
- **ホスティング**: Vercel

## セットアップ方法

### 前提条件

- Node.js (v18以上)
- npm または yarn
- Firebaseプロジェクト

### インストール手順

1. リポジトリをクローン
```bash
git clone <リポジトリURL>
cd ai-thread-sharing
```

2. 依存関係をインストール
```bash
npm install
# または
yarn install
```

3. 環境変数の設定
`.env.local.example`ファイルを`.env.local`にコピーし、Firebaseの設定情報を入力します。

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

4. 開発サーバーを起動
```bash
npm run dev
# または
yarn dev
```

5. ブラウザで `http://localhost:3000` にアクセス

## Firebaseの設定

1. [Firebase Console](https://console.firebase.google.com/)でプロジェクトを作成
2. Authentication設定でGoogleログインを有効化
3. Firestoreデータベースを作成
4. プロジェクト設定からウェブアプリを追加し、設定情報を取得

## デプロイ方法

### Vercelへのデプロイ

1. [Vercel](https://vercel.com/)にアカウント登録
2. GitHubリポジトリと連携
3. 環境変数を設定
4. デプロイ

## 今後の拡張予定

- 議論を深める機能（リツイートのような派生投稿）
- AIが投稿を認識し、ツリー構造で知識を拡張
- 検索機能（カテゴリ・タグ整理）
- いいね・コメント機能（SNS要素の追加）

## ライセンス

MIT

## 貢献方法

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成
