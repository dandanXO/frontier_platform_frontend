# Monorepo

### init package.json

```sh
pnpm init
```

### config .npmrc

```sh
shamefully-hoist = true
```

### config pnpm.workspace.yaml

```sh
packages:
  - "packages/**"
  - "projects/**"
```

### install package

```sh
// install in all project
pnpm add <package> -w

// install in specific project
pnpm add <package> --filter <project_name>
```
