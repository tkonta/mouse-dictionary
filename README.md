# Mouse Dictionary — Personal

[Mouse Dictionary](https://github.com/wtetsu/mouse-dictionary) をベースにした個人用のカスタム版です。この README では、本家からの変更内容とカスタム版の使い方を説明します。

基本機能、辞書データの導入方法、開発方法、第三者データの情報は、[オリジナル README（本家リポジトリ）](https://github.com/wtetsu/mouse-dictionary/blob/master/README.md) を参照してください。

## カスタム機能

### 複数単語の句を優先して表示する

辞書にヒットした見出しのうち、複数単語の句を単語単体より先に表示できる設定を追加しました。

例えば、`In practice, the most ...` の `In` にマウスを合わせた場合、設定をオンにすると次の順序になります（両方の見出しが辞書にある場合）。

1. `in practice`
2. `in`

- **初期値はオフ**です。オフでは本家と同じ表示順になります。
- オプション画面で「上級設定を開く」を選び、「複数単語の句を優先して表示する」をオンにして「設定を保存する」を押してください。利用中のページを再読み込みすると反映されます。
- 句同士・単語同士の順序は従来のままです。句の長さ順への並べ替えは行いません。
- 句の判定は、見出しの内部に空白を含むかどうかで行います。ハイフンだけでつながった語は単語側に含まれます。
- 検索候補や辞書検索処理は変更せず、表示データのみを並べ替えます。選択文字列の検索と設定画面のプレビューにも適用されます。
- 辞書の参照先として追加された句も優先表示の対象です。後ろに移動した短い単語の説明は、既存の省略設定に従います。

## ローカルでの利用

Node.js 26 以上を使用します。リポジトリのディレクトリで次を実行してください。

```sh
npm install
npm run build-chrome
```

Chrome または Brave の拡張機能管理画面でデベロッパーモードをオンにし、「パッケージ化されていない拡張機能を読み込む」から、このリポジトリ内の `dist-chrome` を選択します。

ソースを更新した場合は再ビルドし、拡張機能管理画面で拡張機能を再読み込みしたあと、利用中のページも再読み込みしてください。リポジトリを移動した場合は、移動先の `dist-chrome` を読み込み直してください。

## GitHub Releases からZIPを取得する

`custom-*` 形式のタグを `origin` へ push すると、GitHub Actions がChrome向けの本番ビルドを行い、ZIPを添付したGitHub Releaseを作成します。
ForkではActionsが無効になっている場合があります。初回はGitHubの「Actions」タブを開き、ワークフローを有効にしてください。

```sh
git switch personal
git pull --ff-only origin personal
git tag -a custom-v1.7.4.2 -m "Personal release 1.7.4.2"
git push origin custom-v1.7.4.2
```

タグ名は過去に使っていないものを選び、動作確認済みのコミットに付けてください。ビルドの進行状況はForkの「Actions」で確認できます。成功後は「Releases」から `mouse-dictionary-<タグ名>-chrome.zip` をダウンロードします。WindowsではZIPを展開し、ChromeまたはBraveの拡張機能管理画面でデベロッパーモードをオンにして、展開したフォルダーを読み込みます。

## ブランチとバージョン管理

- `personal`：個人版を維持するブランチ。GitHub上のデフォルトブランチです。
- `master`：本家の更新に追従するブランチ。GitHub上のデフォルトブランチとは別に、本家追従用として維持します。
- `feature/機能名`：必要に応じて個別機能を開発し、完成後に `personal` へ取り込むブランチ。
- `custom-v1.7.4.1`：本家バージョン `1.7.4` をベースにした、最初の動作確認済みカスタム版。

個人版のタグには `custom-` を付け、本家の `v…` タグと区別します。タグは動作確認したコミットを記録するもので、拡張機能自体のバージョン番号とは別に管理します。

本家リポジトリは `upstream`、個人の Fork は `origin` として扱います。本家の更新を取り込む際は、`master` を更新してから `personal` へマージし、テスト・ビルド・実動作を確認します。

## ライセンス

本家と同じ MIT ライセンスです。[LICENSE](./LICENSE) を参照してください。第三者データのライセンス情報は、[オリジナル README](https://github.com/wtetsu/mouse-dictionary/blob/master/README.md#third-party-data) を参照してください。
