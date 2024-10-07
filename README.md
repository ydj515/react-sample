# React sample project

## Environment

- [node 20.11.0](<(https://nodejs.org/en/download/package-manager)(https://nodejs.org/en/download/package-manager)>)
- [react 18.3.1](https://legacy.reactjs.org/)
- [typestcript](https://www.typescriptlang.org/)
- [vite](https://vite.dev/)
- [tailwindcss 3.4](https://tailwindcss.com/)
- [daisyui 4.12](https://daisyui.com/)(ui component for tailwind)
- [pnpm](https://pnpm.io/)

## Prerequisite

1. [nvm install](https://nodejs.org/en/download/package-manager)<br/>
   node version manager인 `nvm`을 설치한다.

2. [pnpm install](https://pnpm.io/installation)<br/>
   node package managerdls npm 대신 `pnpm`을 설치 후 사용한다.
   ```sh
   npm install -g pnpm
   ```

## Project setup

1. `package install`<br/>
   프로젝트에서 사용하는 전체 package install을 진행한다.

```sh
pnpm install
```

2. `run server`<br/>
   서버를 실행한다.

```
pnpm run dev
```

### vscode extension

1. tailwindcss

- `Tailwind CSS IntelliSense` 설치
- `cmd⌘ + shift + p` 에서 `Open User Setting(Json)`을 연 후 `settings.json`에 아래의 내용 추가

```json
{
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "editor.quickSuggestions": {
    "strings": true
  }
}
```

2. import ts alias path

- tsconfig.app.json 에서 설정한 alias path로 auto import 적용 하고 싶은 경우의 설정
- `cmd⌘ + shift + p` > `Preferences: Open Workspace Settings (JSON)` 추가
  ```
  {
    "typescript.preferences.importModuleSpecifier": "non-relative"
  }
  ```
