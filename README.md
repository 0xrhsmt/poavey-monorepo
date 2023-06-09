# Poavey Monorepo

* Poavey is a survey support tools with POAP.
* Features
  * While delivering POAPs, participants can response the survey
  * Survey responses are completely anonymous by zkp-library-Semaphore.


## Live demo

https://poavey-monorepo-fzwai7kvp-0xrhsmt.vercel.app/

## Slides

https://docs.google.com/presentation/d/1RnM6cqsOxhxqObuaUx6vpnFth9hP32jNC1gA3azeW2s/edit#slide=id.ge28d6c1bc8_0_42

## Install and run

```sh
git clone https://github.com/0xrhsmt/poavey-monorepo.git
cd poavey-monorepo
pnpm install

pnpm exec dev
open http://localhost:3000
```

## Apps and Packages

- `web`: [Next.js](https://nextjs.org/) web application.
- `cotracts`: Poavey smart contracts using Semaphore contract for anonymous survey responses.
- `eslint-config-custom`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `tsconfig`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

## Smart Contract architecture

### 1. Event Oraganizers register Poap event to Poavey.

* Event Orgaizer register POAP event to Poavey contract and create Group on Semaphore contract.
* After that, ask permission for Poavey contracts to mint POAP tokens for the target event.（I have not been able to implement it yet.）

<img width="776" alt="Drawing_2023-04-23_11_55_11_excalidraw_-_ryo_vault_-_Obsidian_v1_1_16" src="https://user-images.githubusercontent.com/54972320/233819412-053e3c9d-e728-4d97-862b-9264ea16316a.png">


### 2. Event Participants mint POAP and push identity-commitment to the Group on Semaphore contract.

<img width="806" alt="Drawing_2023-04-23_11_55_11_excalidraw_-_ryo_vault_-_Obsidian_v1_1_16" src="https://user-images.githubusercontent.com/54972320/233819415-1bc7e3ce-20a8-41de-9600-ba8c65d75879.png">


### 3. Submit the survey

* Event Participants　submit the survey to Poavey contract using Relay to hide the source wallet.（I have not yet finished the implementation using Relay.）
* After that, the proof is verified by Semaphore contract to prove that the participant has minted POAP and attend the event.
* It is anonymous subimission survey.

<img width="1046" alt="Drawing_2023-04-23_11_55_11_excalidraw_-_ryo_vault_-_Obsidian_v1_1_16" src="https://user-images.githubusercontent.com/54972320/233819403-26f8b54e-7197-44af-a039-fe743901bcc8.png">
