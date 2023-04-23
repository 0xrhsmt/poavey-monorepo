# Poavey Monorepo

* Poavey is a survey support tools with POAP.
* Features
  * While delivering POAPs, participants can response the survey
  * Survey responses are completely anonymous by zkp-library-Semaphore.

## Install and run

```sh
git clone https://github.com/0xrhsmt/poavey-monorepo.git
cd poavey-monorepo
pnpm install

pnpm exec dev
open http://localhost:3000
```

### Apps and Packages

- `web`: [Next.js](https://nextjs.org/) web application.
- `cotracts`: Poavey smart contracts using Semaphore for anonymous survey responses.
- `eslint-config-custom`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `tsconfig`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

